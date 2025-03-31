import type { Page } from 'playwright';
import chromium from "playwright-aws-lambda";
// @ts-expect-error - microdata-node has no types
import { toJson } from 'microdata-node';

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

const scrapeWebsite = async (page: Page) => {
  const langAttribute =
    (await page.locator('html').first().getAttribute('lang')) || 'en-US';
  const ingredientLanguages = {
    'sv-SE': 'Ingredienser',
    'en-US': 'Ingredients',
  } as { [key: string]: string };

  const instructionLanguages = {
    'sv-SE': 'Såhär gör du',
    'en-US': 'This is how you do it',
  } as { [key: string]: string };

  // Scrape the recipe using advanced techniques
  // Utility function to clean text by trimming, normalizing spaces, etc.
  const cleanText = (text: string) => text.trim().replace(/\s+/g, ' ');
  const h1 = page.locator('h1').first();
  const name = await h1.innerText();

  // Scrape the title
  const title = h1 ? cleanText(name) : 'Title not found';
  const splitName = name.split(' ');
  const shortName = splitName
    .slice(0, Math.floor(splitName.length / 2))
    .join(' ');
  let imageSrc = '';
  let image = page
    .locator(`//img[contains(@alt, '${shortName.toLowerCase().trim()}')]`)
    .first();
  if (!image) {
    image = page
      .locator(`//img[contains(@src, '${title.toLowerCase().trim()}')]`)
      .first();
  }
  if (image) {
    imageSrc = (await image.getAttribute('src')) || '';
  }

  const ingredients = page
    .locator(
      `//*[contains(text(), '${ingredientLanguages[langAttribute]}')]/following::p[1]//parent::div`
    )
    .first();
  const ingredientsContent = await ingredients.innerText();

  const instructions = page
    .locator(
      `//*[contains(text(), '${instructionLanguages[langAttribute]}')]/following::p[1]//parent::div`
    )
    .first();
  const instructionsContent = await instructions.innerText();
  const recipeInstructions = instructionsContent
    .split('\n')
    .filter((text) => text.length > 0)
    .map((text) => ({
      '@type': 'HowToStep',
      name: 'Step',
      text,
      url: '',
      image: '',
    }));

  if (!title || !ingredientsContent || !instructionsContent || !image) {
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
  url: string
): Promise<ScrapeRecipe | { message: string }> => {
  let browser = null;
  try {
    browser = await chromium.launchChromium({
      headless: true,
    });
    const context = await browser.newContext();

    const page = await context.newPage();
    await page.goto(url);

    // Get all scripts of type "application/ld+json" from the provided url
    const jsonLdData: string[] = await page.evaluate(() => {
      const scriptTags: NodeListOf<HTMLScriptElement> =
        document.querySelectorAll('script[type="application/ld+json"]');

      const data: string[] = [];

      scriptTags.forEach((scriptTag: HTMLScriptElement) => {
        data.push(scriptTag.innerHTML);
      });

      return data;
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
    await browser.close();

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
    (item) => item.type && item.type[0].indexOf('Recipe') > -1
  );
  return recipe;
};
