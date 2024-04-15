"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import InputMask from "react-input-mask";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { set, z } from "zod";
import { validate } from "cpf-check";
import Wrapper from "@/components/wrapper";
import Link from "next/link";
import { KeyRound } from "lucide-react";

const LoginSchema = z.object({
  cpf: z
    .string()
    .nonempty("CPF obrigatório"),
    //.refine((cpf) => {
    //  return validate(cpf);
    //}, "CPF inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

const Login = () => {
  const [formData, setFormData] = useState({
    cpf: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [cpfValid, setCpfValid] = useState(false);
  const router = useRouter();
  const [cpf, setCpf] = useState("");

  const handleInputChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleCpfChange = async (e: { target: { value: string } }) => {
    const cpfValue = e.target.value.replace(/\D/g, "");

    const formattedCpf = cpfValue.replace(
      /(\d{3})(\d{3})(\d{3})(\d{2})/,
      "$1.$2.$3-$4"
    );

    setFormData((prevData) => ({ ...prevData, cpf: formattedCpf }));

    if (cpfValue.length === 14) {
      try {
        const response = await fetch(`/api/patch-cpf/${cpfValue}`);
        if (!response.ok) {
          throw new Error("Erro na requisição");
        }
        const data = await response.json();

        if (data.valido === true) {
          setCpfValid(true);
          const userResponse = await fetch(`/api/user/${cpfValue}`);
          const userData = await userResponse.json();

          if (!userData.user) {
            // Se o usuário não existir, redireciona para a página de cadastro
            router.push("/cadastro");
          }
        } else {
          setCpfValid(false);
        }
      } catch (error) {
        console.error("Erro ao fazer a requisição.", error);
      }
    } else {
      setCpfValid(false);
    }
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
  
    try {
      LoginSchema.parse(formData); // Validates the form data against the schema
      
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const responseData = await response.json();
      
  
      if (response.status === 200) {
        const { cidadao, token } = responseData;
  
        if (cidadao && token) {
          localStorage.setItem("cpf", cidadao.cpf);
          localStorage.setItem("token", token);
          router.push(`/painel-cidadao?cpf=${cidadao.cpf}`);
        } else {
          console.log("Cidadao or token not found in response");
        }
      } else {
        router.push("/cadastro");
      }
    } catch (error) {
      setError(
        "Erro ao tentar realizar o login. Verifique suas informações e tente novamente ou Faça o cadastro."
      );
    }
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
    <div className="flex justify-center min-h-screen bg-cover " style={{ backgroundImage: `url(/sooretamaconectada.png)` }}>
    
    
    <Wrapper>
  
    <motion.div
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: 20 }}
  transition={{ duration: 0.5 }}
  className="p-8 flex flex-col   bg-cover bg-opacity-50 md:bg-opacity-75 lg:bg-opacity-100 px-8 "
>
  <div className="flex justify-center">
  <Image src="/imagem-centro.png" alt="Descrição da imagem" layout="responsive" width={500} height={300} />
  </div>
  <h1 className="text-3xl font-bold mb-2 text-center">Login</h1>
  <form onSubmit={handleSubmit} className="space-y-4 md:space-y-2 w-full max-w-sm mx-auto">
    <div>
      <label htmlFor="cpf" className="block font-medium mb-1">
        Digite seu CPF
      </label>
      <InputMask
        mask="999.999.999-99"
        type="text"
        id="cpf"
        name="cpf"
        placeholder="000.000.000-00"
        className={`w-full border rounded px-3 py-2 ${error ? "border-red-500" : "border-gray-300"} text-black`}
        value={formData.cpf}
        onChange={handleCpfChange}
      />
    </div>
    <div>
      <label htmlFor="password" className="block font-medium mb-1">
        Digite sua Senha
      </label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          id="password"
          name="password"
          placeholder="Digite sua Senha aqui"
          className="w-full border border-gray-300 rounded px-3 py-2 text-black"
          value={formData.password}
          onChange={handleInputChange}
        />
        <button
          className="absolute top-2 right-2 text-gray-500 cursor-pointer"
          type="button"
          onClick={togglePasswordVisibility}
        >
          <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
        </button>
      </div>
    </div>
    <button
      type="submit"
      className="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-1 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-6 py-2.5 text-center mr-2 mb-5 w-full"
    >
      Entrar
    </button>
    {error && <p className="text-red-500 text-sm">{error}</p>}
    <div className="text-center mt-4">
      <span className="text-white">Não tem uma conta?</span>
      <a
        href="/cadastro"
        className="text-white font-extrabold text-2xl hover:underline animate-pulse"
      >
        Cadastre-se
      </a>
    </div>
    <div className="text-center mt-4">
    
    <Link href="/Admin-login" className="text-white font-extrabold  hover:underline animate-pulse">
    <KeyRound  className="mt-6"/>
    </Link>
</div>
  </form>
</motion.div>
    </Wrapper>
  </div>
  
  
    </>
  )
};

export default Login;
