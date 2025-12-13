import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  loading = false,
  className = '',
  onClick,
  type = 'button',
  ...props 
}) => {
  const baseClasses = 'font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-white';
  
  const variants = {
    primary: 'btn-modern text-white',
    secondary: 'btn-modern-secondary text-white',
    accent: 'btn-modern-accent text-white',
    outline: 'border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white bg-transparent',
    ghost: 'text-primary-500 hover:bg-primary-500 hover:bg-opacity-10 bg-transparent',
    danger: 'bg-red-500 hover:bg-red-600 text-white shadow-medium',
    success: 'bg-green-500 hover:bg-green-600 text-white shadow-medium',
  };
  
  const sizes = {
    sm: 'px-3 py-2 text-sm rounded-lg',
    md: 'px-6 py-3 text-base rounded-xl',
    lg: 'px-8 py-4 text-lg rounded-xl',
    xl: 'px-10 py-5 text-xl rounded-2xl',
  };
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;
  
  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
          Loading...
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
