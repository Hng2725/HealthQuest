import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import Button from '../components/common/Button';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
    const { token } = useAuthStore.getState();
    if (token) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8 rounded-3xl border border-amber-100 bg-white p-8 shadow-2xl">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold tracking-tight text-slate-800">
            Welcome back, Hero! ✨
          </h2>
          <p className="mt-2 text-base font-medium text-slate-500">
            Log in to continue your HealthQuest journey
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-lg bg-danger/10 p-3 text-sm text-red-500 border border-danger/20">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-bold text-slate-700 mb-1 block">Email address</label>
              <input
                type="email"
                required
                className="block w-full rounded-2xl border-2 border-amber-100 bg-amber-50 px-4 py-3 text-slate-800 font-medium placeholder-slate-400 shadow-inner focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-bold text-slate-700 mb-1 block">Password</label>
              <input
                type="password"
                required
                className="block w-full rounded-2xl border-2 border-amber-100 bg-amber-50 px-4 py-3 text-slate-800 font-medium placeholder-slate-400 shadow-inner focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            isLoading={isLoading}
          >
            Enter Realm
          </Button>

          <p className="text-center text-sm font-medium text-slate-500">
            New adventurer?{' '}
            <Link to="/register" className="font-extrabold text-primary hover:text-primaryHover transition-colors">
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
