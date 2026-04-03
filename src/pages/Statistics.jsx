import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { TrendingUp, PieChart as PieIcon, Award } from 'lucide-react';
import useAuthStore from '../store/authStore';

const COLORS = ['#fbbf24', '#f472b6', '#34d399', '#60a5fa', '#a78bfa', '#fb7185'];

const Statistics = () => {
  const { token } = useAuthStore();
  const [stats, setStats] = useState({ daily: [], weekly: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/tasks/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching statistics:', error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchStats();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <span className="h-12 w-12 animate-spin rounded-full border-4 border-amber-100 border-t-primary"></span>
      </div>
    );
  }

  const totalCompletedToday = stats.daily.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="space-y-8 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Quest Analytics 📊</h1>
          <p className="text-slate-500 font-medium">Visualize your journey to a healthier you!</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Daily Breakdown */}
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] border border-amber-100 shadow-2xl shadow-amber-900/5 relative overflow-hidden group">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-accent/5 rounded-full blur-3xl transition-all group-hover:bg-accent/10"></div>
          
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-accent/10 rounded-2xl">
              <PieIcon className="text-accent h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-700">Today's Focus Areas</h2>
          </div>
          
          <div className="h-[320px] w-full">
            {stats.daily.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.daily}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={8}
                    dataKey="value"
                    animationBegin={200}
                    animationDuration={1800}
                  >
                    {stats.daily.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '20px', 
                      border: 'none', 
                      boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
                      padding: '12px 16px',
                      fontWeight: '700'
                    }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <div className="text-6xl mb-4 grayscale opacity-50">🌱</div>
                <p className="font-bold text-lg">No focus data yet</p>
                <p className="text-sm">Complete a quest to see your breakdown!</p>
              </div>
            )}
          </div>
          
          <div className="mt-6 p-5 bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl border border-white shadow-inner text-center">
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Total Quests Done Today</p>
            <p className="text-4xl font-black text-primaryHover tracking-tighter">{totalCompletedToday}</p>
          </div>
        </div>

        {/* Weekly Trend */}
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] border border-amber-100 shadow-2xl shadow-amber-900/5 relative overflow-hidden group">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/5 rounded-full blur-3xl transition-all group-hover:bg-primary/10"></div>

          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-primary/10 rounded-2xl">
              <TrendingUp className="text-primary h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-700">7-Day Progress</h2>
          </div>

          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.weekly} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#fffbeb" />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(251, 191, 36, 0.05)', radius: 12 }}
                  contentStyle={{ 
                    borderRadius: '20px', 
                    border: 'none', 
                    boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
                    padding: '12px 16px',
                    fontWeight: '700'
                  }}
                />
                <Bar 
                  dataKey="completed" 
                  fill="#fbbf24" 
                  radius={[12, 12, 4, 4]} 
                  barSize={32}
                  animationBegin={400}
                  animationDuration={2000}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="p-5 bg-pink-50/50 rounded-3xl border border-pink-100/50 text-center">
              <p className="text-xs font-bold text-pink-400 uppercase tracking-widest mb-1">Best Streak Day</p>
              <p className="text-xl font-black text-pink-500 tracking-tight">
                {stats.weekly.length > 0 ? [...stats.weekly].sort((a, b) => b.completed - a.completed)[0].day : '-'}
              </p>
            </div>
            <div className="p-5 bg-primary/5 rounded-3xl border border-amber-100/50 text-center shadow-inner">
              <p className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-1">Weekly Total</p>
              <p className="text-xl font-black text-primaryHover tracking-tight">
                {stats.weekly.reduce((sum, day) => sum + day.completed, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Motivational Card */}
      <div className="rounded-[2.5rem] border-2 border-white bg-gradient-to-r from-amber-400 to-orange-400 p-8 sm:p-10 shadow-2xl shadow-orange-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/5 rounded-full -ml-32 -mb-32 blur-2xl"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            <div className="h-28 w-28 shrink-0 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center text-6xl shadow-xl border border-white/30 rotate-3">
               🔥
            </div>
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <Award className="h-5 w-5 text-white animate-bounce" />
                <h2 className="text-2xl font-black text-white">Legendary Progress!</h2>
              </div>
              <p className="text-amber-50 font-bold text-lg leading-relaxed max-w-2xl">
                Every quest completed is a step towards a better you. Your consistency this week has been incredible! Keep up this momentum and level up your life.
              </p>
            </div>
          </div>
      </div>
    </div>
  );
};

export default Statistics;
