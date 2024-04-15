'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useUser } from '@/contexts/UserContext';
import { useAuth } from '@/contexts/auth';
import ButtonActions from '@/components/Button-actions';

const schema = z.object({
  dataExecucao: z.string().nonempty({ message: 'Por favor, preencha o campo Data de Conclusão.' }),
});

type Agendamento = z.infer<typeof schema>;

export default function ActionConcluirPage() {
  const router = useRouter();
  const [dataExecucao, setDataExecucao] = useState('');
  const [visible, setVisible] = useState(false);
  const { user } = useUser();
  useAuth();

  const { register, handleSubmit, formState: { errors } } = useForm<Agendamento>({
    resolver: zodResolver(schema),
  });

  const footerContent = (
    <div>
      <Button
        label="OK"
        className="p-button-primary bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded self-center mt-4"
        onClick={() => setVisible(false)}
      />
    </div>
  );

  const afterSubmit = () => {
    router.push('/agendamento');
  };

  const onSubmit = async (data: Agendamento) => {
    if (!data.dataExecucao) {
      setVisible(true);
      return;
    }

    try {
      const response = await fetch('/api/actions-concluir', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: localStorage.getItem('agendamento') ? parseInt(localStorage.getItem('agendamento') as string) : null,
          status: 'Concluído',
          ...data
        })
      });

      if (response.ok) {
        console.log('Dados enviados com sucesso');
      } else {
        console.log('Erro ao enviar os dados');
      }
    } catch (error) {
      console.error('Erro ao enviar os dados:', error);
    }

    afterSubmit();
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="w-[900px] h-[900px] bg-white flex flex-col mx-auto mt-4">
        <nav className="p-4 bg-blue-500 text-white flex items-center justify-center w-full  mr-4 ">
          <h1 className="text-3xl font-bold">Tela de Conclusão</h1>
          <ButtonActions />
        </nav>
        <div className="flex flex-col items-center min-h-screen bg-gray-200 ">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col items-center mt-6 bg-white p-6 rounded shadow-md w-[650px] "
          >

            <label htmlFor='dataExecucao' className='pr-2 font-semibold w-full mt-4'>
              Data de Conclusão:
              <input
                type="date"
                {...register('dataExecucao')}
                className="border border-gray-400 px-4 py-2 rounded-md w-full mt-2 focus:outline-none focus:border-green-500 transition-all duration-200 ease-in-out"
              />
              {errors.dataExecucao && <p className='text-red-600'>{errors.dataExecucao.message}</p>}
            </label>
            <button
              type="submit"
              className="mt-4 bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded self-center"
            >
              Concluir
            </button>
          </form>
          <Dialog
            header=""
            visible={visible}
            position="center"
            style={{ width: "50vw" }}
            onHide={() => setVisible(false)}
            footer={footerContent}
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
    </div>
  );

}
