"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ButtonSair from "@/components/button-sair";
import { useUser } from "@/contexts/UserContext";
import { useAuth } from "@/contexts/auth";

type Agendamentos = {
  id: number;
  chamados: number;
  status: string;
  dataAbertura: string;
  cidadao_cpf: string;
  name: string;
};

export default function AgendamentoPage() {
  const [agendamentos, setAgendamentos] = useState<Agendamentos[]>([]);
  const router = useRouter();
  const { user } = useUser();
    useAuth();

  useEffect(() => {
    const fetchAgendamentos = async () => {
      try {
        const response = await fetch("/api/agendamentosUrbanos");
        if (!response.ok) {
          throw new Error("Erro ao obter agendamentos");
        }
        const data = await response.json();
        console.log("Dados retornados da API:", data);
        // Certifique-se de que data.agendamentos está definido e é uma matriz
        const agendamentosData = data.agendamentos || []; // Certifique-se de acessar os dados corretamente
        console.log("Agendamentos encontrados:", agendamentosData);
        setAgendamentos(agendamentosData);
      } catch (error) {
        console.error("Erro ao obter agendamentos:", error);
        // Tratamento de erro
      }
    };
    fetchAgendamentos();
  }, []);

  function statusTemplate(rowData: any) {
    let statusClass = getStatusColor(rowData.status);
    return (
      <span className={`text-center text-white ${statusClass}`}>
        {rowData.status}
      </span>
    );
  }

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

  function acoesBotao(rowData: any) {
    return (
      <div className="flex">
        <button 
        className="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Agendar
        </button>
        <button className="mr-2 bg-red-400 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
          Remarcar
        </button>
        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          Concluir
        </button>
      </div>
    );
  }

  return (
    <div className="w-[1000px] h-[1000px] bg-white flex flex-col mx-auto mt-4">
      <nav className="p-4 bg-blue-500 text-white flex items-center justify-center w-full  mr-4 ">
        <h1 className="text-3xl font-bold">Sistema de Chamados</h1>
        <ButtonSair />
      </nav>
      <div className="mt-8 ml-4 mr-4 bg-slate-200 mb-8 w-[900] h-[800]">
      <div className="mb-4  mr-4 ml-2 mt-4 flex ">
      <table className="table-auto border-collapse border border-gray-200">
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
                   Solcitante
                </th>
                <th className="border border-gray-400 px-2 sm:px-4 py-2">
                    CPF
                </th>
                <th className="border border-gray-400 px-2 sm:px-4 py-2">
                    Ações
                </th>
            </tr>
        </thead>
        <tbody>
            {agendamentos.map((agendamento, index) => (
                <tr key={index}>
                    <td className="border border-gray-400 px-2 sm:px-4 py-2 text-center">
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

                    <td className="border border-gray-400 px-2 sm:px-4 py-2 text-center">
                        <div className="flex">
                            <button 
                             onClick={() => {
                              localStorage.setItem('agendamento', agendamento.id.toString()); // Armazena o id no localStorage
                              router.push(`/action-agendar?id=${agendamento.id}`);
  
                          }}
                            className="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                Agendar
                            </button>
                            <button 
                              onClick={() => {
                                localStorage.setItem('agendamento', agendamento.id.toString());
                                router.push(`/action-remarcar?id=${agendamento.id}`);
    
                            }}
                            className="mr-2 bg-red-400 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                                Remarcar
                            </button>
                            <button 
                            onClick={() => {
                              localStorage.setItem('agendamento', agendamento.id.toString());
                              router.push(`/action-concluir?id=${agendamento.id}`);
                            }}
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Concluir
                            </button>
                        </div>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
     </div>


      </div>
    </div>
  );
}
