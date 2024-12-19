import { loadRecipe } from '../actions';
import { toast } from 'sonner';
import { TabKey } from '../types';
import { useActionState, useEffect, useState } from 'react';
import { ScrapeRecipe } from '@/utils/recipe/scraper';
import {
  Button,
  Card,
  CardBody,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  useDisclosure,
} from '@nextui-org/react';
import { useRecipe } from '@/hooks/useRecipe';
import { saveRecipe } from '../actions';
import { RecipePreview } from '@/components/recipe/preview';

export function ImportNewRecipe({
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
            setActiveTab('recipes');
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
