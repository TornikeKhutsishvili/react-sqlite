import React, { type InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Input: React.FC<InputProps> = ({ label, ...props }) => {
  return (
    <div className="flex flex-col gap-1">
      <label>{label}</label>

      <input className="rounded border px-3 py-2" {...props} />
    </div>
  )
}

export default Input