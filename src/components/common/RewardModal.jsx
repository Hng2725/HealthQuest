import React from 'react';
import { Trophy, Star, Coins, X } from 'lucide-react';
import Button from './Button';
import { cn } from '../../utils/cn';

const RewardModal = ({ isOpen, onClose, rewards }) => {
  if (!isOpen || !rewards) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div 
        className="relative w-full max-w-sm rounded-[2.5rem] bg-white p-8 shadow-2xl border-4 border-amber-100 text-center animate-in zoom-in slide-in-from-bottom-8 duration-500"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative elements */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-primary rounded-full flex items-center justify-center shadow-lg border-4 border-white animate-bounce pointer-events-none">
          <Trophy className="h-12 w-12 text-white" />
        </div>
        
        <div className="mt-8 space-y-2">
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Quest Complete!</h2>
          <p className="text-slate-500 font-bold">You've earned epic loot! ✨</p>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="rounded-3xl bg-amber-50 p-6 border-2 border-amber-100 shadow-inner group hover:scale-105 transition-transform">
            <div className="flex flex-col items-center gap-2">
              <div className="p-3 bg-white rounded-2xl shadow-sm text-accent">
                <Star className="h-8 w-8 fill-accent" />
              </div>
              <span className="text-2xl font-black text-slate-700">+{rewards.expAdded}</span>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">EXP</span>
            </div>
          </div>

          <div className="rounded-3xl bg-amber-50 p-6 border-2 border-amber-100 shadow-inner group hover:scale-105 transition-transform">
            <div className="flex flex-col items-center gap-2">
              <div className="p-3 bg-white rounded-2xl shadow-sm text-yellow-500">
                <Coins className="h-8 w-8 fill-yellow-500" />
              </div>
              <span className="text-2xl font-black text-slate-700">+{rewards.coinsAdded}</span>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Coins</span>
            </div>
          </div>
        </div>

        {rewards.newLevel > rewards.oldLevel && (
          <div className="mt-6 p-4 rounded-2xl bg-primary/20 border-2 border-primary/30 animate-pulse">
            <p className="text-primaryHover font-black text-lg">🎊 LEVEL UP: {rewards.newLevel}! 🎊</p>
          </div>
        )}

        <div className="mt-8">
          <Button 
            onClick={onClose}
            className="w-full text-lg py-6 rounded-2xl shadow-[0_8px_0_rgb(217,119,6)] active:translate-y-1 active:shadow-none transition-all"
          >
            Awesome!
          </Button>
        </div>

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-300 hover:text-slate-500 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default RewardModal;
