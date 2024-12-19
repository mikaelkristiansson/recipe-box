import { useEffect, useState } from 'react';
import { deleteRecipe, getRecipe } from '../actions';
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
  ModalFooter,
  ModalHeader,
  Skeleton,
  Spinner,
  useDisclosure,
} from '@nextui-org/react';
import { IconsRow } from '@/components/icons/row.icon';
import { IconsGrid } from '@/components/icons/grid.icon';
import { RecipeView } from '@/components/recipe/view';
import { Recipe } from '@/app/types';
import { useRecipeList } from '@/hooks/useRecipeList';

export function Recipes() {
  const [activeRecipe, setActiveRecipe] = useState<null | Recipe>(null);
  const { recipe, action } = useRecipe();
  const [columns, setColumns] = useState(1);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { recipes, action: listAction } = useRecipeList();

  useEffect(() => {
    if (recipe.id) {
      onOpen();
      openRecipe(recipe.id);
    }
  }, [recipe]);

  const openRecipe = async (id: string) => {
    const recipe = await getRecipe(id);
    setActiveRecipe(recipe);
  };

  if (!recipes) return <Spinner />;

  return (
    <>
      <ButtonGroup className="flex justify-start">
        <Button
          isIconOnly
          variant="flat"
          size="sm"
          className={cn(columns === 1 && 'bg-gray-200')}
          onPress={() => setColumns(1)}
        >
          <IconsRow className="h-5 w-5" />
        </Button>
        <Button
          isIconOnly
          variant="flat"
          size="sm"
          className={cn(columns === 2 && 'bg-gray-200')}
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
        {recipes.map((item) => (
          <Card
            key={item.id}
            isPressable
            onPress={() => {
              action({ type: 'update', data: { id: item.id } });
            }}
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
          onClose={() => {
            action({ type: 'update', data: { id: null } });
            setActiveRecipe(null);
          }}
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
                  <>
                    <Skeleton className="rounded-lg">
                      <div className="h-[240px] rounded-lg bg-default-300" />
                    </Skeleton>
                    <div className="space-y-3">
                      <Skeleton className="w-3/5 rounded-lg">
                        <div className="h-3 w-3/5 rounded-lg bg-default-200" />
                      </Skeleton>
                      <Skeleton className="w-4/5 rounded-lg">
                        <div className="h-3 w-4/5 rounded-lg bg-default-200" />
                      </Skeleton>
                      <Skeleton className="w-2/5 rounded-lg">
                        <div className="h-3 w-2/5 rounded-lg bg-default-300" />
                      </Skeleton>
                    </div>
                  </>
                )}
              </ModalBody>
              {activeRecipe ? (
                <ModalFooter>
                  <Button
                    variant="flat"
                    size="sm"
                    color="danger"
                    type="button"
                    onPress={() =>
                      deleteRecipe(activeRecipe.id).then(() => {
                        onOpenChange();
                        listAction({ type: 'delete', data: activeRecipe });
                      })
                    }
                  >
                    Ta bort recept
                  </Button>
                </ModalFooter>
              ) : null}
            </>
          </ModalContent>
        </Modal>
      </div>
    </>
  );
}
