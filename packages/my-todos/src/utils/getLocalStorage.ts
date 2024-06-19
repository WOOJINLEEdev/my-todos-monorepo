export function getLocalStorageItem(key: string): string | null {
  const storedValue = localStorage.getItem(key);
  if (!storedValue) {
    return null;
  }

  const pureValue = storedValue.replace(/^"(.*)"$/, "$1");
  return pureValue;
}
