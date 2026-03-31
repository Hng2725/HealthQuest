import React, { useState } from 'react';
import { X, Clock } from 'lucide-react';
import Button from './Button';
import { cn } from '../../utils/cn';

const categories = ['Health', 'Fitness', 'Productivity', 'Self-Care', 'Other'];
const priorities = ['Low', 'Medium', 'High'];

const AddTaskModal = ({ isOpen, onClose, onAdd }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Other');
  const [priority, setPriority] = useState('Medium');
  const [isDaily, setIsDaily] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsLoading(true);
    try {
      await onAdd({ 
        title, 
        description, 
        category, 
        priority, 
        frequency: isDaily ? 'Daily' : 'Once',
        expReward: 15, 
        coinReward: 10 
      });
      onClose();
      // Reset form
      setTitle('');
      setDescription('');
      setCategory('Other');
      setPriority('Medium');
      setIsDaily(false);
    } catch (error) {
      console.error('Failed to create task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div 
        className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border-2 border-amber-100 animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Add New Adventure ✨</h2>
          <button 
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-amber-50 hover:text-primaryHover transition-all"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Title</label>
            <input 
              type="text"
              required
              placeholder="What needs to be done?"
              className="w-full rounded-2xl border-2 border-amber-100 bg-amber-50 px-4 py-3 text-slate-800 font-medium placeholder-slate-400 focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Description (Optional)</label>
            <textarea 
              placeholder="Tell me more about it..."
              rows={3}
              className="w-full rounded-2xl border-2 border-amber-100 bg-amber-50 px-4 py-3 text-slate-800 font-medium placeholder-slate-400 focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Mark (Category)</label>
              <select 
                className="w-full rounded-2xl border-2 border-amber-100 bg-amber-50 px-4 py-3 text-slate-800 font-bold focus:border-primary focus:bg-white focus:outline-none transition-all cursor-pointer"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Priority</label>
              <select 
                className="w-full rounded-2xl border-2 border-amber-100 bg-amber-50 px-4 py-3 text-slate-800 font-bold focus:border-primary focus:bg-white focus:outline-none transition-all cursor-pointer"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                {priorities.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-3xl bg-amber-50/50 border-2 border-amber-100 shadow-inner">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white rounded-2xl shadow-sm text-primary">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold text-slate-800 text-sm">Daily Quest</p>
                <p className="text-xs text-slate-500 font-bold">Resets every 24h</p>
              </div>
            </div>
            <button 
              type="button"
              onClick={() => setIsDaily(!isDaily)}
              className={cn(
                "relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none shadow-sm",
                isDaily ? "bg-primary" : "bg-slate-300"
              )}
            >
              <span 
                className={cn(
                  "pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out",
                  isDaily ? "translate-x-5" : "translate-x-0"
                )} 
              />
            </button>
          </div>

          <div className="pt-4 flex gap-3">
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1 rounded-2xl" 
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1 rounded-2xl shadow-lg" 
              isLoading={isLoading}
            >
              Create Quest
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;
