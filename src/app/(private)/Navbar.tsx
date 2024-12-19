'use client';
import { Navbar, NavbarBrand, NavbarContent } from '@nextui-org/navbar';
import { Avatar } from '@nextui-org/avatar';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@nextui-org/dropdown';
import { signOut } from '../login/actions';
import { useAuth } from '@/hooks/useAuth';
import { IconsUserCircle } from '@/components/icons/user.icon';
import { IconsPackageOpen } from '@/components/icons/box.icon';
import {
  Card,
  CardBody,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/react';
import { IconsLogout } from '@/components/icons/log-out.icon';
import { IconsSettings } from '@/components/icons/settings.icon';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';

const acronym = (str: string) =>
  str
    .split(/\s/)
    .reduce((response, word) => (response += word.slice(0, 1)), '');

export function NavigationBar() {
  const user = useAuth();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Navbar maxWidth="full">
        <NavbarBrand>
          <Chip
            startContent={<IconsPackageOpen size={18} />}
            variant="flat"
            color="secondary"
          >
            Recipe Box
          </Chip>
        </NavbarBrand>
        <NavbarContent as="div" justify="end">
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                name={
                  user
                    ? acronym(
                        `${user?.user_metadata.first_name} ${user?.user_metadata.last_name}`
                      )
                    : undefined
                }
                icon={
                  <IconsUserCircle
                    className="animate-pulse w-6 h-6 text-default-500"
                    fill="currentColor"
                    size={20}
                  />
                }
                size="sm"
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem
                key="settings"
                textValue="Settings"
                onPress={onOpen}
              >
                <span className="flex flex-row items-center gap-2">
                  <IconsSettings size={18} /> Settings
                </span>
              </DropdownItem>
              <DropdownItem
                key="logout"
                color="danger"
                onPress={signOut}
                textValue="Log Out"
              >
                <span className="flex flex-row items-center gap-2">
                  <IconsLogout size={18} /> Log Out
                </span>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>
      </Navbar>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
        <ModalContent>
          <ModalHeader>Inställningar</ModalHeader>
          <ModalBody>
            <Card>
              <CardBody>
                <h2 className="text-md font-semibold pb-1">Tema</h2>
                <ThemeSwitcher />
              </CardBody>
            </Card>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
