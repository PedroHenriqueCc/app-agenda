import { useEffect, useState } from "react";

export function useLocalStorage(key, initialData) {
    const [storedValue, setStoredValue] = useState(() => {
        const existingData = localStorage.getItem(key);
        return existingData ? JSON.parse(existingData) : initialData;
    });

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(storedValue));
    }, [key, storedValue]);

    const updateLocalStorage = (newValue) => {
        setStoredValue((prevValue) => {
            const valueToStore = typeof newValue === 'function' ? newValue(prevValue) : newValue;
            localStorage.setItem(key, JSON.stringify(valueToStore));
            return valueToStore;
        });
    };

    return [storedValue, updateLocalStorage];
}
