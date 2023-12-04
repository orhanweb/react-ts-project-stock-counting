import React, { useState, useEffect, useRef, useCallback } from 'react';
import { debounce } from 'lodash';
import { AutoCompleteV2Props } from './index.d';

const AutoCompleteV2: React.FC<AutoCompleteV2Props> = ({
  queryHook,
  formatLabel,
  formatInputValue,
  placeholder = "Ara...",
  selectedSuggestion,
  onSelect,
  disabled = false,
  isError= false,
}) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [debouncedValue, setDebouncedValue] = useState<string>(inputValue);

  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const autoCompleteRef = useRef<HTMLDivElement>(null);

  // Değişen inputValue'yi takip eden debounce işlemi
  const updateDebouncedValue = useCallback(
    debounce((nextValue) => {
      setDebouncedValue(nextValue);
    }, 300),
    []
  );

  // API çağrısından dönen verileri dinle
  const { data: dataSuggestions, isFetching } = queryHook(debouncedValue, inputValue.length < 3);

  useEffect(() => {
    if (dataSuggestions) {
      setSuggestions(dataSuggestions);
    }
  }, [dataSuggestions]);


  useEffect(() => {
    if (!selectedSuggestion) {
      setInputValue(''); // input değerini sıfırla
      setDebouncedValue(''); // debounced değeri sıfırla
      setShowSuggestions(false); // öneri listesini kapat
    }
  }, [selectedSuggestion]);


  // Kullanıcı girişi değiştiğinde
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled) {
      setInputValue(e.target.value);
      updateDebouncedValue(e.target.value)
      onSelect(null);
      setShowSuggestions(true);
    }
  };

  // Öneri seçildiğinde
  const handleSuggestionClick = (suggestion: any) => {
    if (!disabled) {
      setInputValue(formatInputValue(suggestion));
      onSelect(suggestion);
      setShowSuggestions(false);
    }
  };

  // Bileşenin dışına tıklandığında kapat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (autoCompleteRef.current && !autoCompleteRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        if (!selectedSuggestion) {
          setInputValue('');
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedSuggestion]);

  return (
    <div className="relative w-full" ref={autoCompleteRef}>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        className={`${isError ? 'border-error' : ''} w-full border rounded p-2 border-background bg-transparent text-text-darkest dark:text-text-lightest focus:border-primary focus:ring-1 focus:ring-primary transition-colors duration-300 ease-in-out`}
        placeholder={placeholder}
        disabled={disabled}
        onFocus={()=>setShowSuggestions(true)}
      />

      {showSuggestions && (
        <ul className="dropdown-enter p-2 absolute z-10 w-full bg-background-lightest dark:bg-background-darker border border-background-light dark:border-background rounded-b-xl shadow-2xl dark:shadow-none mt-1 max-h-60 overflow-auto">
          {isFetching ? (
            <li className="p-2 cursor-default text-text-lighter">Loading...</li>
          ) : inputValue.length < 3 ? (
            <li className="p-2 cursor-default text-text-lighter">Minimum 3 karakter giriniz</li>
          ) : suggestions.length > 0 ? (
            suggestions.map((suggestion) => (
              <li
                key={suggestion.id}
                onClick={() => handleSuggestionClick(suggestion)}
                className="p-2 rounded block whitespace-pre-wrap hover:bg-background-lighter dark:hover:bg-background-dark transition-colors duration-200 ease-in-out cursor-pointer"
              >
                {formatLabel(suggestion)}
              </li>
            ))
          ) : (
            <li className="p-2 cursor-default text-text-lighter">No Data</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default AutoCompleteV2;
