
'use client'
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { useAuth } from "@/contexts/auth";


type Motorista = {
  id: string;
  nome: string;
  cnh: string;
  telefone: string;
};

const CadastroMotoristaPage: React.FC = () => {
  const router = useRouter();
  const { user } = useUser();
    useAuth();
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [motorista, setMotorista] = useState<Motorista []>([]);

  const fetchMotoristas = async () => {
    try {
      
      const response = await fetch("/api/motorista");
      if (!response.ok) {
        throw new Error("Erro ao buscar motoristas");
      }
      const data = await response.json();
      setMotorista(data);
    } catch (error) {
      console.error("Erro ao buscar motorista:", error);
    }
  };

  
  useEffect(() => {
    fetchMotoristas();
  }, []);

  const handleSubmitMotorista = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const target = event.target as typeof event.target & {
        nome: { value: string };
        cnh: { value: string };
        telefone: { value: string };
    };
    const nome = target.nome.value;
    const cnh = target.cnh.value;
    const telefone = target.telefone.value;

    if (!nome.trim() || !cnh.trim() || !telefone.trim()) {
        setErrorMessage('Os campos Nome, CNH e Telefone não podem estar vazios.');
        return;
    }

    const body = JSON.stringify({ nome, cnh, telefone });
    const response = await fetch("/api/motorista", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body,
    });
    if (response.ok) {
        const newMotorista = await response.json();
        fetchMotoristas(); 
    }
    setLoading(false);
} 

    const handleDelete = async (id: string) => {
      setLoading(true);
      const body = JSON.stringify({ id });
      const response = await fetch("/api/motorista", {
          method: "DELETE",
          headers: {
              "Content-Type": "application/json",
          },
          body,
      });
      if (response.ok) {
          fetchMotoristas();
      }
      setLoading(false);

};
  


  

return (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
  <div className="w-full sm:w-[800px] h-full sm:h-[800px] bg-white flex flex-col overflow-hidden">
    <nav className="p-4 bg-blue-500 text-white flex items-center justify-between">
      <span className="font-extrabold text-3xl pr-12">
        Cadastro de Motoristas
      </span>
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
    <div className="justify-center mt-2">
    <form onSubmit={handleSubmitMotorista} className="bg-slate-700 rounded pt-2 pr-4 pl-2 flex flex-col sm:flex-row justify-center flex-wrap">
  <div className="w-full sm:w-auto mb-2 sm:mb-0">
    <label htmlFor="nome" className="pr-2 font-semibold text-3xl text-white">Nome:</label>
    <input
      type="text" id="nome" name="nome"
      className="border border-gray-400 px-4 py-2 rounded-md mb-2 mr-4 focus:outline-none focus:border-green-500 transition-all duration-200 ease-in-out"
    />
  </div>
  <div className="w-full sm:w-auto mb-2 sm:mb-0">
    <label htmlFor="cnh" className="pr-2 font-semibold text-3xl text-white">CNH:</label>
    <input
      type="text" id="cnh" name="cnh"
      className="border border-gray-400 px-4 py-2 rounded-md mb-2 mr-4 focus:outline-none focus:border-green-500 transition-all duration-200 ease-in-out"
    />
  </div>
  <div className="w-full sm:w-auto mb-2 sm:mb-0">
    <label htmlFor="telefone" className="pr-2 font-semibold text-3xl text-white">Telefone:</label>
    <input
      type="text" id="telefone" name="telefone"
      className="border border-gray-400 px-4 py-2 rounded-md mb-2 mr-4 focus:outline-none focus:border-green-500 transition-all duration-200 ease-in-out"
    />
  </div>
  <button
    type="submit"
    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-all duration-200 ease-in-out self-center sm:self-auto mb-2"
  >
    Cadastrar
  </button>
</form>
      <div className="flex items-center justify-center">
        {errorMessage && <p className="text-red-500 ">{errorMessage}</p>}
      </div>
      <div className="flex flex-col overflow-auto max-h-[680px] ">
        <h2 className="text-center ">Motoristas Cadastrados</h2>
        {loading ? (
        <p>Carregando...</p> 
      ) : (
        <table className=" border-collapse border ml-2 mr-2 mb-4">
          <thead>
            <tr>
              <th className="py-2 px-4 border">ID</th>
              <th className="py-2 px-4 border">Nome</th>
              <th className="py-2 px-4 border">CNH</th>
              <th className="py-2 px-4 border">Telefone</th>
              <th className="py-2 px-4 border">Options</th>
            </tr>
          </thead>
          <tbody>
            {motorista.map((motorista) => (
              <tr key={motorista.id}>
                <td className="py-2 px-4 border">{motorista.id}</td>
                <td className="py-2 px-4 border">{motorista.nome}</td>
                <td className="py-2 px-4 border">{motorista.cnh}</td>
                <td className="py-2 px-4 border">{motorista.telefone}</td>
                <td className="py-2 px-4 border">
                  <button 
                  type="button"
                  onClick={() => { handleDelete(motorista.id!)}}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-all duration-200 ease-in-out"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      </div>
    </div>
  </div>
</div>
);

};

export default CadastroMotoristaPage;