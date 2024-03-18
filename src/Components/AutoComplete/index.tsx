// AutoComplete.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { debounce } from 'lodash';
import { AutoCompleteProps } from './index.d';
import "./index.css"
const AutoComplete: React.FC<AutoCompleteProps> = ({
   queryHook,
   formatLabel, 
   queryArg = undefined, 
   placeholder = "Ara...",
   selectedSuggestion,
   onSelect,
   disabled= false,
   isError=false,
  }) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [triggerLoad, setTriggerLoad] = useState<boolean>(false);
  const [suggestions, setSuggestions] = useState<any[]>([]); // API'den gelen verileri filtrelemek için
  const autoCompleteRef = useRef<HTMLDivElement>(null);

  const { data: dataSuggestions, isFetching } = queryHook(queryArg, !triggerLoad);

  // queryArg değiştiğinde inputValue'yi sıfırla
  useEffect(() => {
    onSelect(null)
    setInputValue('');
  }, [queryArg]);

  useEffect(() => {
    // API'den veri geldiğinde ve veri boş değilse, seçenekler'i güncelle
    if (dataSuggestions) {
      setSuggestions(dataSuggestions);
    }
  }, [dataSuggestions]);
  
  // Bileşenin dışına tıklandığına kapanması için. useRef ve useEffect birlikte kullanıldı.
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (autoCompleteRef.current && !autoCompleteRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        if(!selectedSuggestion)
        {setInputValue('');}
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedSuggestion]);
  

  // Filtreleme fonksiyonunu güncelle
  const filterSuggestions = useCallback(debounce((input: string) => {
    let filtered = [];

    if (dataSuggestions) {
      if (input === '') {
        filtered = dataSuggestions;
      } else {
        filtered = dataSuggestions.filter(suggestion =>
          formatLabel(suggestion).toLowerCase().includes(input.toLowerCase())
        );
      }
    }
    setSuggestions(filtered); // Filtrelenmiş sonuçları güncelle
  }, 300), [dataSuggestions,formatLabel]);  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    onSelect(null)
    filterSuggestions(value);
  };

  const handleSuggestionClick = (suggestion: any) => {
    setInputValue(formatLabel(suggestion));
    onSelect(suggestion);
    setShowSuggestions(false);
    setTriggerLoad(false)
  };

  const handleFocus = () => {
    setTriggerLoad(true);
    setShowSuggestions(true);
    setSuggestions(dataSuggestions || []);
  };

  return (
    <div className="relative w-full" ref={autoCompleteRef}>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        className={`${isError ? 'border-error' : ''} w-full border-2 border-opacity-30 dark:border-opacity-80 rounded-lg p-2 border-background bg-transparent text-text-darkest dark:text-text-lightest focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors duration-300 ease-in-out`}
        onFocus={!disabled ? handleFocus : undefined}
        placeholder={placeholder}
        disabled={disabled}
      />

      {showSuggestions &&(
        <ul className="dropdown-enter p-2 absolute z-10 w-full bg-background-lightest dark:bg-background-darker border border-background-light dark:border-background rounded-b-xl shadow-2xl dark:shadow-none mt-1 max-h-60 overflow-auto">
          {isFetching ? (
            <li className="p-2 cursor-default text-text-lighter">Loading...</li>
          ) :suggestions.length > 0 ? (
            suggestions.map((suggestion) => (
              <li
                key={suggestion.id}
                onClick={() => handleSuggestionClick(suggestion)}
                className="p-2 rounded hover:bg-background-lighter dark:hover:bg-background-dark transition-colors duration-200 ease-in-out cursor-pointer"
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

export default AutoComplete;
