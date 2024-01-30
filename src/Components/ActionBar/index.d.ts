// src/Components/ActionBar/index.d.ts
export interface ActionButtonProps {
    text: string;
    onClick?: () => void;
    className?: string;
}

export interface ActionBarProps {
    buttons?: ActionButtonProps[];
}
