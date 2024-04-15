"use client";

import React, { useEffect, useState } from "react";
import InputMask from "react-input-mask";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { useAuth } from "@/contexts/auth";

interface Agendamento {
  chamados: string;
}

interface TipoServico {
  id: number;
  tipo_servico: string;
}
interface Localidade {
  id: number;
  nome: string;
}

type MyModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};
const MyModal: React.FC<MyModalProps> = ({ isOpen, onClose, children }) => {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ${
        isOpen ? "" : "hidden"
      }`}
    >
      <div className="bg-white w-11/12 md:w-1/2 lg:w-1/3 rounded-lg p-4">
        <button
          onClick={onClose}
          className="absolute top-0 right-0 p-2 m-2 text-xl"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

const Formulario = () => {
  const router = useRouter();
  const { user } = useUser();
    useAuth();
  const [agendamentoData, setAgendamentoData] = useState({
    tipo_servico: "",
    cidadao_cpf: "",
    name: "",
    telefone: "",
    endereco_agendamento: "",
    bairro: "",
    localidade: "",
    n_agendamento: "",
    ponto_referencia: "",
    observacao: "",
    status: "Aguardando",
    dataAbertura: new Date(),
  });
  const [tipo_Servico, setTipo_Servico] = useState<TipoServico[]>([]);
  const [selectedLocalidade, setSelectedLocalidade] = useState<Localidade[]>(
    []
  );
  const [selectedLocalidadeId, setSelectedLocalidadeId] = useState("");
  const [bairroSelecionado, setBairroSelecionado] = useState("");
  const [servicoSelecionado, setServicoSelecionado] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [cidadaoInfo, setCidadaoInfo] = useState({
    name: "",
    cpf: "",
    telefone: "",
    n_instalacao: "",
    endereco: "",
    n_casa: "",
    ponto_referencia: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ultimoAgendamento, setUltimoAgendamento] = useState<Agendamento | null>(null);
  const [errorMessage, setErrorMessage] = useState("");


  const localidades = [
    { id: '1', nome: 'Interior' },
    { id: '2', nome: 'Urbano' },
    // ...
  ];
  const getLocalidadeNomeById = (id: string) => {
    const localidade = localidades.find(localidade => localidade.id === id);
    return localidade ? localidade.nome : '';
  };

  const bairros = [
    "Sayonara",
    "Bairro Salvador",
    "Bairro Parque São Jorge",
    "Bairro Dalvo Loureiro",
    "Vale do Sol",
    "Centro da Cidade",
    "Bairro Bionativa",
    "Bairro Canaã",
    "Bairro Córrego Alegre",
    "Juncado",
    "Santa Luzia",
    "Chumbado",
    "Comendador Rafael",
    "Juerana B",
    "Juerana A",
    "Lastenio",
    "Sobradinho",
    "Barro Roxo",
    "Rodrigues",
    "Sayonara 2",
    "Félix",
  ];

  function setDataAbertura() {
    const dataAtual = new Date();
    const dataAbertura = dataAtual.toISOString().slice(0, 10); // Formato: AAAA-MM-DD
    return dataAbertura;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/servicos`);
        const data = await response.json();
        setTipo_Servico(data.servicos);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/localidade`);
        const data = await response.json();
        setSelectedLocalidade(data.localidades);
        setBairroSelecionado(data.bairro)
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const handleServicoChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    setServicoSelecionado(selectedValue);

    const selectedServico = tipo_Servico.find(
      (tipo) => tipo.tipo_servico === selectedValue
    );

    if (selectedServico) {
      setAgendamentoData({
        ...agendamentoData,
        tipo_servico: selectedValue,
      });
    } else {
      setAgendamentoData({
        ...agendamentoData,
        tipo_servico: selectedValue,
      });
    }
  };

  const handleLocalidadeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedLocalidadeId(event.target.value);
  };

  const handleCpfBlur = async (): Promise<void> => {
    if (agendamentoData.cidadao_cpf.length === 14) {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/cidadao`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cpf: agendamentoData.cidadao_cpf,
          }),
        });
        const data = await response.json();

        if (data.cidadao) {
          setCidadaoInfo(data.cidadao);
        } else {
          setCidadaoInfo({
            name: "",
            cpf: "",
            telefone: "",
            n_instalacao: "",
            endereco: "",
            n_casa: "",
            ponto_referencia: "",
          });
        }
      } catch (error) {
        console.error(error);
        setCidadaoInfo({
          name: "",
          cpf: "",
          telefone: "",
          n_instalacao: "",
          endereco: "",
          n_casa: "",
          ponto_referencia: "",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleUseCadastroClick = () => {
    setAgendamentoData({
      ...agendamentoData,
      name: cidadaoInfo.name,
      telefone: cidadaoInfo.telefone,
      endereco_agendamento: cidadaoInfo.endereco,
      n_agendamento: cidadaoInfo.n_casa,
      ponto_referencia: cidadaoInfo.ponto_referencia,
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const dataAbertura = setDataAbertura();

    if (
      servicoSelecionado === "" ||
      agendamentoData.cidadao_cpf === "" ||
      agendamentoData.name === "" ||
      agendamentoData.endereco_agendamento === "" ||
      bairroSelecionado === "" ||
      agendamentoData.n_agendamento === "" ||
      agendamentoData.ponto_referencia === "" ||
      agendamentoData.observacao === ""
    ) {
      alert("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    try {
      const agendamentoNovo = {
        ...agendamentoData,
        tipo_servico: servicoSelecionado,
        status: "Aguardando",
        localidade: getLocalidadeNomeById(selectedLocalidadeId),
    
      };

      const response = await fetch(`/api/agendamentosUrbanos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(agendamentoNovo),
      });

      const data = await response.json();

      if (response.ok) {
        setUltimoAgendamento(data.agendamento);
        setIsModalOpen(true);
      } else if (data.message) {
        setErrorMessage(data.message);
      }
    } catch (error) {
      console.error("Erro ao enviar o agendamento para o servidor:", error);
    }
  };

  const handleCloseAndRedirect = () => {
    setIsModalOpen(false);
    router.push("/painel-cidadao");
  };

  return (
    <div className=" bg-gray-200">
      <div className=" mx-auto  bg-green-800 p-4 mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-white text-1x1 font-bold text-center">
            REALIZE SEUS AGENDAMENTOS
          </h1>
          <button
          onClick={() => {
            router.push("/painel-cidadao");
          }}
          className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 mt-4 lg:mt-0 rounded pt-2"
          title="Sair do Aplicativo"
        >
          Sair
        </button>
        </div>
      </div>
      <div className="min-h-screen flex items-center justify-center bg-gray-200">
        <div className="w-full sm:w-11/12 md:w-10/12 lg:w-9/12 xl:w-7/12 mx-auto">
          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 ml-2 mr-2"
          >
            <h2 className="text-xl font-semibold mb-4">Serviços disponiveis</h2>
            <div className="mb-4">
              <label
                htmlFor="servico"
                className="block text-gray-700 font-bold mb-2"
              >
                Selecione um tipo de serviço:
              </label>
              <select
                id="servico"
                value={servicoSelecionado}
                onChange={handleServicoChange}
                className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="">Selecione um serviço</option>
                {Array.isArray(tipo_Servico) &&
                  tipo_Servico.map((tipo_servico) => (
                    <option
                      key={tipo_servico.id}
                      value={tipo_servico.tipo_servico}
                      className="bg-green-200"
                    >
                      {tipo_servico.tipo_servico}
                    </option>
                  ))}
              </select>
              {servicoSelecionado && (
                <p className="text-gray-600 mt-2">
                  Você selecionou o serviço: {servicoSelecionado}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="cidadao_cpf"
                className="block text-gray-700 font-bold mb-2"
              >
                CPF do Cidadão:
              </label>
              <div className="flex">
                <InputMask
                  mask="999.999.999-99"
                  type="text"
                  value={agendamentoData.cidadao_cpf}
                  onBlur={handleCpfBlur}
                  placeholder="000.000.000-00"
                  className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  onChange={(event) =>
                    setAgendamentoData({
                      ...agendamentoData,
                      cidadao_cpf: event.target.value,
                    })
                  }
                />
              </div>
            </div>

            {agendamentoData.cidadao_cpf.length === 14 && cidadaoInfo && (
              <div className="text-gray-600 mt-2">
                {isLoading ? (
                  "Carregando..."
                ) : (
                  <>
                    {cidadaoInfo.name
                      ? `A informações de cadastro no nosso sistema deseja usá-las? serão preenchidas automaticamente. Caso contrário, preencha os campos manualmente.`
                      : `Nenhuma informação de cadastro encontrada. Preencha os campos manualmente.`}
                    {cidadaoInfo.name && (
                      <button
                        type="button"
                        className="underline text-blue-500 ml-2"
                        onClick={handleUseCadastroClick}
                      >
                        Usar informações de cadastro
                      </button>
                    )}
                  </>
                )}
              </div>
            )}

            <label htmlFor="nome" className="block mb-1 font-medium">
              nome
            </label>
            <input
              type="text"
              id="nome"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={agendamentoData.name}
              onChange={(event) =>
                setAgendamentoData({
                  ...agendamentoData,
                  name: event.target.value,
                })
              }
            />

            <label htmlFor="telefone" className="block mb-1 font-medium">
              Telefone
            </label>
            <InputMask
              mask="(99) 9999-9999"
              type="text"
              id="telefone"
              placeholder="(00) 0000-0000"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={agendamentoData.telefone}
              onChange={(event) =>
                setAgendamentoData({
                  ...agendamentoData,
                  telefone: event.target.value,
                })
              }
            />

<div className="mb-4"> 
  <label
    htmlFor="bairro"
    className="block text-gray-700 font-bold mb-2"
  >
    Bairro:
  </label>
  <select
    className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
    value={agendamentoData.bairro}
    onChange={(e) => setAgendamentoData({ ...agendamentoData, bairro: e.target.value })}
  >
    <option value="">Selecione seu bairro</option>
    {bairros.map((bairro, index) => (
      <option key={index} value={bairro}>{bairro}</option>
    ))}
  </select>
</div>

            <div className="mb-4">
              <label
                htmlFor="endereco_agendamento"
                className="block text-gray-700 font-bold mb-2"
              >
                Endereço de Agendamento:
              </label>
              <input
                type="text"
                value={agendamentoData.endereco_agendamento}
                onChange={(event) =>
                  setAgendamentoData({
                    ...agendamentoData,
                    endereco_agendamento: event.target.value,
                  })
                }
                className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="localidade"
                className="block text-gray-700 font-bold mb-2"
              >
                Escolha a Localidade:
              </label>
              <select
                id="localidade"
                value={selectedLocalidadeId}
                onChange={handleLocalidadeChange}
                className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="">Selecione uma localidade</option>
                {Array.isArray(selectedLocalidade) &&
                  selectedLocalidade.map((localidade, index) => (
                    <option
                      key={localidade.id}
                      value={localidade.id}
                      style={{
                        backgroundColor:
                          index % 2 === 0 ? "thistle" : "lightgreen",
                      }}
                    >
                      {localidade.nome}
                    </option>
                  ))}
              </select>
            </div>

            <div className="mb-4">
              <label
                htmlFor="n_agendamento"
                className="block text-gray-700 font-bold mb-2"
              >
                Número de Agendamento:
              </label>
              <input
                type="text"
                value={agendamentoData.n_agendamento}
                onChange={(event) =>
                  setAgendamentoData({
                    ...agendamentoData,
                    n_agendamento: event.target.value,
                  })
                }
                className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="ponto_referencia"
                className="block text-gray-700 font-bold mb-2"
              >
                Ponto de Referência:
              </label>
              <input
                type="text"
                value={agendamentoData.ponto_referencia}
                onChange={(event) =>
                  setAgendamentoData({
                    ...agendamentoData,
                    ponto_referencia: event.target.value,
                  })
                }
                className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="observacao"
                className="block text-gray-700 font-bold mb-2"
              >
                Observação:
              </label>
              <textarea
                id="observacao"
                value={agendamentoData.observacao}
                onChange={(event) =>
                  setAgendamentoData({
                    ...agendamentoData,
                    observacao: event.target.value,
                  })
                }
                className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-28 resize-none"
              />
            </div>
            <input type="hidden" name="status" value={agendamentoData.status} />

            <div className="flex items-center justify-end">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Enviar
              </button>
            </div>
          </form>
          {isModalOpen && (
          <MyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-4">
                Chamado aberto com sucesso!
              </h2>
             
              <p className="mb-4">
              Número do Protocolo: {ultimoAgendamento && ultimoAgendamento.chamados}
              </p>
             
              <div className="flex justify-center">
                <button
                  onClick={handleCloseAndRedirect}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Terminar Agendamento
                </button>
              </div>
            </div>
          </MyModal>
        )}
          {errorMessage && (
            <div className="alert alert-danger text-red-700" role="alert">
              {errorMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Formulario;
