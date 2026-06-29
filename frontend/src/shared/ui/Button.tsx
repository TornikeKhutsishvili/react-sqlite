import React, { type ButtonHTMLAttributes, type ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <button className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700" {...props}>
      {children}
    </button>
  )
}

export default Button