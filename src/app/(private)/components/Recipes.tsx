import { useEffect, useState } from 'react';
import { getRecipe, getRecipes } from '../actions';
import { useRecipe } from '@/hooks/useRecipe';
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  Chip,
  cn,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Spinner,
  useDisclosure,
} from '@nextui-org/react';
import { IconsRow } from '@/components/icons/row.icon';
import { IconsGrid } from '@/components/icons/grid.icon';
import { RecipeView } from '@/components/recipe/view';
import { Recipe, RecipeList } from '@/app/types';

export function Recipes() {
  const [list, setList] = useState<null | RecipeList[]>(null);
  const [activeRecipe, setActiveRecipe] = useState<null | Recipe>(null);
  const { recipe, action } = useRecipe();
  const [columns, setColumns] = useState(1);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  useEffect(() => {
    getRecipes().then((data) => setList(data));
  }, []);

  useEffect(() => {
    if (recipe.id) {
      openRecipe(recipe.id);
    }
  }, [recipe]);

  const openRecipe = async (id: string) => {
    const recipe = await getRecipe(id);
    setActiveRecipe(recipe);
    onOpen();
  };

  if (!list) return <Spinner />;

  return (
    <>
      <ButtonGroup className="flex justify-start">
        <Button
          isIconOnly
          variant={columns === 1 ? 'flat' : 'solid'}
          size="sm"
          onPress={() => setColumns(1)}
        >
          <IconsRow className="h-5 w-5" />
        </Button>
        <Button
          isIconOnly
          variant={columns === 2 ? 'flat' : 'solid'}
          size="sm"
          onPress={() => setColumns(2)}
        >
          <IconsGrid className="h-5 w-5" />
        </Button>
      </ButtonGroup>
      <div
        className={cn(
          'gap-2 grid sm:grid-cols-4',
          columns === 1 ? 'grid-cols-1' : 'grid-cols-2'
        )}
      >
        {list?.map((item) => (
          <Card
            shadow="sm"
            key={item.id}
            isPressable
            onPress={() => action({ type: 'update', data: { id: item.id } })}
          >
            <CardBody className="overflow-visible p-0">
              <Image
                shadow="sm"
                radius="none"
                width="100%"
                alt={item.name}
                className="w-full object-cover h-[140px]"
                src={item.image}
              />
              {item.category && (
                <Chip
                  variant="flat"
                  size="sm"
                  className="absolute right-2 top-2 z-10 backdrop-blur-md bg-black/30 text-white"
                >
                  {item.category}
                </Chip>
              )}
            </CardBody>
            <CardFooter className="text-small justify-between">
              <b className="text-left">{item.name}</b>
            </CardFooter>
          </Card>
        ))}
        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          scrollBehavior="inside"
          placement="center"
          size="full"
          onClose={() => action({ type: 'update', data: { id: null } })}
        >
          <ModalContent>
            <>
              <ModalHeader className="flex flex-col gap-1">
                {activeRecipe?.name}
              </ModalHeader>
              <ModalBody>
                {activeRecipe ? (
                  <RecipeView recipe={activeRecipe} />
                ) : (
                  <Spinner />
                )}
              </ModalBody>
            </>
          </ModalContent>
        </Modal>
      </div>
    </>
  );
}
