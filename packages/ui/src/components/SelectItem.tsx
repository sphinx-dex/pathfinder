import { Avatar, Group, Text } from "@mantine/core";
import { forwardRef } from "react";

interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
  image: string;
  label: string;
  value: string;
}

// eslint-disable-next-line react/display-name
export const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ image, label, value, ...others }: ItemProps, ref) => (
    <div ref={ref} {...others}>
      <Group noWrap>
        <Avatar size={'sm'} src={image} />
        <Text size="sm">{label}</Text>
      </Group>
    </div>
  )
);