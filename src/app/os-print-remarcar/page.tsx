'use client'
import ButtonActions from '@/components/Button-actions';
import { useEffect, useRef, useState } from 'react';
import ReactToPrint from 'react-to-print';

interface Agendamento {
  id: number;
  name: string;
  telefone: string;
  cidadao_cpf: string;
  bairro: string;
  endereco_agendamento: string;
  n_agendamento: string;
  chamados: number;
  dataAbertura: string;
  dataAgendamento: string;
  dataRemarcacao: string;
  localidade: string;
  motorista: string;
  veiculo: string;
}

const ActionAgendarPage = () => {
  const [id, setId] = useState<number | null>(null);
  const [agendamento, setAgendamento] = useState<Agendamento | null>(null);
  const componentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const agendamentoId = localStorage.getItem('agendamento');
    if (agendamentoId) {
      setId(parseInt(agendamentoId));
    }
  }, []);

  useEffect(() => {
    if (id) {
      fetch('/api/agendamentosUrbanos')
        .then(response => response.json())
        .then(data => {
          const agendamentoEncontrado = data.agendamentos.find((item: Agendamento) => item.id === id);
          setAgendamento(agendamentoEncontrado);
        });
    }
  }, [id]);
  
  useEffect(() => {
    if (agendamento) {
      window.print();
    }
  }, [agendamento]);

  return (
    <div className="print-section">
      <div ref={componentRef} className="paginaA5">
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="bg-white w-1/2 p-4 rounded-md z-10 imprimir-ordem-de-servico">
            <style>{`
              @media print {
                .paginaA5 {
                  width: 210mm;
                  height: 148mm;
                  margin: 0 auto;
                }
                .imprimir-ordem-de-servico {
                  width: 100%;
                  margin: 0 auto;
                }
              }
            `}</style>

            <h1>O.S. De agendamento</h1>
            <p>Protocolo de atendimento: {id}</p>
            {agendamento && (
              <table className="border-collapse border w-full border-b border-gray-800">
                <thead className="border-b font-medium dark:border-neutral-500"></thead>
                <tbody className="border-b border-gray-800">
            <tr>
              <td className="border-b border-gray-800 p-2 text-center">Solicitante:</td>
              <td className="border-b border-gray-800 p-2 text-center">{agendamento.name}</td>
            </tr>
            <tr></tr>
            <tr>
              <td className="border-b border-gray-800 p-2 text-center">CPF</td>
              <td className="border-b border-gray-800 p-2 text-center">{agendamento.cidadao_cpf}</td>
            </tr>
            <tr>
              <td className="border-b border-gray-800 p-2 text-center">Telefone</td>
              <td className="border-b border-gray-800 p-2 text-center">{agendamento.telefone}</td>
            </tr>
            <tr>
              <td className="border-b border-gray-800 p-2 text-center">Bairro</td>
              <td className="border-b border-gray-800 p-2 text-center">{agendamento.bairro}</td>
            </tr>
            <tr>
              <td className="border-b border-gray-800 p-2 text-center">Endereço</td>
              <td className="border-b border-gray-800 p-2 text-center">{agendamento.endereco_agendamento}</td>
            </tr>
            <tr>
              <td className="border-b border-gray-800 p-2 text-center">Número do agendamento</td>
              <td className="border-b border-gray-800 p-2 text-center">{agendamento.n_agendamento}</td>
            </tr>
            <tr>
              <td className="border-b border-gray-800 p-2 text-center">Protocolo</td>
              <td className="border-b border-gray-800 p-2 text-center">{agendamento.chamados}</td>
            </tr>
            <tr>
              <td className="border-b border-gray-800 p-2 text-center">Data de abertura</td>
              <td className="border-b border-gray-800 p-2 text-center">{agendamento.dataAbertura}</td>
            </tr>
            <tr>
              <td className="border-b border-gray-800 p-2 text-center">Data Remarcada</td>
              <td className="border-b border-gray-800 p-2 text-center">{agendamento.dataRemarcacao}</td>
            </tr>
            <tr>
              <td className="border-b border-gray-800 p-2 text-center">Localidade
              </td>
              <td className="border-b border-gray-800 p-2 text-center">{agendamento.localidade}</td>
            </tr>
            <tr>
              <td className="border-b border-gray-800 p-2 text-center">Motorista</td>
              <td className="border-b border-gray-800 p-2 text-center">{agendamento.motorista}</td>
            </tr>
            <tr>
              <td className="border-b border-gray-800 p-2 text-center">Veículo</td>
              <td className="border-b border-gray-800 p-2 text-center">{agendamento.veiculo}</td>
            </tr>
            <tr></tr>
            <td className="border-b border-gray-800 border p-6 text-center" colSpan={1}>
    Observações:
  </td>
  <td className="border-b border-gray-800 border p-2 bg-gray-400" colSpan={7}>
  <div className="mb-4 flex items-center">
    <label className="mr-2"><input type="checkbox" className="align-middle" /> Não estava em casa</label>
    <label className="mr-2"><input type="checkbox" className="align-middle" /> Não autorizou a entrada</label>
    <label className="mr-2"><input type="checkbox" className="align-middle" /> Não atendeu o celular</label>
  </div>
  <div className="flex items-center">
    <label className="mr-2"><input type="checkbox" className="align-middle" /> Não foi possível localizar o endereço</label>
    <label className="mr-2"><input type="checkbox" className="align-middle" /> Outros</label>
  </div>
</td>
<tr>

  
  <td className="border p-6 text-center" colSpan={3}>
    Assinatura do Solicitante:_________________________________________
  </td>
  <td className="border p-2 text-center" colSpan={2}>
    CPF:____._____._____-____
  </td>
</tr>
<tr>
  <td className="border p-4 text-center" colSpan={5}>
    Assinatura do Motorista:___________________________________
  </td>
</tr>
</tbody>
              </table>
            )}

            <ReactToPrint
              trigger={() => <button className="no-print">Imprimir esta página</button>}
              content={() => componentRef.current}
            />
            <ButtonActions />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionAgendarPage;