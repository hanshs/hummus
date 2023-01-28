import { IronSessionOptions } from "iron-session";

declare module "iron-session" {
    interface IronSessionData {
        isLoggedIn: boolean;
        username: string;
        userId: string;
        token: string;
    }
}

export const sessionOptions: IronSessionOptions = {
    password: 'top-secret-iron-session-password-for-this-app-please-dont-hack',
    cookieName: "hummus-session",
    cookieOptions: {
        secure: process.env.NODE_ENV === "production",
    },
};