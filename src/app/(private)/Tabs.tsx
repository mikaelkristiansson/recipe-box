'use client';
import { Tabs, Tab } from '@nextui-org/tabs';
import { Card, CardBody } from '@nextui-org/react';
import { IconsCalendar } from '@/components/icons/calendar.icon';
import { IconsTaskAdd } from '@/components/icons/add-task.icon';
import { IconsFavourite } from '@/components/icons/heart.icon';
import { TabKey } from '../types';
import { ImportNewRecipe } from './components/ImportRecipe';
import { CreateNewRecipe } from './components/CreateRecipe';
import { Recipes } from './components/Recipes';
import { useRecipeList } from '@/hooks/useRecipeList';
import { getRecipes, updateActiveTab } from './actions';
import { useEffect, useState } from 'react';

export function PageTabs({ activeTab }: { activeTab: TabKey }) {
  const [tab, setTab] = useState<TabKey>(activeTab);
  const { action } = useRecipeList();

  useEffect(() => {
    getRecipes().then((data) => action({ type: 'set', data }));
  }, []);

  const setActiveTab = (key: TabKey) => {
    setTab(key);
    updateActiveTab(key);
  };

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
        base: 'fixed w-full z-20 bottom-0 bg-background pt-2 pb-4',
        tab: 'data-[selected=true]:bg-transparent',
        tabContent: 'group-data-[selected=true]:text-[#06b6d4]',
        panel: 'mx-2 flex flex-col gap-2 mb-16',
      }}
      selectedKey={tab}
      onSelectionChange={(key) => setActiveTab(key as TabKey)}
    >
      <Tab key="recipes" title={<IconsFavourite className="h-6 w-6" />}>
        <Recipes />
      </Tab>
      <Tab key="add" title={<IconsTaskAdd className="h-6 w-6" />}>
        <ImportNewRecipe setActiveTab={setActiveTab} />
        <CreateNewRecipe setActiveTab={setActiveTab} />
      </Tab>
      <Tab key="week" title={<IconsCalendar className="h-6 w-6" />}>
        <Card shadow="sm">
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
