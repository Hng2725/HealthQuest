import React from 'react';
import { cn } from '../../utils/cn';
import { Coins } from 'lucide-react';

const Badge = ({ 
  children, 
  className, 
  variant = 'default',
  icon: Icon
}) => {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        {
          'bg-surface text-slate-100 border border-slate-700': variant === 'default',
          'bg-primary/20 text-primary border border-primary/50': variant === 'primary',
          'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50': variant === 'success',
          'bg-red-500/20 text-red-400 border border-red-500/50': variant === 'danger',
          'bg-yellow-500/20 text-yellow-500 border border-yellow-500/50': variant === 'warning',
        },
        className
      )}
    >
      {Icon && <Icon className="w-3 h-3 mr-1" />}
      {children}
    </span>
  );
};

const CoinBadge = ({ amount, className }) => {
  return (
    <Badge variant="warning" icon={Coins} className={cn("text-sm", className)}>
      {amount}
    </Badge>
  );
};

export { Badge, CoinBadge };
