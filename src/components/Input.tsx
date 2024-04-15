import React from 'react';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: IconDefinition;
  onIconClick?: () => void;
}

const Input: React.FC<InputProps> = ({ label, error, icon, onIconClick, ...rest }) => {
  return (
    <div className="flex flex-col mb-4">
      {label && <label className="mb-2 font-bold text-lg">{label}</label>}
      <div className="relative">
        <input
          {...rest}
          className={`border px-4 py-2 rounded-lg w-full ${error ? 'border-red-500' : 'border-gray-300'}`}
        />
        {icon && (
          <button
            type="button"
            onClick={onIconClick}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
          >
            <FontAwesomeIcon icon={icon} />
          </button>
        )}
      </div>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default Input;