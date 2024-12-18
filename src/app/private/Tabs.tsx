'use client';
import { Tabs, Tab } from '@nextui-org/tabs';
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  Chip,
  cn,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  Textarea,
  TimeInput,
  useDisclosure,
} from '@nextui-org/react';
import { IconsCalendar } from '@/components/icons/calendar.icon';
import { IconsTaskAdd } from '@/components/icons/add-task.icon';
import { IconsFavourite } from '@/components/icons/heart.icon';
import { loadRecipe } from '../actions';
import { useActionState, useEffect, useRef, useState } from 'react';
import { ScrapeRecipe } from '@/utils/recipe/scraper';
import { RecipePreview } from '@/components/recipe/preview';
import {
  getRecipe,
  getRecipes,
  Recipe,
  RecipeList,
  saveRecipe,
} from './actions';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { RecipeView } from '@/components/recipe/view';
import { serialize } from 'tinyduration';
import { Time } from '@internationalized/date';
import { toast } from 'sonner';
import { useRecipe } from '@/hooks/useRecipe';
import { IconsRow } from '@/components/icons/row.icon';
import { IconsGrid } from '@/components/icons/grid.icon';

type TabKey = 'recipies' | 'add' | 'week';

export function PageTabs() {
  const [activeTab, setActiveTab] = useLocalStorage('tab', null) as [
    TabKey,
    (key: TabKey) => void
  ];
  return (
    <Tabs
      aria-label="Options"
      placement="bottom"
      fullWidth
      radius="full"
      disableAnimation
      variant="underlined"
      classNames={{
        // wrapper: "h-full justify-between",
        // bg-default-100
        base: 'fixed w-full z-20 bottom-0 bg-black py-1',
        tabContent: 'group-data-[selected=true]:text-[#06b6d4]',
        panel: 'mx-2 flex flex-col gap-2 mb-10',
      }}
      selectedKey={activeTab}
      onSelectionChange={(key) => setActiveTab(key as TabKey)}
    >
      <Tab key="recipies" title={<IconsFavourite className="h-6 w-6" />}>
        <Recipes />
      </Tab>
      <Tab key="add" title={<IconsTaskAdd className="h-6 w-6" />}>
        <ImportNewRecipe setActiveTab={setActiveTab} />
        <CreateNewRecipe />
      </Tab>
      <Tab key="week" title={<IconsCalendar className="h-6 w-6" />}>
        <Card>
          <CardBody>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </CardBody>
        </Card>
      </Tab>
    </Tabs>
  );
}

function ImportNewRecipe({
  setActiveTab,
}: {
  setActiveTab: (key: TabKey) => void;
}) {
  const [newRecipe, setNewRecipe] = useState<null | ScrapeRecipe>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [state, formAction, isPending] = useActionState(loadRecipe, {
    message: 'nothing',
  });
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { action } = useRecipe();

  useEffect(() => {
    if (!Object.keys(state).includes('message')) {
      setNewRecipe(state as ScrapeRecipe);
      onOpen();
    }
  }, [state]);

  const onSave = async (close: () => void) => {
    setIsSaving(true);
    const response = await saveRecipe(newRecipe as ScrapeRecipe);
    close();
    setIsSaving(false);
    if (response.status === 'error') {
      toast.error('Något gick fel');
    } else {
      toast.success('Receptet har sparats', {
        description: 'Vill du kolla på receptet?',
        action: {
          label: 'Titta',
          onClick: () => {
            setActiveTab('recipies');
            action({ type: 'update', data: { id: response.id as string } });
          },
        },
      });
    }
  };

  return (
    <Card>
      <CardBody>
        <h2 className="text-large font-bold pb-2">Importera recept från URL</h2>
        <form className="flex flex-col gap-2" action={formAction}>
          <Input
            label="Recept URL"
            id="url"
            name="url"
            type="text"
            placeholder="Skriv en giltig URL"
            errorMessage={
              (state as { message: string }).message === 'nothing'
                ? ''
                : (state as { message: string }).message
            }
            isInvalid={'message' in state && state.message !== 'nothing'}
            isRequired
          />
          <Button
            color="primary"
            variant="flat"
            size="sm"
            type="submit"
            disabled={isPending}
          >
            Ladda recept
          </Button>
        </form>
        {isPending ? (
          <Spinner className="my-2" />
        ) : (
          <>
            {newRecipe ? (
              <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                scrollBehavior="inside"
                placement="center"
                size="2xl"
                backdrop="blur"
              >
                <ModalContent>
                  {(onClose) => (
                    <>
                      <ModalHeader className="flex flex-col gap-1">
                        Lägg till recept - {newRecipe.name}
                      </ModalHeader>
                      <ModalBody>
                        <RecipePreview recipe={newRecipe} />
                      </ModalBody>
                      <ModalFooter>
                        <Button
                          size="sm"
                          color="danger"
                          variant="light"
                          onPress={onClose}
                          disabled={isSaving}
                        >
                          Stäng
                        </Button>
                        <Button
                          size="sm"
                          color="primary"
                          onPress={() => onSave(onClose)}
                          isLoading={isSaving}
                        >
                          Spara
                        </Button>
                      </ModalFooter>
                    </>
                  )}
                </ModalContent>
              </Modal>
            ) : null}
          </>
        )}
      </CardBody>
    </Card>
  );
}

// function transformAndSaveRecipe(prevState: any, formData: FormData) {
//   const recipe = {
//     name: formData.get('name') as string,
//     image: formData.get('image') as string,
//     description: formData.get('description') as string,
//     recipeCuisine: formData.get('recipeCuisine') as string,
//     prepTime: formData.get('prepTime') as string,
//     cookTime: formData.get('cookTime') as string,
//     totalTime: formData.get('totalTime') as string,
//     keywords: formData.get('keywords') as string,
//     recipeYield: formData.get('recipeYield') as string,
//     recipeCategory: formData.get('recipeCategory') as string,
//     recipeIngredient: (formData.get('recipeIngredient') as string).split('\n'),
//     recipeInstructions: [],
//     nutrition: {
//       servingSize: '',
//       calories: '',
//       fatContent: '',
//       carbohydrateContent: '',
//       proteinContent: '',
//     },
//     datePublished: new Date().toISOString(),
//     dateModified: new Date().toISOString(),
//     // nutrition: (formData.get('nutrition') as string).split('\n'),
//   };

//   return saveRecipe(recipe);
// }

function transformRecipe(prevState: any, formData: FormData) {
  const totalTime = formData.get('totalTime') as string;
  const [hours, minutes] = totalTime.split(':');
  const recipe = {
    name: formData.get('name') as string,
    image:
      formData.get('image') instanceof File
        ? formData.get('preview') === 'true'
          ? URL.createObjectURL(formData.get('image') as File)
          : (formData.get('image') as File)
        : '',
    description: formData.get('description') as string,
    recipeCuisine: formData.get('recipeCuisine') as string,
    prepTime: formData.get('prepTime') as string,
    cookTime: formData.get('cookTime') as string,
    totalTime: serialize({
      years: 0,
      months: 0,
      days: 0,
      hours: hours ? Number(hours) : 0,
      minutes: minutes ? Number(minutes) : 0,
      seconds: 0,
    }),
    keywords: formData.get('keywords') as string,
    recipeYield: formData.get('recipeYield') as string,
    recipeCategory: formData.get('recipeCategory') as string,
    recipeIngredient: (formData.get('recipeIngredient') as string).split('\n'),
    recipeInstructions: (formData.get('recipeInstructions') as string)
      .split('\n')
      .map((text, index) => ({
        '@type': 'HowToStep',
        name: `Step ${index + 1}`,
        text,
        url: '',
        image: '',
      })),
    // nutrition: {
    //   servingSize: '',
    //   calories: '',
    //   fatContent: '',
    //   carbohydrateContent: '',
    //   proteinContent: '',
    // },
    datePublished: new Date().toISOString(),
    dateModified: new Date().toISOString(),
  };

  if (formData.get('preview') !== 'true') {
    return saveRecipe(recipe);
  }

  return { status: 'preview', recipe };
}

function CreateNewRecipe() {
  const [previewRecipe, setPreviewRecipe] = useState<null | ScrapeRecipe>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [_state, formAction, isPending] = useActionState(transformRecipe, null);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <Card>
      <CardBody>
        <h2 className="text-large font-bold pb-2">Skapa nytt recept</h2>
        <form className="flex flex-col gap-2" action={formAction} ref={formRef}>
          <Input
            label="Namn"
            id="name"
            name="name"
            type="text"
            placeholder="Namn på recept"
            isRequired
          />
          <Input
            label="Bild"
            id="image"
            name="image"
            type="file"
            placeholder="Bildfil"
            isRequired
          />
          <Textarea
            label="Beskrivning"
            id="description"
            name="description"
            placeholder="Beskriv receptet"
          />
          <TimeInput
            label="Total tid"
            id="totalTime"
            name="totalTime"
            hourCycle={24}
            hideTimeZone
            defaultValue={new Time(0, 0)}
            granularity="minute"
          />
          <Input
            label="Portioner"
            id="recipeYield"
            name="recipeYield"
            type="text"
            placeholder="Antal portioner"
          />
          <Input
            label="Kategori"
            id="recipeCategory"
            name="recipeCategory"
            type="text"
            placeholder="Kategori"
          />
          <Textarea
            label="Ingredienser"
            id="recipeIngredient"
            name="recipeIngredient"
            placeholder="skriv en ingrediens per rad"
            isRequired
          />
          <Textarea
            label="Instruktioner"
            id="recipeInstructions"
            name="recipeInstructions"
            placeholder="skriv en instruktion per rad"
            isRequired
          />

          <div className="flex flex-row gap-2">
            <Button
              color="secondary"
              variant="flat"
              size="sm"
              type="button"
              fullWidth
              onClick={() => {
                const elements = (formRef.current as HTMLFormElement).elements;
                const formData = new FormData();
                for (let i = 0; i < elements.length; i++) {
                  const element = elements[i] as HTMLInputElement;
                  if (element.type === 'file') {
                    formData.append(element.name, element.files?.[0] as File);
                    continue;
                  }
                  formData.append(element.name, element.value);
                }
                formData.append('preview', 'true');
                const { recipe } = transformRecipe(null, formData) as {
                  recipe: ScrapeRecipe;
                };
                setPreviewRecipe(recipe);
                onOpen();
              }}
            >
              Förhandsgranska
            </Button>
            <Button
              color="primary"
              variant="flat"
              size="sm"
              type="submit"
              disabled={isPending}
              fullWidth
            >
              Spara
            </Button>
          </div>
        </form>
        {previewRecipe ? (
          <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            scrollBehavior="inside"
            placement="center"
            size="2xl"
            backdrop="blur"
          >
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    Förhandsgranska recept - {previewRecipe.name}
                  </ModalHeader>
                  <ModalBody>
                    <RecipePreview recipe={previewRecipe} />
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      size="sm"
                      color="danger"
                      variant="light"
                      onPress={onClose}
                    >
                      Stäng
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        ) : null}
      </CardBody>
    </Card>
  );
}

function Recipes() {
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

  return (
    <>
      <ButtonGroup className="flex justify-start">
        <Button
          isIconOnly
          variant={columns === 1 ? 'flat' : 'solid'}
          size="sm"
          onClick={() => setColumns(1)}
        >
          <IconsRow className="h-5 w-5" />
        </Button>
        <Button
          isIconOnly
          variant={columns === 2 ? 'flat' : 'solid'}
          size="sm"
          onClick={() => setColumns(2)}
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
                  className="absolute right-2 top-2 z-10 backdrop-blur-md bg-black/30"
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
