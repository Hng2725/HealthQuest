import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Trophy, Medal, Award } from 'lucide-react';
import { cn } from '../utils/cn';
import useAuthStore from '../store/authStore';

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user: currentUser } = useAuthStore();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/leaderboard');
        setUsers(response.data);
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getRankIcon = (index) => {
    switch (index) {
      case 0: return <Trophy className="h-6 w-6 text-yellow-400 drop-shadow-md" />;
      case 1: return <Medal className="h-6 w-6 text-slate-300 drop-shadow-md" />;
      case 2: return <Award className="h-6 w-6 text-amber-600 drop-shadow-md" />;
      default: return <span className="text-lg font-bold text-slate-500 w-6 text-center">{index + 1}</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <span className="h-8 w-8 animate-spin rounded-full border-4 border-slate-700 border-t-primary"></span>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-white flex items-center justify-center gap-3">
          <Trophy className="h-10 w-10 text-yellow-400" />
          Hall of Heroes
        </h1>
        <p className="mt-4 text-lg text-slate-400">
          The most dedicated adventurers in the realm. Keep completing quests to climb the ranks!
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-surface/50 p-1 shadow-xl backdrop-blur-sm">
        <div className="rounded-xl bg-surface">
          {/* Header Row */}
          <div className="grid grid-cols-12 gap-4 border-b border-slate-800 p-4 text-sm font-semibold uppercase tracking-wider text-slate-400">
            <div className="col-span-2 text-center">Rank</div>
            <div className="col-span-6">Hero</div>
            <div className="col-span-2 text-center">Level</div>
            <div className="col-span-2 text-right">EXP</div>
          </div>

          {/* Leaderboard List */}
          <div className="divide-y divide-slate-800/50">
            {users.map((u, index) => {
              const isCurrentUser = currentUser?._id === u._id;
              
              return (
                <div 
                  key={u._id} 
                  className={cn(
                    "grid grid-cols-12 items-center gap-4 p-4 transition-colors hover:bg-slate-800/50",
                    isCurrentUser && "bg-primary/5 hover:bg-primary/10"
                  )}
                >
                  {/* Rank */}
                  <div className="col-span-2 flex justify-center">
                    {getRankIcon(index)}
                  </div>

                  {/* User Info */}
                  <div className="col-span-6 flex items-center gap-4">
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-slate-700 bg-slate-900">
                      {u.avatar ? (
                        <img src={u.avatar} alt={u.username} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-slate-800 text-sm font-bold text-slate-400">
                          {u.username.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div>
                      <span className={cn(
                        "font-bold", 
                        isCurrentUser ? "text-primary" : "text-slate-200"
                      )}>
                        {u.username}
                      </span>
                      {isCurrentUser && (
                        <span className="ml-2 rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                          You
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Level */}
                  <div className="col-span-2 flex justify-center">
                    <span className="rounded-lg bg-surface px-3 py-1 text-sm font-bold text-accent shadow-inner border border-slate-800">
                      Lvl {u.level}
                    </span>
                  </div>

                  {/* EXP */}
                  <div className="col-span-2 text-right font-mono text-sm text-slate-400">
                    {u.exp.toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>
          
          {users.length === 0 && (
            <div className="p-12 text-center text-slate-500">
              No heroes found. Be the first to join the ranks!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
