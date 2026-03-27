import React from 'react';
import { cn } from '../../utils/cn';

const Button = React.forwardRef(({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  isLoading, 
  children, 
  ...props 
}, ref) => {
  return (
    <button
      ref={ref}
      disabled={isLoading || props.disabled}
      className={cn(
        "inline-flex items-center justify-center rounded-2xl font-bold transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        {
          'bg-primary text-slate-800 shadow-sm hover:shadow-md hover:bg-primaryHover focus-visible:ring-primary': variant === 'primary',
          'bg-white text-slate-600 border border-amber-200 hover:bg-amber-50 focus-visible:ring-slate-400': variant === 'outline',
          'bg-danger text-white hover:bg-red-500 focus-visible:ring-danger shadow-sm': variant === 'danger',
          'bg-success text-slate-800 hover:bg-emerald-300 focus-visible:ring-success shadow-sm': variant === 'success',
          'bg-accent text-white hover:bg-pink-500 focus-visible:ring-accent shadow-sm': variant === 'accent',
        },
        {
          'h-8 px-3 text-xs': size === 'sm',
          'h-10 px-4 py-2': size === 'md',
          'h-12 px-8 text-lg': size === 'lg',
          'h-10 w-10 p-2': size === 'icon',
        },
        className
      )}
      {...props}
    >
      {isLoading ? (
        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : null}
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
