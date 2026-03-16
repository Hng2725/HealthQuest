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
        "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        {
          'bg-primary text-white hover:bg-primaryHover focus-visible:ring-primary': variant === 'primary',
          'bg-surface text-slate-100 border border-slate-700 hover:bg-slate-800 focus-visible:ring-slate-400': variant === 'outline',
          'bg-danger text-white hover:bg-red-600 focus-visible:ring-danger': variant === 'danger',
          'bg-success text-white hover:bg-emerald-600 focus-visible:ring-success': variant === 'success',
          'bg-accent text-slate-900 hover:bg-yellow-400 focus-visible:ring-accent': variant === 'accent',
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
