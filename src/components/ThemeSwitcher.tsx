'use client';

import { SwitchProps, useSwitch, VisuallyHidden } from '@nextui-org/react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { IconsSun } from './icons/sun.icon';
import { IconsMoon } from './icons/moon.icon';

export function ThemeSwitcher(props: SwitchProps) {
  const [mounted, setMounted] = useState(false);
  const { setTheme } = useTheme();
  const {
    Component,
    slots,
    isSelected,
    getBaseProps,
    getInputProps,
    getWrapperProps,
  } = useSwitch(props);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isSelected) {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  }, [isSelected]);

  if (!mounted) return null;

  return (
    <Component {...getBaseProps()}>
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>
      <div
        {...getWrapperProps()}
        className={slots.wrapper({
          class: [
            'w-8 h-8',
            'flex items-center justify-center',
            'rounded-full bg-default-100 hover:bg-default-200',
            'group-data-[selected=true]:bg-default-100 group-data-[selected=true]:hover:bg-default-200',
          ],
        })}
      >
        {isSelected ? <IconsSun /> : <IconsMoon />}
      </div>
    </Component>
  );
}
