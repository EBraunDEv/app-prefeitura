'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from "zod";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Dialog } from 'primereact/dialog';
import Image from 'next/image';

const AdminLoginPage = () => {
    const router = useRouter();
    const [error, setError] = useState("");
    const [visible, setVisible] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [loginAttempts, setLoginAttempts] = useState(0);

    const handleLogin = async (data: any) => {
        try {
            const response = await fetch("/api/login-admin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (response.status === 200) {
                const responseData = await response.json();
                const { admin, token } = responseData;

                if (admin && token) {
                    localStorage.setItem("admin", admin);
                    localStorage.setItem("token", token);
                    router.push(`/painel-admin?admin=${admin.name}`);
                } else {
                    console.log("Admin or token not found in response");
                }
            } else {
                if (loginAttempts < 2) { // Se ainda houver tentativas restantes
                    setLoginAttempts(loginAttempts + 1);
                    setError("Email ou senha incorretos. Tentativas restantes: " + (2 - loginAttempts));
                } else {
                    setVisible(true); // Exibe o diálogo
                    setTimeout(() => {
                        router.push("/");
                    }, 3000); // Redireciona após 3 segundos
                }
            }
        } catch (error) {
            setError("Erro ao tentar realizar o login. Verifique suas informações com o Desenvolvedor.");
        }
    };
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <>
        <div className="w-screen h-screen flex justify-center items-center bg-gray-100">
            <form onSubmit={handleSubmit(handleLogin)} className='p-10 bg-white rounded flex justify-center items-center flex-col shadow-md max-w-sm mx-auto'>
            <Image src="/img/Brasao-Soo.png" alt="Sooretama Conectada" width={150} height={200} />
 
                <p className='mb-5 text-3xl uppercase text-gray-600  font-semibold mt-6'>Login Administrativo</p>
                <div className="mb-4">
                         <label htmlFor="email" className="block mb-2 font-medium">
                             Email
                         </label>
                         <input
                             type="email"
                             id="email"
                             className="mb-5 p-3 w-80 focus:border-green-700 rounded border-2 outline-none"
                             {...register("email", { required: true })}
                         />
                         {errors.email && <span className="text-red-600 text-sm">Email é obrigatório</span>}
                     </div>
                     <div className="mb-4">
                         <label htmlFor="password" className="block mb-2 font-medium">
                             Password
                         </label>
                         <div className="relative">
                             <input
                                 type={showPassword ? "text" : "password"}
                                 id="password"
                                 autoComplete="off"
                                 {...register("password", { required: true })}
                                 className="mb-5 p-3 w-80 focus:border-green-700 rounded border-2 outline-none"
                                 placeholder="Digite sua Senha aqui"
                             />
                             <button
                                 className="absolute top-2 right-2 text-gray-500 cursor-pointer mt-2"
                                 type="button"
                                 onClick={togglePasswordVisibility}
                             >
                                 <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                             </button>
                         </div>
                         {errors.password && <span className="text-red-500 text-sm"> A Senha é obrigatória</span>}
                     </div>
                     <button
                         type="submit"
                         className="bg-green-600 hover:bg-green-900 text-white font-bold p-2 rounded w-80 h-10"
                     >
                         Entrar
                     </button>
                     {error && <p className="text-red-500 text-sm">{error}</p>}
            </form>
        </div>
     </>
    );
};

export default AdminLoginPage;
