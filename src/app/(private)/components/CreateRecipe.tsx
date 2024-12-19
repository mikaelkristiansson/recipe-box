import { RecipePreview } from '@/components/recipe/preview';
import { ScrapeRecipe } from '@/utils/recipe/scraper';
import {
  useDisclosure,
  Card,
  CardBody,
  Textarea,
  TimeInput,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
} from '@nextui-org/react';
import { serialize } from 'tinyduration';
import { Time } from '@internationalized/date';
import { useState, useRef, useActionState } from 'react';
import { saveRecipe } from '../actions';

function transformRecipe(_prevState: any, formData: FormData) {
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

export function CreateNewRecipe() {
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
              onPress={() => {
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
