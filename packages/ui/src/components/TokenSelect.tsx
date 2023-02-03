import { Input, Select } from "@mantine/core";
import { tokens } from "../tokens";
import { SelectItem } from "./SelectItem";

interface TokenSelectProps {
  onChange: (v: number) => void,
  onTokenSelected: (t: string | null) => void,
  disabled?: boolean,
  value?: string
}

export function TokenSelect({ disabled, onChange, onTokenSelected, value }: TokenSelectProps ) {
  return (
    <Input
      value={value}
      variant="filled"
      placeholder="0"
      radius="md"
      size="xl"
      type={'number'}
      rightSectionWidth={130}
      disabled={disabled}
      onChange={(e) => onChange(Number(e.target.value))}
      rightSection={<Select
        itemComponent={SelectItem}
        onChange={(value) => onTokenSelected(value)}
        mr={10}
        data={tokens}
        placeholder="Token"
        radius="xl"/>
      }/>
  );
}