import React from 'react';
import { cn } from '../../utils/cn';
import { CheckCircle2, Clock, Swords } from 'lucide-react';
import { Badge } from './Badge';
import Button from './Button';

const priorityColors = {
  High: 'danger',
  Medium: 'warning',
  Low: 'success',
};

const TaskCard = ({ 
  task, 
  onComplete, 
  onEdit, 
  onDelete, 
  isLoading 
}) => {
  const isCompleted = task.status === 'completed';

  return (
    <div className={cn(
      "group relative flex flex-col justify-between rounded-xl border p-5 transition-all",
      isCompleted 
        ? "border-emerald-500/20 bg-emerald-500/5 opacity-80" 
        : "border-slate-800 bg-surface hover:border-slate-700 hover:shadow-lg"
    )}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className={cn(
            "text-lg font-semibold tracking-tight",
            isCompleted ? "text-slate-400 line-through" : "text-slate-100"
          )}>
            {task.title}
          </h3>
          {task.description && (
            <p className="mt-1 text-sm text-slate-400 line-clamp-2">
              {task.description}
            </p>
          )}
        </div>
        
        {task.type === 'system' && (
          <Badge variant="primary" icon={Swords} className="ml-2 shrink-0">
            Quest
          </Badge>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Badge variant={priorityColors[task.priority] || 'default'}>
          {task.priority} Priority
        </Badge>
        
        {task.deadline && (() => {
          const isDueSoon = new Date(task.deadline).getTime() - new Date().getTime() < 24 * 60 * 60 * 1000;
          const isOverdue = new Date(task.deadline).getTime() < new Date().getTime();
          
          let badgeVariant = "default";
          let label = new Date(task.deadline).toLocaleDateString();
          
          if (!isCompleted) {
            if (isOverdue) {
              badgeVariant = "danger";
              label = `Overdue: ${label}`;
            } else if (isDueSoon) {
              badgeVariant = "warning";
              label = `Due Soon: ${label}`;
            }
          }
          
          return (
            <Badge variant={badgeVariant} icon={Clock}>
              {label}
            </Badge>
          );
        })()}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-800 pt-4">
        <div className="flex items-center gap-3 text-sm font-medium">
          <span className="flex items-center text-accent">
            <span className="mr-1">★</span> {task.expReward} EXP
          </span>
          <span className="flex items-center text-yellow-500">
            <span className="mr-1">●</span> {task.coinReward} Coins
          </span>
        </div>

        <div className="flex items-center gap-2">
          {!isCompleted && task.type !== 'system' && onEdit && (
            <Button variant="outline" size="sm" onClick={() => onEdit(task)}>
              Edit
            </Button>
          )}
          
          <Button 
            variant={isCompleted ? "outline" : "success"}
            size={isCompleted ? "sm" : "md"}
            isLoading={isLoading}
            disabled={isCompleted}
            onClick={() => onComplete(task._id)}
            className={cn(isCompleted && "pointer-events-none border-emerald-500/50 text-emerald-500")}
          >
            {isCompleted ? (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Done
              </>
            ) : "Complete"}
          </Button>
        </div>
      </div>
      
      {/* Delete button (absolute positioned, appears on hover) */}
      {!isCompleted && task.type !== 'system' && onDelete && (
        <button
          onClick={() => onDelete(task._id)}
          className="absolute -top-3 -right-3 rounded-full bg-slate-800 p-1.5 text-slate-400 opacity-0 transition-opacity hover:bg-danger hover:text-white group-hover:opacity-100 shadow-sm border border-slate-700"
          title="Delete task"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      )}
    </div>
  );
};

export default TaskCard;
