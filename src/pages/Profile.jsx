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
      <h1 className="text-3xl font-bold tracking-tight text-slate-800 mb-8 flex items-center gap-2">
        <User className="h-8 w-8 text-primary" /> Character Details
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column - Avatar & Core Stats */}
        <div className="col-span-1 space-y-6">
          <div className="rounded-3xl border border-amber-100 bg-white p-6 text-center shadow-xl">
            <div className="mx-auto h-32 w-32 overflow-hidden rounded-full border-4 border-white bg-amber-50 mb-4 shadow-[0_0_15px_rgba(251,191,36,0.5)]">
              {user?.avatar ? (
                <img src={user.avatar} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-5xl">👤</div>
              )}
            </div>
            
            <h2 className="text-2xl font-bold text-slate-800">{user?.username}</h2>
            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-primary/20 px-4 py-1.5 text-sm font-bold text-primaryHover border border-primary/30 shadow-sm">
              <Shield className="h-4 w-4" />
              Level {user?.level}
            </div>
          </div>
        </div>

        {/* Right Column - Details & Achievements */}
        <div className="col-span-1 md:col-span-2 space-y-6">
          
          {/* Account Info */}
          <div className="rounded-3xl border border-amber-100 bg-white p-6 shadow-xl">
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-amber-100 pb-2">
              <User className="h-5 w-5 text-primary" />
              Account Details
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-3 items-center border-b border-amber-50 pb-3">
                <div className="text-sm font-bold text-slate-500">Username</div>
                <div className="col-span-2 font-bold text-slate-700">{user?.username}</div>
              </div>
              <div className="grid grid-cols-3 items-center border-b border-amber-50 pb-3">
                <div className="text-sm font-bold text-slate-500">Email</div>
                <div className="col-span-2 font-bold text-slate-700 flex items-center gap-2">
                  <Mail className="h-4 w-4 text-slate-400" />
                  {user?.email}
                </div>
              </div>
              <div className="grid grid-cols-3 items-center">
                <div className="text-sm font-bold text-slate-500">Joined</div>
                <div className="col-span-2 font-bold text-slate-700">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                </div>
              </div>
            </div>
          </div>

          {/* Adventure Stats */}
          <div className="rounded-3xl border border-amber-100 bg-white p-6 shadow-xl">
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-amber-100 pb-2">
              <Award className="h-5 w-5 text-primary" />
              Adventure Statistics
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-amber-50/50 p-4 border border-amber-100">
                <div className="text-sm font-bold text-slate-500">Total EXP Earned</div>
                <div className="mt-1 text-2xl font-bold text-slate-800">
                  {user ? (50 * (user.level - 1) * user.level + user.exp).toLocaleString() : 0}
                </div>
              </div>
              <div className="rounded-2xl bg-amber-50/50 p-4 border border-amber-100">
                <div className="text-sm font-bold text-slate-500">Current Balance</div>
                <div className="mt-1 text-2xl font-bold text-primaryHover">{user?.coins} Coins</div>
              </div>
              <div className="rounded-2xl bg-emerald-50 p-4 border border-emerald-100">
                <div className="text-sm font-bold text-slate-500">Quests Completed</div>
                <div className="mt-1 text-2xl font-bold text-emerald-500">{completedTasksCount}</div>
              </div>
              <div className="rounded-2xl bg-amber-50/50 p-4 border border-amber-100">
                <div className="text-sm font-bold text-slate-500">Active Quests</div>
                <div className="mt-1 text-2xl font-bold text-slate-700">{activeTasksCount}</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
