/**
 * 객체에서 특정 키들만 선택합니다.
 * @param obj - 원본 객체
 * @param keys - 선택할 키 배열
 * @returns 선택된 키들만 포함하는 객체
 * @example
 * pick({ a: 1, b: 2, c: 3 }, ['a', 'c']) // { a: 1, c: 3 }
 */
export function pick<T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;

  keys.forEach(key => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });

  return result;
}

/**
 * 객체에서 특정 키들을 제외합니다.
 * @param obj - 원본 객체
 * @param keys - 제외할 키 배열
 * @returns 특정 키들이 제외된 객체
 * @example
 * omit({ a: 1, b: 2, c: 3 }, ['b']) // { a: 1, c: 3 }
 */
export function omit<T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const result = { ...obj };

  keys.forEach(key => {
    delete result[key];
  });

  return result;
}

/**
 * 객체가 비어있는지 확인합니다.
 * @param obj - 확인할 객체
 * @returns 비어있으면 true, 아니면 false
 * @example
 * isEmptyObject({}) // true
 * isEmptyObject({ a: 1 }) // false
 */
export function isEmptyObject(obj: any): boolean {
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) {
    return false;
  }
  return Object.keys(obj).length === 0;
}

/**
 * 객체를 깊은 복사합니다.
 * @param obj - 복사할 객체
 * @returns 깊은 복사된 객체
 * @example
 * const original = { a: { b: 1 } };
 * const copied = deepClone(original);
 * copied.a.b = 2;
 * console.log(original.a.b); // 1 (변경되지 않음)
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T;
  }

  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as unknown as T;
  }

  if (typeof obj === "object") {
    const cloned = {} as T;
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        cloned[key] = deepClone(obj[key]);
      }
    }
    return cloned;
  }

  return obj;
}

/**
 * 객체를 깊게 병합합니다.
 * @param target - 대상 객체
 * @param source - 소스 객체
 * @returns 병합된 객체
 * @example
 * deepMerge({ a: { b: 1 } }, { a: { c: 2 } }) // { a: { b: 1, c: 2 } }
 */
export function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const output = { ...target };

  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key as keyof T] = deepMerge(target[key], source[key] as any) as T[keyof T];
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }

  return output;
}

/**
 * 값이 객체인지 확인합니다.
 */
function isObject(item: any): item is Record<string, any> {
  return item && typeof item === "object" && !Array.isArray(item);
}

/**
 * 두 객체가 같은지 깊게 비교합니다.
 * @param obj1 - 첫 번째 객체
 * @param obj2 - 두 번째 객체
 * @returns 같으면 true, 다르면 false
 * @example
 * isEqual({ a: { b: 1 } }, { a: { b: 1 } }) // true
 * isEqual({ a: 1 }, { a: 2 }) // false
 */
export function isEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) {
    return true;
  }

  if (obj1 == null || obj2 == null || typeof obj1 !== "object" || typeof obj2 !== "object") {
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    if (!keys2.includes(key)) {
      return false;
    }
    if (!isEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
}

/**
 * 객체의 모든 값을 순회하며 함수를 실행합니다.
 * @param obj - 객체
 * @param fn - 실행할 함수
 * @example
 * forEachValue({ a: 1, b: 2 }, (value) => console.log(value)); // 1, 2
 */
export function forEachValue<T>(obj: Record<string, T>, fn: (value: T, key: string) => void): void {
  Object.entries(obj).forEach(([key, value]) => {
    fn(value, key);
  });
}
