import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const router = useRouter();

  useEffect(() => {
    const verificarAutenticacao = async () => {
      const token = localStorage.getItem('token'); 
      
      if (!token) {
        router.push('/'); // Redirecionar para a página de login se o token não existir
      }
    };

    verificarAutenticacao();
  }, [router]); // Mantenha a lista de dependências vazia

  return;
}