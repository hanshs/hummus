import { getIronSession, IronSessionOptions } from "iron-session";
import { GetServerSidePropsContext, NextApiRequest, NextApiResponse, Redirect } from "next/types";
import { withIronSessionSsr } from 'iron-session/next'
import http from 'node:http'
declare module "iron-session" {
    interface IronSessionData {
        isLoggedIn: boolean;
        username: string;
        userId: string;
        token: string;
    }
}

const sessionOptions: IronSessionOptions = {
    password: 'top-secret-iron-session-password-for-this-app-please-dont-hack',
    cookieName: "hummus-session",
    cookieOptions: {
        secure: process.env.NODE_ENV === "production",
    },
};

type Request = GetServerSidePropsContext["req"] | NextApiRequest | http.IncomingMessage
type Response = GetServerSidePropsContext["res"] | NextApiResponse
export async function getServerSession(
    req: Request, res: Response
) {
    return await getIronSession(req, res, sessionOptions);
};

interface WithSessionOptions {
    onLoggedIn?: { redirect: Redirect },
    onLoggedOut?: { redirect: Redirect }
}

export function withSession(options: WithSessionOptions) {
    return withIronSessionSsr(async function ({ req, res }) {
        if (req.session.isLoggedIn) {
            return options.onLoggedIn || { props: {} }
        }

        return options.onLoggedOut || { props: {} };

    }, sessionOptions);
}