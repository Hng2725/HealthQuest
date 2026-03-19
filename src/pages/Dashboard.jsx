import React, { useEffect, useState } from 'react';
import useAuthStore from '../store/authStore';
import useTaskStore from '../store/taskStore';
import TaskCard from '../components/common/TaskCard';
import ProgressBar from '../components/common/ProgressBar';
import Button from '../components/common/Button';
// Icons could be added here if needed

const Dashboard = () => {
  const { user } = useAuthStore();
  const { tasks, fetchTasks, completeTask, deleteTask, isLoading } = useTaskStore();
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'completed'

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCompleteTask = async (taskId) => {
    try {
      const result = await completeTask(taskId);
      
      const rewards = result.rewards;
      if (rewards) {
        alert(`Chúc mừng! Bạn đã nhận được:\n+${rewards.expAdded} EXP\n+${rewards.coinsAdded} Coins`);
      }

      // Check for level up
      if (rewards?.newLevel > user?.level) {
        alert(`CHÚC MỪNG! BẠN ĐÃ THĂNG CẤP: LEVEL ${rewards.newLevel}! 🎉`);
      }
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || 'Lỗi khi hoàn thành nhiệm vụ';
      alert(`Thất bại: ${msg}`);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return task.status !== 'completed';
    if (filter === 'completed') return task.status === 'completed';
    return true;
  });

  const expNeeded = user?.level * 100 || 100;
  const progressPercent = user ? (user.exp / expNeeded) * 100 : 0;

  return (
    <div className="space-y-8 max-w-5xl mx-auto border border-red-500 rounded-lg p-5"> 
      {/* Red border added for clarity on where Dashboard content starts, can be removed later */}
      
      {/* Welcome Banner & Stats */}
      <section className="rounded-2xl border border-slate-700 bg-surface p-6 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-primary bg-slate-800 flex items-center justify-center">
              {user?.avatar ? (
                <img src={user.avatar} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                <span className="text-2xl">👤</span>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Welcome back, {user?.username}!</h1>
              <p className="text-slate-400 mt-1">Ready to conquer your daily quests?</p>
            </div>
          </div>
          
          <div className="w-full md:w-64 space-y-2 bg-slate-900/50 p-4 rounded-xl border border-slate-700">
            <div className="flex justify-between text-sm font-semibold">
              <span className="text-accent">Level {user?.level}</span>
              <span className="text-slate-400">{user?.exp} / {expNeeded} EXP</span>
            </div>
            <ProgressBar progress={progressPercent} colorClass="bg-accent" />
          </div>
        </div>
      </section>

      {/* Quests Section */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>⚔️</span> Active Quests
          </h2>
          
          <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-lg border border-slate-800">
            <button 
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${filter === 'all' ? 'bg-surface text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
            >
              All
            </button>
            <button 
              onClick={() => setFilter('active')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${filter === 'active' ? 'bg-surface text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
            >
              Active
            </button>
            <button 
              onClick={() => setFilter('completed')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${filter === 'completed' ? 'bg-surface text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
            >
              Completed
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center p-12">
            <span className="h-8 w-8 animate-spin rounded-full border-4 border-slate-700 border-t-primary"></span>
          </div>
        ) : filteredTasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTasks.map((task) => (
              <TaskCard 
                key={task._id} 
                task={task} 
                onComplete={handleCompleteTask}
                onDelete={deleteTask}
              />
            ))}
          </div>
        ) : (
          <div className="text-center p-12 bg-surface/50 rounded-xl border border-dashed border-slate-700">
            <h3 className="text-lg font-medium text-slate-300">No quests found</h3>
            <p className="text-slate-500 mt-2">Check back later or create a new custom quest!</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
