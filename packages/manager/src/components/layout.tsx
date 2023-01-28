import { LogOut } from "lucide-react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { api } from "../utils/api";

export default function Layout(props: React.PropsWithChildren) {
  const logout = api.auth.logout.useMutation();
  const session = api.auth.getSession.useQuery();
  const router = useRouter();

  const onLogout = () => {
    logout.mutate(undefined, { onSuccess: () => router.push("/") });
  };

  return (
    <>
      <Head>
        <title>Manager</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className=" h-screen ">
        <div className="container mx-auto px-3">
          <header
            className="flex justify-between border-b py-4
          "
          >
            <Link href="/projects">
              <h1 className="text-xl font-extrabold uppercase tracking-tight text-slate-800">
                Hummus
              </h1>
            </Link>
            {session.data?.username && (
              <div className="flex gap-2">
                {session.data.username}
                <button
                  onClick={onLogout}
                  title="Log out"
                  className="hover:text-blue-500"
                >
                  <LogOut width={16} />
                </button>
              </div>
            )}
          </header>
          <main className="mt-8 flex flex-col">{props.children}</main>
        </div>
      </div>
    </>
  );
}
