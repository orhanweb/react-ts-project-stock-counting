// AutoCompleteV2/index.d.ts

export interface AutoCompleteV2Props {
    queryHook: (arg: any, skip: boolean) => { data: any[] | undefined, isFetching: boolean };
    formatLabel: (item: any) => string;
    formatInputValue: (item: any) => string;
    onSelect: (suggestion: any | null) => void;
    placeholder?: string;
    selectedSuggestion: any | null;
    disabled?: boolean;
    isError?:boolean;
  }
  