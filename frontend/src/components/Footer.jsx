import React, { useState } from 'react';
import { Heart, Github, Linkedin, Mail, ArrowUp, Download } from 'lucide-react';
import DownloadModal from './DownloadModal';
import { downloadCVAsPDF, downloadPortfolioAsCSV, downloadPortfolioAsJSON } from '../utils/downloadCV';

/**
 * Footer Component - Modern footer with social links
 */
const Footer = ({ profile, experiences, education, skills, projects }) => {
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDownload = (format) => {
    switch (format) {
      case 'html':
        downloadCVAsPDF(profile, experiences, education, skills, projects);
        break;
      case 'csv':
        downloadPortfolioAsCSV(profile, experiences, education, skills, projects);
        break;
      case 'json':
        downloadPortfolioAsJSON(profile, experiences, education, skills, projects);
        break;
      default:
        break;
    }
  };

  return (
    <footer id="contact" className="relative bg-gradient-to-br from-slate-900 to-slate-800 text-white py-12">
      {/* Decorative Top Border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* About Column */}
          <div>
            <h3 className="text-xl font-bold mb-4 gradient-text">Let's Connect</h3>
            <p className="text-slate-400 mb-4">
              Feel free to reach out for collaborations, opportunities, or just a friendly chat about technology.
            </p>
            <button
              onClick={() => setShowDownloadModal(true)}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center gap-2"
            >
              <Download size={18} />
              Download Resume
            </button>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {['Home', 'About', 'Projects', 'Experience'].map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase()}`}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Follow Me</h3>
            <div className="flex gap-4">
              <a
                href="https://github.com/barathe-git"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <Github size={20} />
              </a>
              <a
                href="https://www.linkedin.com/in/barath-e"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="mailto:barath.contact@gmail.com"
                className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-700 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 flex items-center gap-2">
            Made with <Heart className="text-red-500 fill-red-500" size={16} /> using React & Spring Boot
          </p>
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} All rights reserved
          </p>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 z-40"
        aria-label="Scroll to top"
      >
        <ArrowUp className="text-white" size={24} />
      </button>

      {/* Download Modal */}
      <DownloadModal
        isOpen={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
        onDownload={handleDownload}
      />
    </footer>
  );
};

export default Footer;
