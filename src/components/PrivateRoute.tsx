import { useContext, useEffect } from 'react';
import { UserContext } from '@/contexts/UserContext';
import { useRouter } from 'next/navigation';

interface PrivateRouteProps {
    children: React.ReactNode;
  }
  
  export function PrivateRoute({ children }: PrivateRouteProps) {
    const context = useContext(UserContext);
    const router = useRouter();
  
    useEffect(() => {
      if (context && !context.user) {
        router.push('/login');
      }
    }, [context, router]);
  
    if (!context || !context.user) {
      return null;
    }
  
    return <>{children}</>;
}