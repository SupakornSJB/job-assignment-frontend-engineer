import { AxiosResponse, AxiosError } from "axios"

export type IUserData = {
    email: string,
    token?: string,
    username: string,
    bio: string,
    image: string
}

export type IProfileData = {
    username: string,
    bio: string,
    image: string,
    following: boolean
}

export type IRegisterData = {
    email: string,
    username: string,
    password: string
}

export type ILoginData = {
    email: string,
    password: string
}

export type IAuthResponse = {
    userData: IUserData | null;
    fullResponse?: AxiosResponse | AxiosError | unknown;
}

