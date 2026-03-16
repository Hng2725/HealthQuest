import React, { useState } from 'react';
import useAuthStore from '../store/authStore';
import useTaskStore from '../store/taskStore';
import Button from '../components/common/Button';
import { User, Mail, Shield, Award } from 'lucide-react';

const Profile = () => {
  const { user } = useAuthStore();
  const { tasks } = useTaskStore();
  
  // Calculate stats
  const completedTasksCount = tasks.filter(t => t.status === 'completed').length;
  const activeTasksCount = tasks.filter(t => t.status !== 'completed').length;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-white mb-8">Character Details</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column - Avatar & Core Stats */}
        <div className="col-span-1 space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-surface p-6 text-center shadow-lg">
            <div className="mx-auto h-32 w-32 overflow-hidden rounded-full border-4 border-slate-700 bg-slate-900 mb-4 shadow-xl">
              {user?.avatar ? (
                <img src={user.avatar} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-5xl">👤</div>
              )}
            </div>
            
            <h2 className="text-2xl font-bold text-white">{user?.username}</h2>
            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-sm font-semibold text-accent border border-accent/20">
              <Shield className="h-4 w-4" />
              Level {user?.level}
            </div>
          </div>
        </div>

        {/* Right Column - Details & Achievements */}
        <div className="col-span-1 md:col-span-2 space-y-6">
          
          {/* Account Info */}
          <div className="rounded-2xl border border-slate-800 bg-surface p-6 shadow-lg">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Account Details
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-3 items-center border-b border-slate-800 pb-3">
                <div className="text-sm text-slate-400">Username</div>
                <div className="col-span-2 font-medium text-slate-200">{user?.username}</div>
              </div>
              <div className="grid grid-cols-3 items-center border-b border-slate-800 pb-3">
                <div className="text-sm text-slate-400">Email</div>
                <div className="col-span-2 font-medium text-slate-200 flex items-center gap-2">
                  <Mail className="h-4 w-4 text-slate-500" />
                  {user?.email}
                </div>
              </div>
              <div className="grid grid-cols-3 items-center">
                <div className="text-sm text-slate-400">Joined</div>
                <div className="col-span-2 font-medium text-slate-200">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                </div>
              </div>
            </div>
          </div>

          {/* Adventure Stats */}
          <div className="rounded-2xl border border-slate-800 bg-surface p-6 shadow-lg">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Award className="h-5 w-5 text-accent" />
              Adventure Statistics
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-slate-900/50 p-4 border border-slate-800">
                <div className="text-sm text-slate-400">Total EXP Earned</div>
                <div className="mt-1 text-2xl font-bold text-white">{user?.level * 100 + user?.exp}</div>
              </div>
              <div className="rounded-xl bg-slate-900/50 p-4 border border-slate-800">
                <div className="text-sm text-slate-400">Current Balance</div>
                <div className="mt-1 text-2xl font-bold text-yellow-500">{user?.coins} Coins</div>
              </div>
              <div className="rounded-xl bg-slate-900/50 p-4 border border-slate-800 bg-emerald-500/5">
                <div className="text-sm text-slate-400">Quests Completed</div>
                <div className="mt-1 text-2xl font-bold text-emerald-400">{completedTasksCount}</div>
              </div>
              <div className="rounded-xl bg-slate-900/50 p-4 border border-slate-800">
                <div className="text-sm text-slate-400">Active Quests</div>
                <div className="mt-1 text-2xl font-bold text-slate-300">{activeTasksCount}</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
