import chromium from '@sparticuz/chromium';
// @ts-expect-error - microdata-node has no types
import { toJson } from 'microdata-node';
import { Page } from 'puppeteer-core';

export type ScrapeRecipe = {
  name: string;
  image: string[] | string;
  description: string;
  recipeCuisine: string;
  prepTime: string;
  cookTime: string;
  totalTime: string;
  keywords: string;
  recipeYield: number | string; // servings
  recipeCategory: string;
  recipeIngredient: string[];
  recipeInstructions:
    | Array<{
        '@type': string;
        name: string;
        text: string;
        url: string;
        image: string;
      }>
    | string;
  nutrition?: {
    servingSize: string;
    calories: string;
    fatContent: string;
    carbohydrateContent: string;
    proteinContent: string;
  };
  datePublished: string;
  dateModified: string;
  author?: { '@type': 'Organization'; name: string };
  cookingMethod?: string;
};

type LangAttribute = 'sv-SE' | 'en-US';

const scrapeWebsite = async (page: Page) => {
  const langAttribute = ((await page.$eval('html', (el) =>
    el.getAttribute('lang'),
  )) || 'en-US') as LangAttribute;

  const ingredientLanguages = {
    'sv-SE': 'Ingredienser',
    'en-US': 'Ingredients',
  };

  const instructionLanguages = {
    'sv-SE': 'Såhär gör du',
    'en-US': 'This is how you do it',
  };

  // Utility function to clean text by trimming, normalizing spaces, etc.
  const cleanText = (text: string) => text.trim().replace(/\s+/g, ' ');

  // Scrape the recipe title
  const name = await page.$eval('h1', (el) => el.innerText);
  const title = name ? cleanText(name) : 'Title not found';

  const splitName = name.split(' ');
  const shortName = splitName
    .slice(0, Math.floor(splitName.length / 2))
    .join(' ');

  let imageSrc = '';

  let image = await (page as any).$x(
    `//img[contains(@alt, '${shortName.toLowerCase().trim()}')]`,
  );
  if (image.length === 0) {
    image = await (page as any).$x(
      `//img[contains(@src, '${title.toLowerCase().trim()}')]`,
    );
  }

  if (image.length > 0) {
    imageSrc =
      (await image[0].evaluate((el: HTMLElement) => el.getAttribute('src'))) ||
      '';
  }

  // Scrape ingredients
  const ingredientsXPath = `//*[contains(text(), '${ingredientLanguages[langAttribute]}')]/following::p[1]//parent::div`;
  const ingredientsElement = await (page as any).$x(ingredientsXPath);
  const ingredientsContent: string =
    ingredientsElement.length > 0
      ? await ingredientsElement[0].evaluate((el: HTMLElement) => el.innerText)
      : '';

  // Scrape instructions
  const instructionsXPath = `//*[contains(text(), '${instructionLanguages[langAttribute]}')]/following::p[1]//parent::div`;
  const instructionsElement = await (page as any).$x(instructionsXPath);
  const instructionsContent =
    instructionsElement.length > 0
      ? await instructionsElement[0].evaluate((el: HTMLElement) => el.innerText)
      : '';

  const recipeInstructions = instructionsContent
    .split('\n')
    .filter((text: string) => text.length > 0)
    .map((text: string) => ({
      '@type': 'HowToStep',
      name: 'Step',
      text,
      url: '',
      image: '',
    }));

  if (
    !title ||
    !ingredientsContent ||
    !instructionsContent ||
    image.length === 0
  ) {
    return null;
  }

  return {
    name: title,
    recipeIngredient: ingredientsContent.split('\n'),
    recipeInstructions,
    image: imageSrc,
  };
};

const scrapeMicrodata = async (page: Page) => {
  const html = await page.content();
  const micro = getMicrodata(html);
  if (!micro) {
    console.error('No microdata found');
    return null;
  }
  return micro;
};

export const getScrapedRecipe = async (
  url: string,
): Promise<ScrapeRecipe | { message: string }> => {
  let browser = null;
  try {
    // Launch the browser in production or development mode depending on the environment
    if (process.env.NODE_ENV === 'production') {
      const puppeteer = await import('puppeteer-core');
      browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(
          'https://github.com/Sparticuz/chromium/releases/download/v122.0.0/chromium-v122.0.0-pack.tar',
        ),
        headless: true,
        // ignoreHTTPSErrors: true,
      });
    } else if (process.env.NODE_ENV === 'development') {
      const puppeteer = await import('puppeteer-core');
      const { executablePath } = await import('puppeteer');
      browser = await puppeteer.launch({
        executablePath: executablePath(),
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        headless: true,
      });
    }

    if (!browser) {
      throw new Error('Failed to launch browser');
    }
    const page = await browser.newPage();
    await page.goto(url);

    // Get all scripts of type "application/ld+json" from the provided url
    const jsonLdData = await page.evaluate(() => {
      const scriptTags = Array.from(
        document.querySelectorAll('script[type="application/ld+json"]'),
      );
      return scriptTags.map((script) => script.innerHTML);
    });

    let scriptWithRecipeData: string = '';

    // Find the correct json string
    jsonLdData.forEach((jsonString: string) => {
      if (
        jsonString.includes('recipeIngredient') &&
        jsonString.includes('recipeInstructions')
      ) {
        scriptWithRecipeData = jsonString;
      }
    });

    if (!scriptWithRecipeData) {
      console.log('No application/ld+json scripts');
      const micro = await scrapeMicrodata(page);
      if (!micro) {
        const data = await scrapeWebsite(page);
        if (!data) {
          throw new Error('No recipe data found');
        }
        scriptWithRecipeData = JSON.stringify(data);
      }
    }

    // Parse the correct json string
    const rawRecipeData: ScrapeRecipe = JSON.parse(scriptWithRecipeData);
    return rawRecipeData;
  } catch (error) {
    console.error(error);
    return {
      message: 'Det gick tyvärr inte att ladda något recept från den URL:en',
    };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

type JsonPropertyValue = string | boolean | number | JsonItem;
type JsonItem = {
  id?: string;
  type?: string[];
  properties: { [key: string]: JsonPropertyValue[] };
};
type JsonResult = { items: JsonItem[] };

const getMicrodata = (html: string) => {
  const meta = toJson(html) as JsonResult;
  if (!meta || !meta.items || !meta.items[0]) {
    return null;
  }
  const recipe = Object.values(meta.items).find(
    (item) => item.type && item.type[0].indexOf('Recipe') > -1,
  );
  return recipe;
};
