import { api } from "../utils/api";
import React from "react";
import { withSession } from "@hummus/auth";
import { useRouter } from "next/router";

interface AuthenticationForm extends HTMLFormElement {
  readonly elements: HTMLFormControlsCollection & {
    "hummus-username": HTMLInputElement;
    "hummus-password": HTMLInputElement;
  };
}

export default function Home() {
  const router = useRouter();
  const context = api.useContext();
  const login = api.auth.login.useMutation();
  const signup = api.auth.signup.useMutation();

  const onSubmit = (e: React.FormEvent<AuthenticationForm>) => {
    e.preventDefault();

    const username = e.currentTarget.elements["hummus-username"].value;
    const password = e.currentTarget.elements["hummus-password"].value;

    const submitter = (e.nativeEvent as SubmitEvent)
      .submitter as HTMLButtonElement;

    if (submitter.name === "signup") {
      signup.mutate(
        { username, password },
        {
          onSuccess: () => {
            loginAndRedirect(username, password);
          },
        },
      );
    } else {
      loginAndRedirect(username, password);
    }
  };
  const loginAndRedirect = async (username: string, password: string) => {
    await login.mutate(
      { username, password },
      {
        onSuccess: async () => {
          await context.auth.getSession.invalidate();
          router.push("/projects");
        },
      },
    );
  };
  return (
    <form
      className="mx-auto flex w-full max-w-sm flex-col items-center justify-center gap-4"
      aria-disabled={login.isLoading || signup.isLoading}
      onSubmit={onSubmit}
    >
      <div className="w-full space-y-2">
        <input
          type="text"
          name="hummus-username"
          required
          placeholder="Username"
          className="form-input"
        />
        <input
          type="password"
          name="hummus-password"
          required
          placeholder="Password"
          className="form-input"
        />
      </div>
      <div className="w-full space-y-2">
        <button name="login" className="button-primary w-full" value="login">
          Log in
        </button>
        <button
          name="signup"
          className="button-secondary w-full"
          value="signup"
        >
          Sign up
        </button>
      </div>

      {login.error && <p>{login.error.message}</p>}
      {signup.error && <p>{signup.error.message}</p>}
    </form>
  );
}

export const getServerSideProps = withSession({
  onLoggedIn: {
    redirect: {
      destination: "/projects",
      permanent: false,
    },
  },
});
