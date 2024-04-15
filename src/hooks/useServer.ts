import { useEffect, useState } from "react";

interface Agendamento {
  chamados: string;
  status: string;
  tipo_servico: string;
  data_agendamento: string;
}

const useServer = (cpf: string) => {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    const fetchAgendamentos = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/agendamentos/${cpf}`);
        if (!response.ok) {
          throw new Error("Erro ao buscar agendamentos");
        }
        const data = await response.json();
        setAgendamentos(data.agendamentos);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    }

    fetchAgendamentos();
  }, [cpf]);

  return { agendamentos, loading, error };
};

export default useServer;
