import '../styles/globals.css';
import type { AppType } from 'next/app';
import React from 'react';
import { api } from '../utils/api';
import Layout from '../components/layout';
import { useRouter } from 'next/router';
import { Toaster } from '../components/ui/toast/toaster';

const MyApp: AppType<{}> = ({ Component, pageProps }) => {
  const session = api.auth.getSession.useQuery();
  const router = useRouter();

  React.useEffect(() => {
    if (!session.isLoading) {
      if (!session.data?.isLoggedIn) {
        void router.push('/');
      }
    }
  }, [session.data?.isLoggedIn, session.isLoading]);

  return (
    <Layout>
      <Component {...pageProps} />
      <Toaster />
    </Layout>
  );
};

export default api.withTRPC(MyApp);
