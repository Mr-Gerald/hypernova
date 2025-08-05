
import React, { TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

const Textarea: React.FC<TextareaProps> = ({ label, id, ...props }) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-nova-gray mb-1">{label}</label>
      <textarea
        id={id}
        {...props}
        rows={4}
        className="w-full bg-nova-dark-200 border border-nova-gray/30 rounded-lg p-3 text-nova-light focus:ring-2 focus:ring-nova-red focus:border-nova-red transition duration-200 outline-none"
      />
    </div>
  );
};

export default Textarea;
