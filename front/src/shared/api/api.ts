import axios from 'axios';
import { TokensData } from 'features/AuthByUsername';
import { USER_LOCALSTORAGE_DATA, USER_LOCALSTORAGE_TOKENS } from 'shared/const/localStorage';

const isDev = false;
// export const baseUrl = isDev ? 'http://localhost:8000/' : 'http://77.223.126.233/';
export const baseUrl = isDev ? 'https://sw-dev.uitdep.ru/' : 'https://servicedesk.sawatzky.ru/';


export const $api = axios.create({
  baseURL: baseUrl,
});

$api.interceptors.request.use(
  (config) => {
    const tokensJson = localStorage.getItem(USER_LOCALSTORAGE_TOKENS);
    let tokens: TokensData | null = null;
    if (tokensJson) {
      tokens = JSON.parse(tokensJson);
    }

    if (tokens) {
      config.headers.Authorization = `Bearer ${tokens.access}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

$api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const tokensJson = localStorage.getItem(USER_LOCALSTORAGE_TOKENS);
    let tokens: TokensData | null = null;
    if (tokensJson) {
      tokens = JSON.parse(tokensJson);
    }
    // If the error status is 401 and there is no originalRequest._retry flag,
    // it means the token has expired and we need to refresh it
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const response = await axios.post<TokensData>(`${baseUrl}/api/auth/jwt/refresh`, { refresh: tokens?.refresh });
        const { access } = response.data;
        if (access) {
          const newTokens: TokensData = {
            access,
            refresh: tokens?.refresh || '',
          };
          localStorage.setItem(USER_LOCALSTORAGE_TOKENS, JSON.stringify(newTokens));
          // Retry the original request with the new token
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return axios(originalRequest);
        }
      } catch (error: any) {
        localStorage.removeItem(USER_LOCALSTORAGE_TOKENS);
        localStorage.removeItem(USER_LOCALSTORAGE_DATA);
      }
    }
    return Promise.reject(error);
  },
);
