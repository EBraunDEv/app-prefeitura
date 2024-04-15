"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth";
import { useUser } from "@/contexts/UserContext";



type Agendamentos = {
    id: number;
    chamados: number;
    status: string;
    dataAbertura: string;
    cidadao_cpf: string;
    name: string;

  
};

interface Admin {
    email: string;
    name: string;
}

const PainelAdmin = () => {
    const router = useRouter();
    const { user } = useUser();
    useAuth();
    const [userData, setUserData] = useState<Admin | null>(null);
   

    const storedEmail = typeof window !== "undefined" ? localStorage.getItem("adminEmail") : null;
    const storedName = typeof window !== "undefined" ? localStorage.getItem("adminName") : null;
    const [agendamentos, setAgendamentos] = useState<Agendamentos[]>([]);
    const cardVariants = {
      hover: { scale: 1.05 },
      tap: { scale: 0.95 },
    };
    const formatDate = (dateString: string) => {
      const [date, time] = dateString.split(", ");
      const [day, month, year] = date.split("/");
      return new Date(`${year}-${month}-${day}T${time}`);
    };
  



 useEffect(() => {
    const fetchUserData = async () => {
        try {
            const response = await fetch(`/api/info-admin?admin=${storedEmail}`);
            if (!response.ok) {
                throw new Error("Erro ao obter dados do Administrador");
            }
            const data = await response.json();
           
            // Certifique-se de que data.admin está definido e é uma matriz
            const adminData = data.infoAdmin || []; // Certifique-se de acessar os dados corretamente
            const user = adminData.length > 0 ? adminData[0] : null; // Acessando o primeiro item da matriz
            
            if (user) {
                setUserData(user);
            } else {
                console.log("Usuário não encontrado com o email:", storedEmail);
                // Tratamento para o caso em que o usuário não é encontrado
            }
        } catch (error) {
            console.error("Erro ao obter dados do Administrador:", error);
            // Tratamento de erro
        }
    }; 
    
  
      fetchUserData();
    }, [storedEmail]);


    useEffect(() => {
        const fetchAgendamentos = async () => {
            try {
                const response = await fetch("/api/agendamentosUrbanos");
                if (!response.ok) {
                    throw new Error("Erro ao obter agendamentos");
                }
                const data = await response.json();
               
                // Certifique-se de que data.agendamentos está definido e é uma matriz
                const agendamentosData = data.agendamentos || []; // Certifique-se de acessar os dados corretamente
               
                setAgendamentos(agendamentosData);
            } catch (error) {
                console.error("Erro ao obter agendamentos:", error);
                // Tratamento de erro
            }
        };
        fetchAgendamentos();
    }, []);

    const getStatusColor = (status: string) => {
      switch (status.toLowerCase()) {
          case "aguardando":
              return "bg-blue-500";
          case "agendado":
              return "bg-yellow-400";
          case "concluido":
              return "bg-green-500";
          case "remarcado":
              return "bg-rose-900";
          case "cancelado":
              return "bg-red-500";
          default:
              return "bg-green-500"; // Cor padrão para status desconhecidos
      }
  };

    return (
        <>
            <div className="mx-auto bg-green-800 p-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-white text-2xl sm:text-3xl lg:text-4xl font-bold text-center">
                        Painel do Administrador (Serviços Urbanos )
                    </h1>
                    <button
                        onClick={() => {
                            localStorage.clear();
                            localStorage.removeItem('adminEmail');
                            localStorage.removeItem('adminName');
                           router.push("/Admin-login");

                        }}
                        className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 mt-4 lg:mt-0 rounded"
                        title="Sair do Aplicativo"
                    >
                        Sair
                    </button>
                </div>
                <div>
                <h2 className="text-white  sm:text- lg:text-xl font-bold text-center ">
                {userData && `Olá, ${userData.name}! Seu email é ${userData.email}. Bem-vindo ao seu painel.`}
                </h2>
                </div>
            </div>

            <section className="space-y-6 pt-6 pb-8 md:pb-12 md:pt-10 lg:py-12">
            <div className={`flex ${typeof window !== 'undefined' && window.innerWidth < 720 ? 'flex-col items-center' : 'flex-wrap'} justify-center gap-8 md:gap-8 md:w1/2 lg:1/3`}>
    <Link href="/agendamento" className="ml-2 mb-8 mr-8">
      <motion.div
        className="card-item text-center font-bold mr-2 md:mr-4"
        variants={cardVariants}
        whileHover="hover"
        whileTap="tap"
      >
        <div className="flex flex-col items-center">
          <Image
            className="bg-none hover:bg-green-800 active:bg-green-800 rounded-md"
            src="/img/agendament.png"
            alt="logo"
            width={80}
            height={80}
          />
          <span className="text-sm md:text-base">Agendamentos</span>
        </div>
      </motion.div>
    </Link>
    <Link href="/servicos" className="ml-2 mb-2 mr-4">
      <motion.div
        className="card-item text-center font-bold mr-2 md:mr-4"
        variants={cardVariants}
        whileHover="hover"
        whileTap="tap"
      >
        <div className="flex flex-col items-center">
          <Image
            className="bg-none hover:bg-green-800 active:bg-green-800 rounded-md"
            src="/img/cadastro-servicos.png"
            alt="logo"
            width={80}
            height={90}
          />
          <span className="text-sm md:text-base">Cadastro de de Serviços</span>
        </div>
      </motion.div>
    </Link>
    <Link href="/cadastro-motorista" className="ml-4 mb-8 mr-8">
      <motion.div
        className="card-item text-center font-bold mr-2 md:mr-4"
        variants={cardVariants}
        whileHover="hover"
        whileTap="tap"
      >
        <div className="flex flex-col items-center">
          <Image
            className="bg-none hover:bg-green-800 active:bg-green-800 rounded-md"
            src="/img/register.png"
            alt="logo"
            width={80}
            height={75}
          />
          <span className="text-sm md:text-base">Cadastro de Motorista</span>
        </div>
      </motion.div>
    </Link>
    <Link href="/cadastro-veiculos" className="ml-2 mb-2 mr-4">
      <motion.div
        className="card-item text-center font-bold mr-2 md:mr-4"
        variants={cardVariants}
        whileHover="hover"
        whileTap="tap"
      >
        <div className="flex flex-col items-center">
          <Image
            className="bg-none hover:bg-green-800 active:bg-green-800 rounded-md"
            src="/img/pipa.png"
            alt="logo"
            width={100}
            height={90}
          />
          <span className="text-sm md:text-base">Cadastro de Veiculos</span>
        </div>
      </motion.div>
    </Link>
    
    <Link href="/relatorios">
      <motion.div
        className="card-item text-center font-bold mr-2 md:mr-4 mt-4 md:mt-0"
        variants={cardVariants}
        whileHover="hover"
        whileTap="tap"
      >
        <div className="flex flex-col items-center">
          <Image
            className="bg-none hover:bg-green-800 active:bg-green-800 rounded-md"
            src="/img/relatorio.png"
            alt="logo"
            width={70}
            height={70}
          />
          <span className="text-sm md:text-base">Relatórios</span>
        </div>
      </motion.div>
    </Link>
    
  </div>
</section>
            <article>
            <div className="table-responsive mx-auto my-4 ml-2 mr-4">
            <h1 className="text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold p-2 bg-green-800 text-white rounded-md">
                        AGENDAMENTOS
                    </h1>
            <table className="table-auto border-collapse border border-gray-400 w-full">
        <thead className="bg-gray-200">
            <tr>
                <th className="border border-gray-400 px-2 sm:px-4 py-2">
                    Data da solicitação
                </th>
                <th className="border border-gray-400 px-2 sm:px-4 py-2">
                    Status
                </th>
                <th className="border border-gray-400 px-2 sm:px-4 py-2">
                    Protocolo
                </th>
                <th className="border border-gray-400 px-2 sm:px-4 py-2">
                   Nome do solcitante
                </th>
                <th className="border border-gray-400 px-2 sm:px-4 py-2">
                    CPF
                </th>
            </tr>
        </thead>
        <tbody>
            {agendamentos.map((agendamento, index) => (
                <tr key={index}>
                    <td className="border border-gray-400 px-2 sm:px-4 py-2 text-center ">
                        {agendamento.dataAbertura} 
                    </td>
                    <td
                        className={`border border-gray-400 px-2 sm:px-4 py-2 text-center text-white ${getStatusColor(
                            agendamento.status
                        )}`}
                    >
                        {agendamento.status}
                    </td>
                    <td className="border border-gray-400 px-2 sm:px-4 py-2 text-center">
                        {agendamento.chamados}
                    </td>
                    <td className="border border-gray-400 px-2 sm:px-4 py-2 text-center">
                        {agendamento.name}
                    </td>
                    <td className="border border-gray-400 px-2 sm:px-4 py-2 text-center">
                        {agendamento.cidadao_cpf}
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
</div>
            </article>
        </>
    );
};

export default PainelAdmin;
