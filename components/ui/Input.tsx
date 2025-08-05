
import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Input: React.FC<InputProps> = ({ label, id, ...props }) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-nova-gray mb-1">{label}</label>
      <input
        id={id}
        {...props}
        className="w-full bg-nova-dark-200 border border-nova-gray/30 rounded-lg p-3 text-nova-light focus:ring-2 focus:ring-nova-red focus:border-nova-red transition duration-200 outline-none"
      />
    </div>
  );
};

export default Input;
