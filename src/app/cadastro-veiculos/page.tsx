
'use client'
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { useAuth } from "@/contexts/auth";


type Veiculo = {
  id: string;
  placa: string;
  modelo: string;
};


const CadastroVeiculosPage: React.FC = () => {
  const router = useRouter();
  const { user } = useUser();
  useAuth();
  const [errorMessage, setErrorMessage] = useState("");
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [loading, setLoading] = useState(false);
  const [placa, setPlaca] = useState("");
  const [modelo, setModelo] = useState("");

  useEffect(() => {
    fetchVeiculos();
  }, []);

  const fetchVeiculos = async () => {
    try {
      const response = await fetch("/api/cadastro-veiculos");
      if (!response.ok) {
        throw new Error("Error fetching vehicles");
      }
      const data = await response.json();
      setVeiculos(data);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    }
  };

  const handleSubmitVeiculo = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setLoading(true);
    const target = event.target as typeof event.target & {
      placa: { value: string };
      modelo: { value: string };
    };
    const placa = target.placa.value;
    const modelo = target.modelo.value;
  
    if (!placa.trim() || !modelo.trim()) {
      setErrorMessage("Os campos Placa e Modelo não podem estar vazios.");
      setLoading(false);
      return;
    }
  
    try {
      const response = await fetch("/api/cadastro-veiculos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ placa, modelo }),
      });
      if (response.ok) {
        fetchVeiculos();
        setPlaca("");
        setModelo("");
      }
    } catch (error) {
      setErrorMessage(
        "Ocorreu um erro ao cadastrar o veículo. Por favor, tente novamente mais tarde."
      );
    }
  
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    const body = JSON.stringify({ id });
    const response = await fetch("/api/cadastro-veiculos", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });
    if (response.ok) {
      fetchVeiculos();
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full sm:w-[800px] h-full sm:h-[800px] bg-white flex flex-col overflow-hidden">
        <nav className="p-4 bg-blue-500 text-white flex items-center justify-between">
          <span className="font-extrabold text-3xl pr-12">
            Cadastro de Veículos
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
          <form
            onSubmit={handleSubmitVeiculo}
            className="bg-slate-700 rounded pt-2 pr-4 pl-2 flex flex-wrap justify-center"
          >
            <div className="w-full sm:w-auto">
              <label
                htmlFor="placa"
                className="pr-2 font-semibold text-3xl text-white"
              >
                Placa:
              </label>
              <input
                type="text"
                id="placa"
                name="placa"
                className="border border-gray-400 px-4 py-2 rounded-md  mb-2 mr-4 focus:outline-none focus:border-green-500 transition-all duration-200 ease-in-out"
                value={placa}
                onChange={(e) => setPlaca(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-auto">
              <label
                htmlFor="modelo"
                className="pr-2 font-semibold text-3xl text-white"
              >
                Modelo:
              </label>
              <input
                type="text"
                id="modelo"
                name="modelo"
                className="border border-gray-400 px-4 py-2 rounded-md  mb-2 mr-4 focus:outline-none focus:border-green-500 transition-all duration-200 ease-in-out"
                value={modelo}
                onChange={(e) => setModelo(e.target.value)}
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
          <div className="flex flex-col overflow-auto max-h-[680px] ">
            <h2 className="text-center ">Veículos Cadastrados</h2>
            {loading ? (
              <p>Carregando...</p>
            ) : (
              <table className=" border-collapse border ml-2 mr-2 mb-4">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border">ID</th>
                    <th className="py-2 px-4 border">Placa</th>
                    <th className="py-2 px-4 border">Modelo</th>
                    <th className="py-2 px-4 border">Options</th>
                  </tr>
                </thead>
                <tbody>
                  {veiculos.map((veiculo) => (
                    <tr key={veiculo.id}>
                      <td className="py-2 px-4 border">{veiculo.id}</td>
                      <td className="py-2 px-4 border">{veiculo.placa}</td>
                      <td className="py-2 px-4 border">{veiculo.modelo}</td>
                      <td className="py-2 px-4 border">
                        <button
                          type="button"
                          onClick={() => {
                            handleDelete(veiculo.id!);
                          }}
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

export default CadastroVeiculosPage;