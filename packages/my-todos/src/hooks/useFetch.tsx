import { createFetchInstance } from "@/utils/fetchInstance";
import { getLocalStorageItem } from "@/utils/getLocalStorage";

export const baseUrl = import.meta.env.VITE_BASE_URL;

const useFetch = () => {
  const token = getLocalStorageItem("token");

  const api = createFetchInstance(baseUrl, {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  });

  return api;
};

export default useFetch;
