export interface LoginSchema {
    username: string;
    password: string;
    isLoading: boolean;
    isCheck: boolean;
    error?: string;
}

export interface TokensData {
    access: string;
    refresh: string;
}
