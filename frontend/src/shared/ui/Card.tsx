import React, { type ReactNode } from "react";

interface CardProps {
  title: string;
  children: ReactNode;
}

const Card: React.FC<CardProps> = ({ title, children }) => {
  return (
    <div className="rounded-lg border bg-white p-5 shadow">
      <h2 className="mb-4 text-xl font-semibold">{title}</h2>
      {children}
    </div>
  );
};

export default Card