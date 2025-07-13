
import React, { ReactNode, HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => {
  return (
    <div {...props} className={`bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-4 sm:p-6 ${className}`}>
      {children}
    </div>
  );
};

export default Card;
