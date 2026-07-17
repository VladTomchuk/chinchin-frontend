'use client';

import { useTransition, useEffect, useState } from 'react';
import { usePathname, useRouter } from '@/i18n/navigation';
import { Locale } from 'next-intl';
import { Select, Portal, createListCollection } from '@chakra-ui/react';
import { useColorModeValue } from '@/components/ui/color-mode';

export type LocaleOption = {
  value: string;
  label: string;
};

type Props = {
  items: LocaleOption[];
  defaultValue: string;
  label: string;
};

export default function LocaleSwitcherSelect({ items, defaultValue, label }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const colorValue = useColorModeValue('brand.darkText', 'brand.lightPink');
  const color = mounted ? colorValue : 'brand.lightPink';
  const contentBgValue = useColorModeValue('white', '#1c1c1e');
  const contentBg = mounted ? contentBgValue : 'white';
  const contentBorderValue = useColorModeValue('blackAlpha.200', 'whiteAlpha.200');
  const contentBorder = mounted ? contentBorderValue : 'blackAlpha.200';
  const itemHighlightValue = useColorModeValue('blackAlpha.50', 'whiteAlpha.100');
  const itemHighlight = mounted ? itemHighlightValue : 'blackAlpha.50';

  const collection = createListCollection({ items });

  function onValueChange(details: { value: string[] }) {
    const nextLocale = details.value[0] as Locale;
    if (!nextLocale || nextLocale === defaultValue) return;
    startTransition(() => {
      router.replace({ pathname }, { locale: nextLocale });
    });
  }

  return (
    <Select.Root
      collection={collection}
      value={[defaultValue]}
      onValueChange={onValueChange}
      disabled={isPending}
      width="auto"
      mx={1}
      positioning={{ placement: 'bottom-end' }}
    >
      <Select.HiddenSelect aria-label={label} />
      <Select.Control opacity={isPending ? 0.6 : 1} transition="opacity 0.2s ease">
        <Select.Trigger color={color} minW="16">
          <Select.ValueText />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator color={color} />
        </Select.IndicatorGroup>
      </Select.Control>
      <Portal>
        <Select.Positioner>
          <Select.Content
            bg={contentBg}
            borderWidth="1px"
            borderColor={contentBorder}
            borderRadius="l2"
            boxShadow="lg"
            minW="24"
            p="1"
            mt="1"
          >
            {items.map((item) => (
              <Select.Item
                item={item}
                key={item.value}
                color={color}
                borderRadius="l1"
                _highlighted={{ bg: itemHighlight }}
              >
                <Select.ItemText>{item.label}</Select.ItemText>
                <Select.ItemIndicator />
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Portal>
    </Select.Root>
  );
}
