import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { useTheme } from '../../context/ThemeContext';
import { Building2, ShieldCheck, ArrowRight, Lock, Mail, Sun, Moon } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, usersList } = useAuth();
  const { addNotification } = useNotification();
  const { theme, toggleTheme } = useTheme();
  
  const [selectedUserId, setSelectedUserId] = useState(usersList[0]?.id || 'u-1');
  const [email, setEmail] = useState('a.chen@hzhy-enterprise.com');
  const [password, setPassword] = useState('••••••••••••');

  const handleQuickSelect = (userId: string, userEmail: string) => {
    setSelectedUserId(userId);
    setEmail(userEmail);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(selectedUserId);
    if (success) {
      addNotification('Welcome Back', 'Logged into HZHY Enterprise ERP successfully.', 'success');
    } else {
      addNotification('Login Error', 'Invalid credentials or user account suspended.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar */}
      <header className="p-6 flex items-center justify-between z-10 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 font-bold text-xl">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-base font-extrabold tracking-tight text-white">HZHY ENTERPRISE</h1>
            <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Industrial ERP System</p>
          </div>
        </div>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>
      </header>

      {/* Main Login Card Container */}
      <main className="flex-1 flex items-center justify-center p-4 z-10 my-8">
        <div className="w-full max-w-4xl bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Form Column */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <ShieldCheck className="w-3.5 h-3.5" /> Secure RBAC Authentication
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-3 tracking-tight">
                Enterprise Portal Login
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Access Sales, Finance, Store, Purchasing, and Admin management modules.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Enterprise Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                Sign In to Enterprise Workspace
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Right Demo Account Switcher Column */}
          <div className="lg:col-span-5 border-t lg:border-t-0 lg:border-l border-slate-800 pt-6 lg:pt-0 lg:pl-8 space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Demo Quick Persona Switch
            </p>
            <p className="text-[11px] text-slate-500">
              Click any department persona to inspect module permissions:
            </p>

            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {usersList.map(user => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => handleQuickSelect(user.id, user.email)}
                  className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center gap-3 ${
                    selectedUserId === user.id
                      ? 'bg-blue-600/10 border-blue-500 text-white shadow-xs'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-700 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold truncate text-white">{user.name}</p>
                    <p className="text-[10px] text-blue-400 font-medium truncate">{user.role}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-xs text-slate-600 z-10">
        © 2026 HZHY Enterprise Ltd. All Rights Reserved. API Ready Laravel Core Integration.
      </footer>
    </div>
  );
};
