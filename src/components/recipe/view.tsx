import {
  Image,
  Link,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react';
import { parse } from 'tinyduration';
import { IconsHourglass } from '../icons/hourglass.icon';
import { Recipe } from '@/app/types';

export function RecipeView(props: { recipe: Recipe }) {
  const { recipe } = props;
  const duration = parse(recipe.total_time);
  //TODO: convert to real time
  let totalTime = '';
  if (duration.hours) {
    totalTime += `(${duration.hours} timmar`;
  }
  if (duration.minutes) {
    const minutes = `${duration.minutes} minuter`;
    totalTime += duration.hours ? ` ${minutes})` : `(${minutes})`;
  }
  return (
    <>
      <Image
        shadow="md"
        radius="md"
        width="100%"
        alt={recipe.name}
        className="w-full object-cover h-[240px]"
        src={typeof recipe.image === 'string' ? recipe.image : recipe.image[0]}
      />

      <div className="w-full flex flex-col basis-full">
        <div className="flex flex-row justify-between items-center">
          <h2 className="text-2xl font-bold">{recipe.name}</h2>
          {recipe.category}
        </div>
        <span className="flex flex-row items-center text-sm font-thin">
          <IconsHourglass size={14} />
          {totalTime}
        </span>
        <p className="py-2">{recipe.description}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div className="w-full flex flex-col basis-1/2">
          <Table removeWrapper aria-labelledby="ingredients">
            <TableHeader>
              <TableColumn>Ingredienser {recipe.yield} portioner</TableColumn>
            </TableHeader>
            <TableBody>
              {recipe.ingredients.map((ingredient, index) => (
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
              {recipe.instructions.map((instruction, index) => (
                <TableRow key={String(index)}>
                  <TableCell>
                    <div className="flex flex-row gap-2 py-2 items-center">
                      <div>
                        <span className="w-5 h-5 relative rounded-full text-xs text-primary-500 bg-primary-100 border border-primary-300/50 flex justify-center items-center">
                          {index + 1}
                        </span>
                      </div>
                      <span>{instruction.text}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
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
      {recipe.url && (
        <Link
          isBlock
          showAnchorIcon
          isExternal
          href={recipe.url}
          underline="always"
          rel="noreferrer"
        >
          {recipe.url}
        </Link>
      )}
    </>
  );
}
