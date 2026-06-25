import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Mail, Phone, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';
const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-gradient-to-br from-violet-950 via-purple-900 to-indigo-950 text-purple-50 border-t border-purple-800/40 relative overflow-hidden">
      {/* Subtle top glow effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent pointer-events-none"></div>

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Sparkles className="w-5 h-5 text-indigo-950" />
              </div>
              <span className="text-xl font-bold tracking-wide text-white">Divya Jyotish Guru</span>
            </div>
            <p className="text-sm leading-relaxed text-purple-200">
              Guiding souls through ancient wisdom and spiritual practices. Transform your life with astrology, meditation, reiki, and tarot.
            </p>
          </div>

          <div>
            <span className="text-sm font-semibold tracking-wider text-amber-400 uppercase mb-4 block">Quick Links</span>
            <ul className="space-y-2.5">
              <li>
                <Link to="/astrology" className="text-sm text-purple-200 hover:text-amber-400 transition-colors duration-200">
                  Astrology Courses
                </Link>
              </li>
              <li>
                <Link to="/meditation" className="text-sm text-purple-200 hover:text-amber-400 transition-colors duration-200">
                  Meditation Programs
                </Link>
              </li>
              <li>
                <Link to="/reiki" className="text-sm text-purple-200 hover:text-amber-400 transition-colors duration-200">
                  Reiki Healing
                </Link>
              </li>
              <li>
                <Link to="/tarot" className="text-sm text-purple-200 hover:text-amber-400 transition-colors duration-200">
                  Tarot Reading
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-sm text-purple-200 hover:text-amber-400 transition-colors duration-200">
                  Blog & Insights
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <span className="text-sm font-semibold tracking-wider text-amber-400 uppercase mb-4 block">Contact</span>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-purple-200">
                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-400" />
                <span>jyotiishgyaan@gmail.com</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-purple-200">
                <Phone className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-400" />
                <span>+91 9212656634</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-purple-200">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-400" />
                <span>Greater Noida, New Delhi</span>
              </li>
            </ul>
          </div>

          <div>
            <span className="text-sm font-semibold tracking-wider text-amber-400 uppercase mb-4 block">Follow</span>
            <div className="flex gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-white/5 hover:bg-amber-400 text-purple-200 hover:text-indigo-950 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-white/5 hover:bg-amber-400 text-purple-200 hover:text-indigo-950 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-white/5 hover:bg-amber-400 text-purple-200 hover:text-indigo-950 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg" aria-label="YouTube">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-purple-800/40">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-purple-300/80">
              {currentYear} Divya Khaneja. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link to="/privacy" className="text-sm text-purple-300/80 hover:text-amber-400 transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-sm text-purple-300/80 hover:text-amber-400 transition-colors duration-200">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;