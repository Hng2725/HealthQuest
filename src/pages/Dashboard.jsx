import React, { useEffect, useState } from 'react';
import useAuthStore from '../store/authStore';
import useTaskStore from '../store/taskStore';
import TaskCard from '../components/common/TaskCard';
import ProgressBar from '../components/common/ProgressBar';
import Button from '../components/common/Button';
import AddTaskModal from '../components/common/AddTaskModal';
import RewardModal from '../components/common/RewardModal';
import { Plus } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuthStore();
  const { tasks, fetchTasks, createTask, completeTask, deleteTask, isLoading } = useTaskStore();
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'completed'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);
  const [currentRewards, setCurrentRewards] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCompleteTask = async (taskId) => {
    try {
      const result = await completeTask(taskId);
      const rewards = result.rewards;
      
      if (rewards) {
        setCurrentRewards({
          ...rewards,
          oldLevel: user?.level
        });
        setIsRewardModalOpen(true);
      }
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || 'Lỗi khi hoàn thành nhiệm vụ';
      // Fallback for errors
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
    <div className="space-y-8 max-w-5xl mx-auto rounded-3xl p-5 bg-white/50 backdrop-blur-sm shadow-sm border border-amber-50"> 
      {/* Dashboard container */}
      
      {/* Welcome Banner & Stats */}
      <section className="rounded-3xl border border-amber-100 bg-white p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full border-4 border-white shadow-[0_0_15px_rgba(251,191,36,0.5)] bg-amber-50 flex items-center justify-center">
              {user?.avatar ? (
                <img src={user.avatar} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                <span className="text-2xl">👤</span>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-800">Welcome back, {user?.username}! 🌟</h1>
              <p className="text-slate-500 mt-1 font-medium">Ready to conquer your daily quests?</p>
            </div>
          </div>
          
          <div className="w-full md:w-64 space-y-2 bg-amber-50/50 p-4 rounded-2xl border border-amber-100">
            <div className="flex justify-between text-sm font-bold">
              <span className="text-primaryHover">Level {user?.level}</span>
              <span className="text-slate-500">{user?.exp} / {expNeeded} EXP</span>
            </div>
            <ProgressBar progress={progressPercent} colorClass="bg-accent" />
          </div>
        </div>
      </section>

      {/* Quests Section */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <span>✨</span> Active Quests
          </h2>
          
          <div className="flex flex-wrap items-center gap-2">
            <Button 
              onClick={() => setIsModalOpen(true)}
              className="rounded-2xl shadow-md bg-accent hover:bg-pink-500 border-none text-white h-10 px-4"
            >
              <Plus className="h-5 w-5 mr-1" />
              Add Task
            </Button>
            
            <div className="flex items-center gap-2 bg-amber-50 p-1.5 rounded-2xl border border-amber-100 shadow-inner">
            <button 
              onClick={() => setFilter('all')}
              className={`px-4 py-2 text-sm font-bold rounded-xl transition-all ${filter === 'all' ? 'bg-white text-primaryHover shadow-md' : 'text-slate-500 hover:text-primary hover:bg-white/50'}`}
            >
              All
            </button>
            <button 
              onClick={() => setFilter('active')}
              className={`px-4 py-2 text-sm font-bold rounded-xl transition-all ${filter === 'active' ? 'bg-white text-primaryHover shadow-md' : 'text-slate-500 hover:text-primary hover:bg-white/50'}`}
            >
              Active
            </button>
            <button 
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 text-sm font-bold rounded-xl transition-all ${filter === 'completed' ? 'bg-white text-primaryHover shadow-md' : 'text-slate-500 hover:text-primary hover:bg-white/50'}`}
            >
              Completed
            </button>
          </div>
        </div>
      </div>

        {isLoading ? (
          <div className="flex justify-center p-12">
            <span className="h-10 w-10 animate-spin rounded-full border-4 border-amber-100 border-t-primary"></span>
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
          <div className="text-center p-16 bg-white/80 rounded-3xl border-2 border-dashed border-amber-200 shadow-sm">
            <div className="text-4xl mb-4">🌱</div>
            <h3 className="text-xl font-bold text-slate-700">No quests found</h3>
            <p className="text-slate-500 mt-2 font-medium">Check back later or create a new custom quest!</p>
          </div>
        )}
      </section>

      <AddTaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={createTask} 
      />

      <RewardModal 
        isOpen={isRewardModalOpen} 
        onClose={() => setIsRewardModalOpen(false)} 
        rewards={currentRewards} 
      />
    </div>
  );
};

export default Dashboard;
