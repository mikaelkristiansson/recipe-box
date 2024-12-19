'use client';

import { Tab, Tabs } from '@nextui-org/react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { IconsSun } from './icons/sun.icon';
import { IconsMoon } from './icons/moon.icon';
import { IconsComputer } from './icons/computer.icon';

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { setTheme, theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Tabs
      aria-label="theme"
      variant="bordered"
      defaultSelectedKey={theme}
      fullWidth
      classNames={
        {
          // wrapper: "h-full justify-between",
          //   base: 'fixed w-full z-20 bottom-0 bg-background pt-2 pb-4',
          //   tab: 'data-[selected=true]:bg-transparent group-data-[selected=true]:bg-transparent px-4',
          //   tabContent: 'group-data-[selected=true]:bg-transparent',
          //   tabList: 'shadow-none border-1 gap-1',
          //   panel: 'mx-2 flex flex-col gap-2 mb-16',
        }
      }
      onSelectionChange={(key) => setTheme(key as string)}
    >
      <Tab
        key="light"
        title={
          <div className="flex items-center space-x-2">
            <IconsSun className="w-6 h-6" />
            <span>Light</span>
          </div>
        }
      />
      <Tab
        key="dark"
        title={
          <div className="flex items-center space-x-2">
            <IconsMoon className="w-6 h-6" />
            <span>Dark</span>
          </div>
        }
      />
      <Tab
        key="system"
        title={
          <div className="flex items-center space-x-2">
            <IconsComputer className="w-6 h-6" />
            <span>System</span>
          </div>
        }
      />
    </Tabs>
  );
}
