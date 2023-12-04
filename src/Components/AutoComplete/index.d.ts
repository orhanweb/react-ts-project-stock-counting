// AutoComplete/index.d.ts

export interface AutoCompleteProps {
    queryHook: (arg: any, skip: boolean) => { data: any[] | undefined, isFetching: boolean };
    formatLabel: (item: any) => string;
    onSelect: (suggestion: any | null) => void;
    placeholder?: string;
    selectedSuggestion: any | null;
    queryArg?: any;
    disabled?: boolean;
    isError?:boolean;
}
  