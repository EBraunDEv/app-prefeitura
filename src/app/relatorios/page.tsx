"use client";
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { format } from "date-fns";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useRouter } from "next/navigation";
import ButtonSair from "@/components/button-sair";







type Agendamento = {
    id: number;
    status: string;
    chamados: number;
    tipo_servico: string;
    cidadao_cpf: string;
    name: string;
    telefone: string;
    endereco_agendamento: string;
    dataAbertura: string;
    dataAgendamento: string;
    dataExecucao: string;
};

const ReportsPage = () => {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [interval, setInterval] = useState("monthly");
    const [setorId, setSetorId] = useState(2); 
    const [searchTerm, setSearchTerm] = useState("");
    const [data, setData] = useState<Agendamento[]>([]);
    const router = useRouter();
  
    const extractTableData = () => {
      const tableData: (string | number)[][] = [];
      data.forEach((item) => {
        tableData.push([
         item.chamados,
          item.status,
          item.tipo_servico,
            item.cidadao_cpf,
            item.name,
            item.telefone,
            item.endereco_agendamento,
            item.dataAbertura,
            item.dataAgendamento,
            item.dataExecucao,
        ]);
      });
      return tableData;
    };
  
    const generatePDF = () => {
      const doc = new jsPDF("landscape");
      
      const dataHoraAtual = new Date();
      const horaFormatada = dataHoraAtual.toLocaleTimeString();
  
      const dataAtual = new Date();
      const formatarData = (data: {
        getDate: () => {
          (): any;
          new (): any;
          toString: { (): string; new (): any };
        };
        getMonth: () => number;
        getFullYear: () => {
          (): any;
          new (): any;
          toString: { (): any; new (): any };
        };
      }) => {
        const dia = data.getDate().toString().padStart(2, "0");
        const mes = (data.getMonth() + 1).toString().padStart(2, "0"); 
        const ano = data.getFullYear().toString();
        return `${dia}/${mes}/${ano}`;
      };
      const extractTableData = () => {
        const tableData: (string | number)[][] = [];
        data.forEach((item) => {
          tableData.push([
            item.chamados,
            item.status,
            item.tipo_servico,
            item.cidadao_cpf,
            item.name,
            item.telefone,
            item.endereco_agendamento,
            item.dataExecucao ? format(new Date(item.dataExecucao), 'dd/MM/yyyy') : '', 
          ]);
        });
        return tableData;
      };
  
      const tableData = extractTableData();
  
      const fontSize = 15;
  
      const imgData = "/img/Brasao-soo.png";
      const imgWidth = 25;
      const imgHeight = 15;
      const centerX = (doc.internal.pageSize.getWidth() - imgWidth) / 2;
      doc.addImage(imgData, "PNG", centerX, 1, imgWidth, imgHeight);
  
      doc.setFontSize(16);
      doc.text(
        "PREFEITURA MUNICIPAL DE SOORETAMA",
        doc.internal.pageSize.getWidth() / 2,
        35,
        { align: "center" }
      );
      doc.setFontSize(14);
      doc.text(
        "Relatório de Agendamentos Serviços Urbanos",
        doc.internal.pageSize.getWidth() / 2,
        45,
        { align: "center" }
      );
      doc.setFontSize(12);
const dataFormatada = new Date(dataAtual).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
doc.text(
    `Data: ${dataFormatada} ${horaFormatada}`,
    doc.internal.pageSize.getWidth() / 2,
    60,
    { align: "center" }
);
  
      doc.setFontSize(fontSize);
  
      const head = [
        [
          "Protocolo",
          "Data de Abertura",
          "Status",
          "Tipo de Serviço",
          "Localidade",
          "Nome",
          "CPF",
          "Data de Finalização",
        ],
      ];
      const col = [
       
        "Protocolos",
        "Status",
        "Tipo de Serviço",
        "CPF do Cidadão",
        "Nome",
        "Telefone",
        "Endereço",
        "Data de Abertura",
        "Data de Execução",
      ];
      autoTable(doc, {
        head: [col],
        body: tableData,
        startY: 75,
        styles: { cellWidth: "wrap", fontSize: 8, halign: "center" },
      });
  
      doc.save("relatorio.pdf");
    };
  
    const filterData = useCallback((dataToFilter: Agendamento[]) => {
      let dadosFiltrados = [...dataToFilter];
      
      if (startDate && endDate) {
        const startDateObj = new Date(startDate);
        const endDateObj = new Date(endDate);
      
        dadosFiltrados = dadosFiltrados.filter((agendamento: Agendamento) => {
          const agendamentoDate = new Date(
            agendamento.dataAbertura ?? new Date()
          );
          return agendamentoDate >= startDateObj && agendamentoDate <= endDateObj;
        });
      }
      
      if (searchTerm) {
        dadosFiltrados = dadosFiltrados.filter((agendamento: Agendamento) => {
          return (
            agendamento.id
              .toString()
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            agendamento.tipo_servico
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            agendamento.cidadao_cpf
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            agendamento.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            agendamento.telefone.toLowerCase().includes(searchTerm.toLowerCase()) ||
            agendamento.endereco_agendamento.toLowerCase().includes(searchTerm.toLowerCase()) ||
            agendamento.dataAbertura.toLowerCase().includes(searchTerm.toLowerCase()) ||
            agendamento.dataAgendamento.toLowerCase().includes(searchTerm.toLowerCase()) ||
            agendamento.dataExecucao.toLowerCase().includes(searchTerm.toLowerCase()) 
          );
        });
      }
      return dadosFiltrados;
    }, [startDate, endDate, searchTerm]);
  
  
    const handleSearch = useCallback(async (selectedInterval: string) => {
      try {
        setInterval(selectedInterval);
        const response = await fetch(`/api/agendamentosUrbanos?interval=${selectedInterval}&setorId=${setorId}`);
        const data = await response.json();
        const completedAppointments = data.agendamentos.filter((appointment: any) => appointment.status === 'Concluído');
        setData(completedAppointments);
      } catch (error) {
        console.error("Erro ao buscar os dados", error);
      }
    }, [setorId]); 

    

          
            
    
    useEffect(() => {
      const loadInitialData = async () => {
        await handleSearch(interval);
      };
    
      loadInitialData();
    }, [interval, setorId, handleSearch]);
    
    useEffect(() => {
      const filteredData = filterData(data);
      setData(filteredData);
    }, [filterData, data]);
  
    return (
      <div className="flex flex-col items-center min-h-screen  bg-gray-200  px-8">
        <Image src="/img/Brasao-Soo.png" alt="Logo" width={150} height={90}  className= "mt-6"/>
        <div className=" ">
        
          <div className="text-center space-y-6">
            <h1 className="text-3xl font-bold mb-4">Relatórios</h1>
            
            <form>
            <div className="mb-4">
                <label htmlFor="startDate">Data Inicial:</label>
                <input
                  type="date"
                  id="startDate"
                  value={startDate}
                  className="mb-5 ml-2 p-3  focus:border-green-700 rounded border-2 outline-none"
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="endDate">Data Final:</label>
                <input
                  type="date"
                  id="endDate"
                  value={endDate}
                  className="mb-5 ml-2 p-3  focus:border-green-700 rounded border-2 outline-none"
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            
              <div className="mb-4">
                <label htmlFor="searchTerm">Localizar:</label>
                <input
                  type="text"
                  id="searchTerm"
                  value={searchTerm}
                  className="mb-5 p-3 w-70 focus:border-green-700 rounded border-2 outline-none"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                onClick={generatePDF}
                className="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-1 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-6 py-2.5 text-center mr-2 mb-5"
                type="button"
              >
                Imprimir Relatório em PDF
              </button>
              <button
                onClick={() => handleSearch(interval)}
                className="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-1 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-6 py-2.5 text-center mr-2 mb-5"
                type="button"
              >
                Pesquisar
              </button>

              < ButtonSair />
      
          
            
  
           
            </form>
            
          

            <div>
              <h2 className=" font-bold">Relatorios</h2>
              <table>
                <thead>
                  <tr>
                    <th className="border border-gray-400 px-4 py-2">
                      Protocolo
                    </th>
                    <th className="border border-gray-400 px-4 py-2">
                      Data de Abertura
                    </th>
                    <th className="border border-gray-400 px-4 py-2">Tipo de Serviço</th>
                    
                    <th className="border border-gray-400 px-4 py-2">CPF do Solicitante</th>
                    <th className="border border-gray-400 px-4 py-2">
                      Nome
                    </th>
                    <th className="border border-gray-400 px-4 py-2">Telefone</th>
                    <th className="border border-gray-400 px-4 py-2">Endereço</th>
                    <th className="border border-gray-400 px-4 py-2">
                      Data de Finalização
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item) => (
                    <tr key={item.id}>
                      <td className="border border-gray-400 px-4 py-2">
                        {item.chamados}
                      </td>
                      <td className="border border-gray-400 px-4 py-2">
                      {item.dataAbertura}
                      </td>
                      <td className="border border-gray-400 px-4 py-2">
                        {item.tipo_servico}
                      </td>
                      <td className="border border-gray-400 px-4 py-2">
                        {item.cidadao_cpf}
                      </td>
                      <td className="border border-gray-400 px-4 py-2">
                        {item.name}
                      </td>
                        <td className="border border-gray-400 px-4 py-2">
                            {item.telefone}
                        </td>
                        <td className="border border-gray-400 px-4 py-2">
                            {item.endereco_agendamento}
                        </td>
                        <td className="border border-gray-400 px-4 py-2">
                            { item.dataExecucao}
                        </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default ReportsPage;