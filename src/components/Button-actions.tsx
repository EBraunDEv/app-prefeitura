import React from 'react';
import { useRouter } from "next/navigation";


const ButtonActions: React.FC = () => {
    const router = useRouter();

    const handleButtonClick = () => {
        router.push('/agendamento');
    };

    return (
        <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-12 no-print"
            onClick={handleButtonClick}
        >
            Sair
        </button>
    );
};

export default ButtonActions;