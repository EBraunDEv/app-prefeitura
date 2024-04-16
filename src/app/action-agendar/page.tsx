"use client";
import React, { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog } from "primereact/dialog";
import { useUser } from "@/contexts/UserContext";
import { useAuth } from "@/contexts/auth";
import ButtonActions from "@/components/Button-actions";

const schema = z.object({
  motorista: z
    .string()
    .nonempty({ message: "Por favor, preencha o campo Motorista." }),
  veiculo: z
    .string()
    .nonempty({ message: "Por favor, preencha o campo Veículo." }),
  dataAgendamento: z
    .string()
    .nonempty({ message: "Por favor, preencha o campo Data de Agendamento." }),
});

type Agendamento = z.infer<typeof schema>;

interface Motorista {
  nome: string;
  id: number;
}

interface Veiculo {
  id: number;
 placa: string;
}

const AgendamentoPage: React.FC = () => {
  const router = useRouter();
  const { user } = useUser();
  useAuth();
  const [selectedMotoristas, setSelectedMotoristas] = useState<Motorista []>([]);
  const [selectedVeiculos, setSelectedVeiculos] = useState<Veiculo[]>([]);
  const [visible, setVisible] = React.useState(false);
  const { register, handleSubmit,formState: { errors }, } = useForm<Agendamento>({
    resolver: zodResolver(schema),
  });


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('api/motorista');
        const data = await response.json();
        setSelectedMotoristas(data);
      } catch (error) {
        console.error('Error fetching motoristas:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('api/cadastro-veiculos');
        const data = await response.json();
        setSelectedVeiculos(data);
      } catch (error) {
        console.error('Error fetching veiculos:', error);
      }
    };

    fetchData();
  }, []);

  const onSubmit = async (data: Agendamento) => {

    try {
      const response = await fetch("/api/actions-agendar", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: parseInt(localStorage.getItem('agendamento') || ''),
          status: "Agendado",
          ...data,
          motorista: selectedMotoristas.find(m => m.id === parseInt(data.motorista))?.nome,
          veiculo: selectedVeiculos.find(v => v.id === parseInt(data.veiculo))?.placa,
        }),
      });

      if (response.ok) {
        router.push("/os-print-agendar",{ query: { id: localStorage.getItem('agendamento') || '' } });
      } else {
        console.log("Erro ao enviar os dados");
      }
    } catch (error) {
      console.error("Erro ao enviar os dados:", error);
    }
  };


  return (
    <div className="w-[900px] h-[900px] bg-white flex flex-col mx-auto mt-4">
      <nav className="p-4 bg-blue-500 text-white flex items-center justify-center w-full  mr-4 ">
        <h1 className="text-3xl font-bold">Marcação de Agendamento</h1>
        <ButtonActions />
      </nav>
    
    <div className="flex flex-col items-center min-h-screen bg-gray-200 ">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col mt-6 bg-white p-6 rounded shadow-md w-[650px] "
      >
        
        <label htmlFor="motorista" className="pr-2 font-semibold w-full">
        Motorista:
        <select
          {...register("motorista")}
          className="border border-gray-400 px-4 py-2 rounded-md w-full mt-2 focus:outline-none focus:border-green-500 transition-all duration-200 ease-in-out"
        >
          {selectedMotoristas.map((motorista) => (
            <option key={motorista.id} value={motorista.id}>
             {motorista.nome}
            </option>
          ))}
        </select>
        {errors.motorista && (
          <p className="text-red-600">{errors.motorista.message}</p>
        )}
      </label>
      <label htmlFor="veiculo" className="pr-2 font-semibold w-full">
        Veiculo:
        <select
          {...register("veiculo")}
          className="border border-gray-400 px-4 py-2 rounded-md w-full mt-2 focus:outline-none focus:border-green-500 transition-all duration-200 ease-in-out"
        >
          {selectedVeiculos.map((veiculo) => (
            <option key={veiculo.id} value={veiculo.id}>
             {veiculo.placa}
            </option>
          ))}
        </select>
        {errors.veiculo && (
          <p className="text-red-600">{errors.veiculo.message}</p>
        )}
      </label>
        <label
          htmlFor="dataAgendamento"
          className="pr-2 font-semibold w-full mt-4"
        >
          Data de Agendamento:
          <input
            type="date"
            {...register("dataAgendamento")}
            className="border border-gray-400 px-4 py-2 rounded-md w-full mt-2 focus:outline-none focus:border-green-500 transition-all duration-200 ease-in-out"
          />
          {errors.dataAgendamento && (
            <p className="text-red-600">{errors.dataAgendamento.message}</p>
          )}
        </label>
        <button
          type="submit"
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded self-center"
        >
          Agendar
        </button>
      </form>
      <Dialog
        header=""
        visible={visible}
        position="center"
        style={{ width: "50vw" }}
        onHide={() => setVisible(false)}
        draggable={false}
        resizable={false}
        className="flex items-center justify-center text-white "
      >
        <p className="m-0 items-center justify-center flex text-white text-lg leading-3  bg-red-500 w-[350px] h-[250px] ">
          Por favor, preencha todos os campos!
        </p>
      </Dialog>
    </div>
    </div>
   
  );
};

export default AgendamentoPage;