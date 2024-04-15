'use client'
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

type Servico = {
  id?: string;
  tipo_servico: string;
};



export default function ServicoPage(){
    const router = useRouter();
    const [servicos, setServicos] = useState<Servico[]>([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    

    useEffect(() => {
        fetch("/api/servicos")
        .then((response) => response.json())
        .then((data) => {
            setServicos(data.servicos);
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            fetch("/api/servicos")
                .then((response) => response.json())
                .then((data) => {
                    setServicos(data.servicos);
                });
        }, 1000); 

        return () => clearInterval(interval); 

    }, []); 
  

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const target = event.target as typeof event.target & {
            tipo_servico: { value: string };
        };
        const tipo_servico = target.tipo_servico.value;

        // Verifica se o tipo_servico está vazio
        if (!tipo_servico.trim()) {
            setErrorMessage('O campo Serviço não pode estar vazio.');
            return;
        }

        const body = JSON.stringify({ tipo_servico });
        const response = await fetch("/api/servicos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body,
        });
        if (response.ok) {
            const newServico = await response.json();
            setServicos([...servicos, newServico]);
        }
    };

const handleDelete = async (id: string) => {
    const response = await fetch("/api/servicos", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
    });
    if (response.ok) {
        const newServicos = servicos.filter((servico) => servico.id !== id);
        setServicos(newServicos);
    }
}





    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-[800px] h-[800px] bg-white flex flex-col">
            <nav className="p-4 bg-blue-500 text-white flex items-center justify-center">
                    <span className='font-extrabold text-3xl pr-12  '>Cadastro de serviços Prestados</span>
                    <div>
                    <button
                        onClick={() => {
                           router.push("/painel-admin");

                        }}
                        className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 mt-4 lg:mt-0 rounded pt-2"
                        title="Sair do Aplicativo"
                    >
                        Sair
                    </button>
                  </div>
                </nav>
                <div className="  justify-center mt-2">
                <form onSubmit={handleSubmit} className="bg-slate-700 rounded pt-2 pr-4 pl-2 flex justify-center">
                    
                    <div>
                    <label htmlFor="tipo_servico" className="pr-2 font-semibold text-3xl text-white">Serviço:</label>
                        <input
                            type="text" id="tipo_servico" name="tipo_servico"
                            className="border border-gray-400 px-4 py-2 rounded-md  mb-2 mr-4 focus:outline-none focus:border-green-500 transition-all duration-200 ease-in-out"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-all duration-200 ease-in-out mb-2"
                    >
                        Cadastrar
                    </button>
                   
                </form>
                <div className="flex items-center justify-center">
                {errorMessage && <p className="text-red-500 ">{errorMessage}</p>}
                </div>
                </div>
                <div>
               
                <div className="flex justify-center mt-2">
                    <div className=" justify-center items-center  pt-8 pb-8 flex">
                    <table className=" border-collapse border ">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border">ID</th>
                                <th className="py-2 px-4 border">Serviço</th>
                                <th className="py-2 px-4 border">Options</th>
                            </tr>
                        </thead>
                        <tbody>
                            {servicos.map((servico) => {
                                return (
                                    <tr key={servico.id}>
                                        <td className="py-2 px-4 border">{servico.id}</td>
                                        <td className="py-2 px-4 border">{servico.tipo_servico}</td>
                                        <td className="py-2 px-4 border">
                                            <button
                                                type="button"
                                                onClick={() => { handleDelete(servico.id!)}}
                                                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-all duration-200 ease-in-out"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                    </div>
                </div>
                </div>
            </div>
        </div>
       
    );
};



