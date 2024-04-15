import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

function TabelaComponente({ data }: { data: any[] }) {
    return (
        <DataTable value={data}>
            <Column field="id" header="ID" />
            <Column field="status" header="Status" />
            <Column field="cpf" header="CPF (Solicitante)" />
            <Column field="endereco" header="Endereço" />
            <Column field="bairro" header="Bairro" />
            <Column field="motorista" header="Motorista" />
            <Column field="caminhao" header="Caminhão" />
            <Column field="dataAbertura" header="Data de Abertura" />
            <Column field="dataAgendamento" header="Data de Agendamento" />
            <Column field="dataExecutada" header="Data Executada" />
        </DataTable>
    );
}

export default TabelaComponente;