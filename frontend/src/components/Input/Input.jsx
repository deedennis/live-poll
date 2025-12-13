import React from 'react';

const Input = ({ 
  label,
  error,
  helperText,
  className = '',
  variant = 'default',
  size = 'md',
  ...props 
}) => {
  const baseClasses = 'w-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500';
  
  const variants = {
    default: 'input-modern',
    filled: 'bg-base-200 border-0 rounded-xl px-4 py-3 focus:bg-base-100',
    outlined: 'border-2 border-base-300 bg-transparent rounded-xl px-4 py-3 focus:border-primary-500',
  };
  
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-5 py-4 text-lg',
  };
  
  const inputClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;
  
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-base-content mb-2">
          {label}
        </label>
      )}
      <input
        className={inputClasses}
        {...props}
      />
      {error && (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-2 text-sm text-base-content opacity-70">{helperText}</p>
      )}
    </div>
  );
};

export default Input;
