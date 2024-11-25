import { ScrapeRecipe } from '@/utils/recipe/scraper';
import {
  Image,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react';
import { parse } from 'tinyduration';
import { IconsHourglass } from '../icons/hourglass.icon';

function durationToStr(d: string) {
  if (!d) return '';
  const parsed = parse(d);
  const result = [];
  if (parsed.hours) {
    result.push(`${parsed.hours} timmar`);
  }
  if (parsed.minutes) {
    result.push(`${parsed.minutes} minuter`);
  }
  if (parsed.seconds) {
    result.push(`${parsed.seconds} sekunder`);
  }

  const formatter = new Intl.ListFormat('sv', {
    style: 'long',
    type: 'conjunction',
  });
  return formatter.format(result);
}

// function parseDuration(duration: string) {
//   const parsed = parse(duration);
//   let totalTime = '';
//   if (parsed.hours) {
//     totalTime += `(${parsed.hours} timmar`;
//   }
//   if (parsed.minutes) {
//     const minutes = `${parsed.minutes} minuter`;
//     totalTime += parsed.hours ? ` ${minutes})` : `(${minutes})`;
//   }
//   return totalTime;
// }

export function RecipePreview(props: { recipe: ScrapeRecipe }) {
  const { recipe } = props;
  console.log('🚀 ~ RecipePreview ~ recipe:', recipe);

  return (
    <>
      {recipe.image && (
        <Image
          shadow="md"
          radius="md"
          width="100%"
          alt={recipe.name}
          className="w-full object-cover h-[240px]"
          src={
            typeof recipe.image === 'string' ? recipe.image : recipe.image[0]
          }
        />
      )}

      <div className="w-full flex flex-col basis-full">
        <div className="flex flex-row justify-between items-center">
          <h2 className="text-2xl font-bold">{recipe.name}</h2>
          {recipe.recipeCategory}
        </div>
        {recipe.totalTime ? (
          <span className="flex flex-row items-center text-sm font-thin">
            <IconsHourglass size={14} />
            {durationToStr(recipe.totalTime) || '0 minuter'}
          </span>
        ) : null}
        <p className="py-2">{recipe.description}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div className="w-full flex flex-col basis-1/2">
          <Table removeWrapper aria-labelledby="ingredients">
            <TableHeader>
              <TableColumn>
                Ingredienser {recipe.recipeYield} portioner
              </TableColumn>
            </TableHeader>
            <TableBody>
              {recipe.recipeIngredient.map((ingredient, index) => (
                <TableRow key={String(index)}>
                  <TableCell>{ingredient}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="w-full flex flex-col basis-1/2">
          <Table removeWrapper aria-labelledby="instructions">
            <TableHeader>
              <TableColumn>Instruktioner</TableColumn>
            </TableHeader>
            <TableBody>
              {typeof recipe.recipeInstructions === 'string' ? (
                <TableRow key="1">
                  <TableCell>
                    <div className="flex flex-row gap-2 py-1 items-center">
                      <div>
                        <span className="w-5 h-5 relative rounded-full text-xs text-primary-500 bg-primary-100 border border-primary-300/50 flex justify-center items-center">
                          1
                        </span>
                      </div>
                      {recipe.recipeInstructions}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                recipe.recipeInstructions.map((instruction, index) => (
                  <TableRow key={String(index)}>
                    <TableCell>
                      <div className="flex flex-row gap-2 py-1 items-center">
                        <div>
                          <span className="w-5 h-5 relative rounded-full text-xs text-primary-500 bg-primary-100 border border-primary-300/50 flex justify-center items-center">
                            {index + 1}
                          </span>
                        </div>
                        {instruction.url ? (
                          <a
                            href={instruction.url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {instruction.text}
                          </a>
                        ) : (
                          <span>{instruction.text}</span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <div className="w-full flex flex-col basis-1/2">
          {recipe.nutrition && (
            <Table removeWrapper aria-labelledby="nutrition">
              <TableHeader>
                <TableColumn>Näring per portion</TableColumn>
              </TableHeader>
              <TableBody>
                <TableRow key="1">
                  <TableCell>Kalorier: {recipe.nutrition.calories}</TableCell>
                </TableRow>
                <TableRow key="2">
                  <TableCell>Fet: {recipe.nutrition.fatContent}</TableCell>
                </TableRow>
                <TableRow key="3">
                  <TableCell>
                    Kolhydrater: {recipe.nutrition.carbohydrateContent}
                  </TableCell>
                </TableRow>
                <TableRow key="4">
                  <TableCell>
                    Protein: {recipe.nutrition.proteinContent}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </>
  );
}
