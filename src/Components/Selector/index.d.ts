// Selector/index.d.ts

export interface SelectorProps {
    label?: string;
    options: string[];
    selectedOption: string | null;
    onSelect: (option: string) => void;
}