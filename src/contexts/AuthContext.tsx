import { createContext } from "react";

interface AuthContextState {
   token: string;
}

const AuthContext = createContext<AuthContextState>( {} as AuthContextState );


const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
   return (
     <AuthContext.Provider value={{ token: '123456' }}>
       {children}
     </AuthContext.Provider>
   );
 };

export { AuthContext, AuthProvider };