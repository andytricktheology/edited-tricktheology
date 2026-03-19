
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BRAND_LOGO_URL, MASTER_RESET_SEED, DEFAULT_ADMIN } from '../../constants';
import { useData } from '../../context/DataContext';

const Login: React.FC = () => {
  const { adminConfig, updateAdmin, login } = useData();
  const [view, setView] = useState<'selection' | 'syncing' | 'reset'>('selection');
  const [error, setError] = useState("");
  const [lockoutTimeLeft, setLockoutTimeLeft] = useState(0);
  const [resetSeed, setResetSeed] = useState("");
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const navigate = useNavigate();

  const authorizedEmail = adminConfig?.email || DEFAULT_ADMIN.email;

  const identityNodes = [
    { email: authorizedEmail, name: "Authorized Admin", status: "VERIFIED" },
    { email: "guest.user@gmail.com", name: "Guest Identity", status: "LOCKED" },
    { email: "external.node@gmail.com", name: "External Node", status: "LOCKED" }
  ];

  useEffect(() => {
    const checkLockout = () => {
      const lockoutUntil = localStorage.getItem('tt_lockout_until');
      if (lockoutUntil) {
        const remaining = Math.ceil((parseInt(lockoutUntil) - Date.now()) / 1000);
        if (remaining > 0) {
          setLockoutTimeLeft(remaining);
        } else {
          setLockoutTimeLeft(0);
        }
      }
    };

    checkLockout();
    const timer = setInterval(checkLockout, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleNodeSelection = (email: string) => {
    if (lockoutTimeLeft > 0) return;
    
    setSelectedNode(email);
    
    if (email === authorizedEmail) {
      setView('syncing');
      setTimeout(() => {
        localStorage.removeItem('tt_failed_attempts');
        localStorage.removeItem('tt_lockout_until');
        login(); // Trigger global auth state
        navigate("/admin/dashboard");
      }, 2500);
    } else {
      const currentAttempts = parseInt(localStorage.getItem('tt_failed_attempts') || "0") + 1;
      localStorage.setItem('tt_failed_attempts', currentAttempts.toString());

      if (currentAttempts >= 3) {
        const penalty = 300;
        const lockoutUntil = Date.now() + (penalty * 1000);
        localStorage.setItem('tt_lockout_until', lockoutUntil.toString());
        setLockoutTimeLeft(penalty);
        setError(`CRITICAL: Unauthorized node access. Terminal locked for ${penalty}s.`);
      } else {
        setError(`ACCESS DENIED: Identity mismatch. Node signature invalid.`);
        setTimeout(() => setError(""), 3000);
      }
    }
  };

  const handleMasterReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (resetSeed.trim() === MASTER_RESET_SEED) {
      updateAdmin(DEFAULT_ADMIN);
      localStorage.removeItem('tt_failed_attempts');
      localStorage.removeItem('tt_lockout_until');
      setLockoutTimeLeft(0);
      setError("RECOVERY SUCCESSFUL: Identity nodes recalibrated.");
      setView('selection');
    } else {
      setError("RECOVERY FAILED: Master Seed rejected.");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 font-exo overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="h-full w-full" style={{ backgroundImage: 'radial-gradient(#c900ff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      </div>

      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-[48px] p-8 md:p-16 shadow-2xl relative overflow-hidden backdrop-blur-3xl">
        <div className="absolute top-0 left-0 w-full h-1 gradient-bg shadow-[0_0_20px_rgba(201,0,255,0.5)]"></div>
        
        {view === 'selection' && (
          <div className="animate-wipe-in">
            <div className="text-center mb-12">
              <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-6 border-2 border-brand-start shadow-xl shadow-brand-start/40 bg-slate-950 flex items-center justify-center p-2">
                <img src={BRAND_LOGO_URL} alt="Logo" className="w-full h-full object-contain" />
              </div>
              <h1 className="font-orbitron font-black text-2xl text-white tracking-[0.2em] uppercase">Identity Nodes</h1>
              <p className="text-slate-500 text-[10px] mt-2 uppercase tracking-[0.4em] font-bold">Authorized Gmail Detection Active</p>
            </div>

            {error && (
              <div className="mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-500 text-[10px] font-black uppercase text-center tracking-widest animate-pulse">
                {error}
              </div>
            )}

            <div className="space-y-4">
              {identityNodes.map((node) => (
                <button
                  key={node.email}
                  disabled={lockoutTimeLeft > 0}
                  onClick={() => handleNodeSelection(node.email)}
                  className={`w-full group relative flex items-center gap-6 p-6 rounded-3xl border transition-all duration-500 text-left ${
                    node.status === 'VERIFIED' 
                      ? 'bg-brand-start/5 border-brand-start/20 hover:border-brand-start hover:bg-brand-start/10 hover:shadow-[0_0_30px_rgba(201,0,255,0.15)]' 
                      : 'bg-slate-950/50 border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center font-orbitron font-bold text-lg border-2 transition-all ${
                    node.status === 'VERIFIED' ? 'border-brand-start bg-brand-start/20 text-white' : 'border-slate-800 bg-slate-900 text-slate-600'
                  }`}>
                    {node.email[0].toUpperCase()}
                  </div>
                  <div className="flex-grow">
                    <p className={`font-orbitron font-bold text-xs tracking-widest uppercase ${node.status === 'VERIFIED' ? 'text-white' : 'text-slate-500'}`}>
                      {node.name}
                    </p>
                    <p className="text-[10px] text-slate-500 font-medium lowercase opacity-70">{node.email}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`text-[8px] font-black tracking-widest px-2 py-1 rounded border uppercase ${
                      node.status === 'VERIFIED' ? 'text-brand-start border-brand-start/30' : 'text-slate-700 border-slate-800'
                    }`}>
                      {node.status}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {lockoutTimeLeft > 0 && (
              <div className="mt-8 p-6 bg-red-500/5 border border-red-500/20 rounded-3xl text-center">
                <p className="text-[10px] font-orbitron font-bold text-red-500 uppercase tracking-widest mb-2">Terminal Lockout in Progress</p>
                <p className="text-3xl font-orbitron font-black text-red-400">{formatTime(lockoutTimeLeft)}</p>
              </div>
            )}

            <div className="mt-12 text-center">
              <button 
                onClick={() => setView('reset')}
                className="text-[9px] font-orbitron font-bold text-slate-600 hover:text-brand-start uppercase tracking-widest transition-colors"
              >
                Frequency Drift Detected? Access Recovery
              </button>
            </div>
          </div>
        )}

        {view === 'syncing' && (
          <div className="flex flex-col items-center justify-center py-20 animate-wipe-in">
            <div className="relative mb-12">
              <div className="w-32 h-32 rounded-full border-4 border-slate-800 border-t-brand-start animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center font-orbitron font-black text-brand-start text-xl animate-pulse">
                SYNC
              </div>
            </div>
            <h2 className="font-orbitron font-black text-xl text-white uppercase tracking-[0.3em] mb-4">Neural Link Active</h2>
            <div className="w-64 h-1 bg-slate-800 rounded-full overflow-hidden mb-6">
              <div className="h-full gradient-bg animate-[wipe_2.5s_linear_forwards]"></div>
            </div>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest animate-pulse">
              Authenticating Node: {selectedNode}
            </p>
          </div>
        )}

        {view === 'reset' && (
          <div className="animate-wipe-in">
            <div className="text-center mb-10">
              <h2 className="font-orbitron font-bold text-2xl text-white tracking-widest uppercase">Master Recovery</h2>
              <p className="text-slate-500 text-[10px] mt-2 uppercase tracking-widest font-bold">Emergency Restoration protocol</p>
            </div>
            
            {/* Fix: use the correct onSubmit prop instead of handleMasterReset */}
            <form onSubmit={handleMasterReset} className="space-y-6">
              <div className="group">
                <label className="block text-[10px] font-orbitron font-bold text-slate-500 group-focus-within:text-brand-start mb-2 uppercase tracking-[0.3em] transition-colors">Master Recovery Seed</label>
                <input 
                  type="password" 
                  autoFocus
                  value={resetSeed}
                  onChange={(e) => setResetSeed(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-brand-start outline-none transition-all" 
                  placeholder="ENTER RECOVERY NODE KEY"
                  required
                />
              </div>

              <div className="flex flex-col gap-4">
                <button type="submit" className="w-full py-5 gradient-bg text-white rounded-2xl font-orbitron font-bold hover:shadow-2xl hover:shadow-brand-start/40 uppercase tracking-widest">
                  EXECUTE RECOVERY
                </button>
                <button 
                  type="button" 
                  onClick={() => setView('selection')}
                  className="w-full py-3 bg-slate-800 text-slate-400 rounded-xl font-orbitron font-bold text-[10px] hover:text-white uppercase tracking-widest"
                >
                  ABORT RECOVERY
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
