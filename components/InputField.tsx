
import React from 'react';

interface InputFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  placeholder: string;
  as?: 'input' | 'textarea' | 'select';
  options?: string[];
}

export const InputField: React.FC<InputFieldProps> = ({ id, label, value, onChange, placeholder, as = 'input', options = [] }) => {
  const commonClasses = "w-full bg-slate-700/50 border border-slate-600 rounded-md py-2 px-3 text-slate-200 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-colors duration-200 placeholder-slate-500";
  
  const renderInput = () => {
    switch(as) {
      case 'textarea':
        return <textarea id={id} name={id} value={value} onChange={onChange} placeholder={placeholder} rows={3} className={`${commonClasses} resize-y`} />;
      case 'select':
        return (
          <select id={id} name={id} value={value} onChange={onChange} className={`${commonClasses}`}>
            {options.map(option => <option key={option} value={option}>{option}</option>)}
          </select>
        );
      case 'input':
      default:
        return <input type="text" id={id} name={id} value={value} onChange={onChange} placeholder={placeholder} className={commonClasses} />;
    }
  };

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
      {renderInput()}
    </div>
  );
};
