import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { useRouter } from "next/navigation";


const MyModal = ({ isOpen }: { isOpen: boolean; onClose: any }) => {
    const [showModal, setShowModal] = useState(isOpen);
    const router = useRouter();

  const handleClose = () => {
    setShowModal(false);
    
  };

  return (
    <Dialog visible={showModal} onHide={handleClose} header="Agendamento Aberto com Sucesso" style={{ width: '30vw' }}>
      <div className="bg-lime-600 p-4">
        <h2 className="text-white text-2xl font-semibold mb-4">
          Agendamento Aberto com Sucesso
        </h2>
        <p className="text-white mb-4">
          Seu chamado foi aberto com sucesso. Aguarde a disponibilidade de atendimento.
        </p>
        <Button label="Voltar para o painel do cidadão" className="bg-orange-500" onClick={() => {
          handleClose();
          router.push("/painel-cidadao");
        }} />
        <Button label="Fechar o aplicativo" className="bg-red-500 ml-2" onClick={() => {
          handleClose();
          router.push("/");
        }} />
      </div>
    </Dialog>
  );
};

export default MyModal;