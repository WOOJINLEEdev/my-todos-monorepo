/* eslint-disable @typescript-eslint/no-explicit-any */
interface FetchOptions {
  method?: string;
  headers?: Headers;
  body?: any;
  credentials?: RequestCredentials;
}

interface Headers {
  [key: string]: string;
}

export const baseUrl = import.meta.env.VITE_BASE_URL;

export const createFetchInstance = (
  baseUrl: string,
  defaultHeaders: Headers
) => {
  const request = async (endpoint: string, options: FetchOptions = {}) => {
    const { method = "GET", headers = {}, body, credentials } = options;

    const fetchOptions: RequestInit = {
      method,
      headers: { ...defaultHeaders, ...headers },
    };

    if (body) {
      fetchOptions.body = JSON.stringify(body);
    }

    if (credentials) {
      fetchOptions.credentials = credentials;
    }

    const response = await fetch(`${baseUrl}${endpoint}`, fetchOptions);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    return response.json();
  };

  return {
    get: (
      endpoint: string,
      headers: Headers = {},
      credentials?: RequestCredentials
    ) => request(endpoint, { method: "GET", headers, credentials }),
    post: (
      endpoint: string,
      body?: any,
      headers: Headers = {},
      credentials?: RequestCredentials
    ) => request(endpoint, { method: "POST", headers, body, credentials }),
    put: (
      endpoint: string,
      body?: any,
      headers: Headers = {},
      credentials?: RequestCredentials
    ) => request(endpoint, { method: "PUT", headers, body, credentials }),
    patch: (
      endpoint: string,
      body?: any,
      headers: Headers = {},
      credentials?: RequestCredentials
    ) => request(endpoint, { method: "PATCH", headers, body, credentials }),
    delete: (
      endpoint: string,
      headers: Headers = {},
      credentials?: RequestCredentials
    ) => request(endpoint, { method: "DELETE", headers, credentials }),
  };
};
