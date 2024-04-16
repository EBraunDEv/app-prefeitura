import { useEffect, useState } from "react";


type Agendamentos= {
  id: number;
  tipo_servico: string;
  cidadao_cpf: string;
  name: string;
  telefone: string;
  bairro: string,
  endereco_agendamento: string;
  localidade: string;
  n_agendamento: string;
  ponto_referencia: string;
  observacao: string;
  status: string;
  dataAbertura: string;
  dataAgendamento: string | null;
  dataExecucao: string | null;
  chamados: number;
};

interface CidadaoCardProps {
  storedCpf: string;
 
}

const CidadaoCard: React.FC<CidadaoCardProps> = ({ storedCpf }) => {
    const [agendamentos, setAgendamentos] = useState<Agendamentos[]>([]);

      
    useEffect(() => {
      async function fetchAgendamentos() {
        const response = await fetch(`/api/agendamento-cpf?cpf=${storedCpf}`);
        const data = await response.json();
        if (data.agendamentos) {
          const filteredAgendamentos = data.agendamentos.filter((agendamento: any) => agendamento.cidadao_cpf === storedCpf);
          setAgendamentos(filteredAgendamentos);
        } else {
          console.error('Erro: agendamentos é indefinido');
        }
      }
      fetchAgendamentos();
    }, [storedCpf]);


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
    <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6 w-full sm:w-auto my-4 overflow-auto">
      {agendamentos.map((agendamento: Agendamentos) => (
        <div key={agendamento.id} className={`shadow-lg rounded-lg p-4 sm:p-6 w-full sm:w-auto my-4 overflow-auto flex-grow ${getStatusColor(agendamento.status)}`}>
          <h4 className="text-xl sm:text-2xl font-bold mb-2 flex-grow-0 text-white">Solicitante: {agendamento.name}</h4>
          <div className="flex flex-col gap-2 text-base sm:text-lg font-bold text-white">
            <p>CPF: {agendamento.cidadao_cpf}</p>
            <p>Tipo de Serviço: {agendamento.tipo_servico}</p>
            <p>Telefone: {agendamento.telefone}</p>
             <p>Bairro: {agendamento.bairro}</p>
            <p>Endereço: {agendamento.endereco_agendamento}</p>
            <p>Localidade: {agendamento.localidade}</p>
            <p>Nº da Residência: {agendamento.n_agendamento}</p>
            <p>Ponto de Referência: {agendamento.ponto_referencia}</p>
            <p>Observação: {agendamento.observacao}</p>
            <p>Status: {agendamento.status}</p>
            <p>Data da Solicitação: {agendamento.dataAbertura}</p>
            <p>Data de Agendamento: {agendamento.dataAgendamento}</p>
            <p>Data de Conclusão:{agendamento.dataExecucao}</p>
          </div>
        </div>

      ))}
    </div>
)
}

export default CidadaoCard;