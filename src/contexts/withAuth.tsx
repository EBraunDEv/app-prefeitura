import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';

const withAuth = (WrappedComponent: React.ComponentType<any>) => {
  const WithAuthWrapper = (props: any) => {
    const Router = useRouter();
    const { user } = useUser();

    useEffect(() => {
      if (!user) {
        Router.replace('/login');
      }
    }, [user, Router]); // Adicione Router aqui

    return <WrappedComponent {...props} />;
  }

  WithAuthWrapper.displayName = `WithAuth(${getDisplayName(WrappedComponent)})`;

  return WithAuthWrapper;
}

function getDisplayName(WrappedComponent: React.ComponentType<any>) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default withAuth;