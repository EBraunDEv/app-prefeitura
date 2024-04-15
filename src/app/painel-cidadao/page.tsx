"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Suspense } from 'react';
import CidadaoCard from "@/components/AgendamentoCard";
import { useUser } from "@/contexts/UserContext";
import { useAuth } from "@/contexts/auth";


type Agendamento = {
  cidadao_cpf: string;
  chamados: string;
  status: string;
  endereco_agendamento: string;
  tipo_servico: string;
  dataAbertura: string;
  dataAgendamento: string;
  dataExecucao: string;
  enderecoAgendamento: string;
  n_agendamento: string;
  localidade: string;
};

interface Cidadao {
  cpf:string;
  name:string;
  
};




const PainelCidadao = () => {
  const router = useRouter();
  const [userData, setUserData] = useState<Cidadao | null>(null);
  const { user } = useUser();
  useAuth();

  const storedCpf =
  typeof window !== "undefined" ? localStorage.getItem("cpf") : null;
const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
const cardVariants = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};
const formatDate = (dateString: string) => {
  const [date, time] = dateString.split(", ");
  const [day, month, year] = date.split("/");
  return new Date(`${year}-${month}-${day}T${time}`);
};
// Adicione as colunas necessárias na tabela
const columns = [
{ Header: 'Status', accessor: 'status' },
{ Header: 'CPF', accessor: 'cidadao_cpf' },
{ Header: 'Endereço', accessor: 'endereco' }, // Adicione a coluna de endereço
{ Header: 'Data de Abertura', accessor: 'data_abertura' }, // Adicione a coluna de data de abertura
{ Header: 'Data de Agendamento', accessor: 'data_agendamento' },
{ Header: 'Data Executada', accessor: 'data_executada' }, // Adicione a coluna de data executada
];

useEffect(() => {
  const fetchUserData = async () => {
    try {
      if (storedCpf !== null) {
        const response = await fetch(`/api/cidadao?cpf=${storedCpf}`);
        if (!response.ok) {
          throw new Error("Erro ao obter dados do cidadão");
        }
        const data = await response.json();
        const user = data.cidadaos.find((cidadao: Cidadao) => cidadao.cpf === storedCpf);
        if (user) {
          setUserData(user);
        } else {
          // Lidar com o caso em que user é undefined
        }
      } else {
        // Lidar com o caso em que storedCpf é null
      }
    } catch (error) {
      // Lidar com o erro
    }
  };

  fetchUserData();
}, [storedCpf]);









useEffect(() => {
  const updateAgendamentosByCpf = async () => {
    try {
      if (typeof storedCpf === "string") {
        const response = await fetch(
          `/api/agendamentosUrbanos?cpf=${storedCpf}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ cpf: storedCpf }),
          }
        );

        if (!response.ok) {
          throw new Error("Erro ao atualizar agendamentos");
        }

        const data = await response.json();
        setAgendamentos(data.agendamentos);
      } else {
        console.error(
          "CPF não encontrado no localStorage ou não é uma string válida"
        );
      }
    } catch (error) {
      console.error(error);
    }
  };
}, [storedCpf]);


   

  return (
    <>
    <div className="mx-auto bg-green-800 p-4">
    <div className="flex flex-col sm:flex-row justify-between items-center">
  <h1 className="text-white text-base font-bold text-center">
    REALIZE SEUS AGENDAMENTOS E ACOMPANHE O ANDAMENTO!
  </h1>
  
</div>
<div>
         <h2 className="text-white  sm:text- lg:text-xl font-bold text-center">
        {userData && userData.name && `Olá, ${userData.name} Seja bem-vindo!`}
        </h2>
         </div>
    </div>
  
    <section className="space-y-6 pt-6 pb-8 md:pb-12 md:pt-10 lg:py-12">
  <div className="flex flex-row justify-center gap-4 md:gap-8 md:w1/2 lg:1/3">
    <Link href="/chamados-urbanos">
      <motion.div
        className="card-item text-center font-bold mr-2 md:mr-4"
        variants={cardVariants}
        whileHover="hover"
        whileTap="tap"
      >
        <div className="flex flex-col items-center">
          <Image
            className="bg-none hover:bg-green-800 active:bg-green-800 rounded-md"
            src="/img/Serviços-urbanos.png"
            alt="logo"
            width={80}
            height={80}
          />
          <span className="text-sm md:text-base">Serviços Urbanos</span>
        </div>
      </motion.div>
    </Link>
    
    
    <Link href="/">
      <motion.div
        className="card-item text-center font-bold mr-2 md:mr-4 mt-4 md:mt-0"
        variants={cardVariants}
        whileHover="hover"
        whileTap="tap"
        onClick={() => {
          localStorage.clear();
          router.replace("/");
      }}
      >
        <div className="flex flex-col items-center">
          <Image
            className="bg-none hover:bg-green-800 active:bg-green-800 rounded-md"
            src="/img/deslogar.png"
            alt="logo"
            width={60}
            height={60}
          />
          <span className="text-sm md:text-base">Sair do APP</span>
        </div>
      </motion.div>
    </Link>
  
  </div>
</section>
  
<section>
  <div className="overflow-x-auto">
    <h1 className="text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold p-2 bg-green-800 text-white rounded-md">
      SEUS AGENDAMENTOS
    </h1>
    
    <div className="mx-auto">
      <Suspense fallback={<p>Carregando...</p>}>
        <div className="grid grid-cols-1 items-center gap-4 m-4">
          <div className="max-w-screen-sm mx-auto">
            <CidadaoCard storedCpf={storedCpf || ''} />
          </div>
        </div>
      </Suspense>
    </div>
  </div>
</section>
  </>

  
  );
};

export default PainelCidadao
