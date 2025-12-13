import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  hover = true, 
  padding = 'md',
  variant = 'default',
  ...props 
}) => {
  const baseClasses = 'rounded-2xl transition-all duration-300';
  
  const variants = {
    default: 'card-modern',
    glass: 'glass rounded-2xl p-6',
    elevated: 'bg-white dark:bg-dark-800 shadow-strong rounded-2xl p-6',
    flat: 'bg-base-200 rounded-2xl p-6',
  };
  
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  };
  
  const hoverClasses = hover ? 'hover:shadow-strong hover:-translate-y-1' : '';
  
  const classes = `${baseClasses} ${variants[variant]} ${paddings[padding]} ${hoverClasses} ${className}`;
  
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

export default Card;
