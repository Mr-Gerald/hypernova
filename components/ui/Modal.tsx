
import React, { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center" onClick={onClose}>
      <div className="bg-nova-dark-200 rounded-lg shadow-xl w-full max-w-md m-4 p-6 relative" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-nova-light">{title}</h2>
            <button onClick={onClose} className="text-nova-gray hover:text-nova-light text-2xl">&times;</button>
        </div>
        <div>
            {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
