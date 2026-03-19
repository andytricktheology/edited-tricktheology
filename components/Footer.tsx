
import React from 'react';
import { Link } from 'react-router-dom';
import { BRAND_LOGO_URL } from '../constants';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 overflow-hidden rounded-full border border-slate-200 dark:border-slate-800 shadow-sm bg-slate-100 dark:bg-slate-900">
                <img 
                  src={BRAND_LOGO_URL} 
                  alt="Trick Theology Logo" 
                  className="w-full h-full object-cover scale-110"
                />
              </div>
              <span className="font-orbitron font-bold text-lg tracking-tight">TRICK THEOLOGY</span>
            </Link>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm">
              Inspired to Unseal the ancient Secrets.
            </p>
          </div>
          
          <div>
            <h4 className="font-orbitron font-bold text-sm mb-4 uppercase tracking-widest text-slate-900 dark:text-white">Platforms</h4>
            <ul className="space-y-2 text-slate-500 dark:text-slate-400">
              <li><a href="https://t.ly/ZK3Np?sub_confirmation=1" target="_blank" rel="noopener noreferrer" className="hover:text-brand-start">YouTube</a></li>
              <li><a href="#" className="hover:text-brand-start">Spotify</a></li>
              <li><a href="https://www.teepublic.com/user/tricktheology" target="_blank" rel="noopener noreferrer" className="hover:text-brand-start">TeePublic</a></li>
              <li><a href="https://www.amazon.com/FOLLOW-NAME-wisdom-truth-secrets-ebook/dp/B0FKX2FCP6/ref=sr_1_1?crid=1B9MOZIKXZ20Y&dib=eyJ2IjoiMSJ9.99LdqbkdOJARuaJOgKf8EHpnPzDwc7S7O7wxn4VEWrKDUi1YC8KOcmXrYzQSWRvB.oCZRe9EXapbRs7zgEtZN2zc4aVOLb6V--ugGRsvouv8&dib_tag=se&keywords=Follow+the+NAME%3A+to+Wisdom%2C+Truth%2C+and+Secrets&nsdOptOutParam=true&qid=1769450206&s=books&sprefix=follow+the+name+to+wisdom%2C+truth%2C+and+secrets%2Cstripbooks-intl-ship%2C418&sr=1-1" target="_blank" rel="noopener noreferrer" className="hover:text-brand-start">Amazon</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-orbitron font-bold text-sm mb-4 uppercase tracking-widest text-slate-900 dark:text-white">Social</h4>
            <ul className="space-y-2 text-slate-500 dark:text-slate-400">
              <li><a href="https://tiktok.com/@tricktheology" target="_blank" rel="noopener noreferrer" className="hover:text-brand-start">TikTok</a></li>
              <li><a href="#" className="hover:text-brand-start">Instagram</a></li>
              <li><a href="https://web.facebook.com/ThincologyGH/" target="_blank" rel="noopener noreferrer" className="hover:text-brand-start">Facebook</a></li>
              <li><a href="https://www.pinterest.com/tricktheology" target="_blank" rel="noopener noreferrer" className="hover:text-brand-start">Pinterest</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-400 text-sm">© 2024 Trick Theology. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex space-x-6 text-sm text-slate-400">
            <Link to="/p/privacy-policy" className="hover:text-brand-start transition-colors">Privacy Policy</Link>
            <Link to="/p/terms-of-service" className="hover:text-brand-start transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
