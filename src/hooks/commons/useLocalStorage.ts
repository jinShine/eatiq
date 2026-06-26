import { useCallback, useEffect, useState } from "react";

/**
 * 로컬 스토리지와 동기화되는 상태를 관리하는 hook입니다.
 * 페이지를 새로고침해도 상태가 유지됩니다.
 *
 * @template T - 저장할 값의 타입
 * @param key - 로컬 스토리지 키
 * @param initialValue - 초기값
 * @returns 로컬 스토리지와 동기화된 상태와 업데이트 함수
 * @returns returns[0] - 현재 값
 * @returns returns[1] - 값을 업데이트하는 함수
 *
 * @example
 * ```tsx
 * const UserPreferences = () => {
 *   const [theme, setTheme] = useLocalStorage("theme", "light");
 *
 *   return (
 *     <div>
 *       <p>현재 테마: {theme}</p>
 *       <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
 *         테마 변경
 *       </button>
 *     </div>
 *   );
 * };
 * ```
 */
export default function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);

        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue],
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          setStoredValue(JSON.parse(e.newValue) as T);
        } catch (error) {
          console.error(`Error parsing storage event for key "${key}":`, error);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [key]);

  return [storedValue, setValue];
}
