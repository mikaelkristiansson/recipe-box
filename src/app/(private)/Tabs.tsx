'use client';
import { Tabs, Tab } from '@nextui-org/tabs';
import { Card, CardBody } from '@nextui-org/react';
import { IconsCalendar } from '@/components/icons/calendar.icon';
import { IconsTaskAdd } from '@/components/icons/add-task.icon';
import { IconsFavourite } from '@/components/icons/heart.icon';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { TabKey } from '../types';
import { ImportNewRecipe } from './components/ImportRecipe';
import { CreateNewRecipe } from './components/CreateRecipe';
import { Recipes } from './components/Recipes';

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
      variant="light"
      classNames={{
        // wrapper: "h-full justify-between",
        base: 'fixed w-full z-20 bottom-0 bg-background py-1',
        tab: 'data-[selected=true]:bg-transparent',
        tabContent: 'group-data-[selected=true]:text-[#06b6d4]',
        panel: 'mx-2 flex flex-col gap-2 mb-10',
      }}
      selectedKey={activeTab}
      onSelectionChange={(key) => setActiveTab(key as TabKey)}
    >
      <Tab key="recipes" title={<IconsFavourite className="h-6 w-6" />}>
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
