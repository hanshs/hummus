import { Redirect } from "next/types";
import { withIronSessionSsr } from 'iron-session/next'
import { sessionOptions } from "@hummus/api";

declare module "iron-session" {
    interface IronSessionData {
        isLoggedIn: boolean;
        username: string;
        userId: string;
        token: string;
    }
}

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