'use client'
import React, { use, useEffect, useState } from "react";
import {Search} from "lucide-react";

type Agendamentos = {
    id: string;
    status: string;
    cpf: string;
    servico: string;
    endereco: string;
    localidade: string;
    referencia: string;
    solicitado: string;
    motorista: string;
    agendamento: string;
    execucao: string;
    observacao: string;
    };


const headers = [
    "ID",//numreo do agendamento campo no bd n_agendamento
    "status",
    "CPF",
    "Serviço",
    "Endereço",
    "localidade",// se e Urbano ou interior
    "referencia",// ponto de referencia
    "Solicitado", // data que foi aberto a solicitação.
    "motorista",
    "agendamento",
    "execução",
    "observação"
];


export default function Table(){
    const [agendamentos, setAgendamentos] = useState<Agendamentos[]>([]);


        useEffect(() => {
            fetch("/api/agendamentos")
            .then((response) => response.json())
            .then((data) => setAgendamentos(data));
        }, []);

    return(
       <main className="my-6 mx2">
         <div className="mb2 flex items-center relative">
          <Search  size={20} className="absolute left-2"/>
            <input
             className="input input-info input-sm pl-8"
             placeholder="Buscar"
            />
         </div>
         <table className="table w-full">
           <thead>
             <tr>
               {headers.map((header, index) => (
                 <th key={index}>{header}</th>
               ))}
             </tr>
           </thead>
           <tbody>
                {agendamentos.map((agendamento, index) => (
                <tr key={index}>
                    <td>{agendamento.id}</td>
                    <td>{agendamento.status}</td>
                    <td>{agendamento.cpf}</td>
                    <td>{agendamento.servico}</td>
                    <td>{agendamento.endereco}</td>
                    <td>{agendamento.localidade}</td>
                    <td>{agendamento.referencia}</td>
                    <td>{agendamento.solicitado}</td>
                    <td>{agendamento.motorista}</td>
                    <td>{agendamento.agendamento}</td>
                    <td>{agendamento.execucao}</td>
                    <td>{agendamento.observacao}</td>
                </tr>
                ))}
           </tbody>
            </table>
       </main>
    );
}
