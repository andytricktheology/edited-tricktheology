
import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';

const Connect: React.FC = () => {
  const { showToast } = useToast();
  const [activeForm, setActiveForm] = useState<'enquiry' | 'booking'>('enquiry');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const type = activeForm === 'enquiry' ? 'Enquiry' : 'Booking';
    showToast(`${type} broadcasted successfully. We will decrypt your signal shortly.`, "success");
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <header className="mb-16 text-center">
        <h1 className="font-orbitron font-black text-5xl mb-4 wipe-text inline-block">CONNECT</h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          Reach out for general enquiries or book a session for speaking, interviews, or consultations.
        </p>
      </header>

      <div className="flex justify-center mb-12">
        <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl">
          <button
            onClick={() => setActiveForm('enquiry')}
            className={`px-6 py-3 rounded-xl font-orbitron font-bold transition-all ${
              activeForm === 'enquiry' 
              ? 'gradient-bg text-white shadow-lg' 
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
            }`}
          >
            GENERAL ENQUIRIES
          </button>
          <button
            onClick={() => setActiveForm('booking')}
            className={`px-6 py-3 rounded-xl font-orbitron font-bold transition-all ${
              activeForm === 'booking' 
              ? 'gradient-bg text-white shadow-lg' 
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
            }`}
          >
            BOOKING FORM
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[40px] p-8 md:p-12 shadow-2xl">
        {activeForm === 'enquiry' ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-orbitron font-bold text-brand-start mb-2 uppercase tracking-widest">Full Name</label>
                <input type="text" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-start outline-none" placeholder="John Doe" required />
              </div>
              <div>
                <label className="block text-xs font-orbitron font-bold text-brand-start mb-2 uppercase tracking-widest">Email Address</label>
                <input type="email" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-start outline-none" placeholder="john@example.com" required />
              </div>
            </div>
            <div>
              <label className="block text-xs font-orbitron font-bold text-brand-start mb-2 uppercase tracking-widest">Subject</label>
              <input type="text" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-start outline-none" placeholder="How can we help?" required />
            </div>
            <div>
              <label className="block text-xs font-orbitron font-bold text-brand-start mb-2 uppercase tracking-widest">Message</label>
              <textarea rows={5} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-start outline-none resize-none" placeholder="Write your message here..." required></textarea>
            </div>
            <button type="submit" className="w-full py-4 gradient-bg text-white font-orbitron font-bold rounded-xl hover:scale-[1.02] transition-transform">
              SEND MESSAGE
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-orbitron font-bold text-brand-start mb-2 uppercase tracking-widest">Company / Org</label>
                <input type="text" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-start outline-none" placeholder="Organization Name" required />
              </div>
              <div>
                <label className="block text-xs font-orbitron font-bold text-brand-start mb-2 uppercase tracking-widest">Booking Type</label>
                <select className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-start outline-none">
                  <option>Interviews</option>
                  <option>Public Speaking</option>
                  <option>One-on-One Session</option>
                  <option>Media Engagement</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-orbitron font-bold text-brand-start mb-2 uppercase tracking-widest">Proposed Date</label>
                <input type="date" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-start outline-none" required />
              </div>
              <div>
                <label className="block text-xs font-orbitron font-bold text-brand-start mb-2 uppercase tracking-widest">Email</label>
                <input type="email" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-start outline-none" placeholder="contact@org.com" required />
              </div>
            </div>
            <div>
              <label className="block text-xs font-orbitron font-bold text-brand-start mb-2 uppercase tracking-widest">Requirements / Details</label>
              <textarea rows={5} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-start outline-none resize-none" placeholder="Describe the engagement details..." required></textarea>
            </div>
            <button type="submit" className="w-full py-4 gradient-bg text-white font-orbitron font-bold rounded-xl hover:scale-[1.02] transition-transform">
              REQUEST BOOKING
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Connect;
