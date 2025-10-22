import React, { useEffect, useState } from 'react';
import { Github, Linkedin, Mail, MapPin, Phone, Download, ArrowRight } from 'lucide-react';
import AOS from 'aos';
import DownloadModal from './DownloadModal';
import { downloadCVAsPDF, downloadPortfolioAsCSV, downloadPortfolioAsJSON } from '../utils/downloadCV';

/**
 * Hero Component - Modern, eye-catching landing section
 * Designed to impress HR and recruiters
 */
const Hero = ({ profile, experiences, education, skills, projects }) => {
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

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

  if (!profile) return null;

  return (
    <section id="home" className="min-h-screen flex items-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 animate-gradient-x"></div>
      
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      {/* Content */}
      <div className="section-container relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            
            {/* Left Column - Text Content */}
            <div className="text-white space-y-6" data-aos="fade-right">
              <div className="inline-block">
                <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium border border-white/30">
                  👋 Welcome to my portfolio
                </span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                Hi, I'm{' '}
                <span className="text-shadow inline-block animate-float">
                  {profile.name}
                </span>
              </h1>
              
              <h2 className="text-2xl md:text-3xl font-medium text-blue-100">
                {profile.title}
              </h2>
              
              <p className="text-lg text-blue-50 leading-relaxed max-w-xl">
                {profile.summary?.substring(0, 150)}...
              </p>
              
              {/* Contact Info */}
              <div className="flex flex-wrap gap-4 text-sm text-blue-100">
                {profile.location && (
                  <div className="flex items-center gap-2">
                    <MapPin size={18} />
                    <span>{profile.location}</span>
                  </div>
                )}
                {profile.email && (
                  <div className="flex items-center gap-2">
                    <Mail size={18} />
                    <span>{profile.email}</span>
                  </div>
                )}
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-4">
                <a href="#projects" className="btn-modern group">
                  View My Work
                  <ArrowRight className="inline-block ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                </a>
                <button 
                  onClick={() => setShowDownloadModal(true)}
                  className="px-8 py-3 rounded-full font-semibold bg-white/10 backdrop-blur-sm border border-white/30 text-white hover:bg-white/20 transition-all duration-300 flex items-center gap-2"
                >
                  <Download size={20} />
                  Download CV
                </button>
              </div>
              
              {/* Social Links */}
              <div className="flex gap-4 pt-4">
                {profile.github && (
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-icon"
                  >
                    <Github size={24} />
                  </a>
                )}
                {profile.linkedin && (
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-icon"
                  >
                    <Linkedin size={24} />
                  </a>
                )}
                {profile.email && (
                  <a
                    href={`mailto:${profile.email}`}
                    className="social-icon"
                  >
                    <Mail size={24} />
                  </a>
                )}
              </div>
            </div>
            
            {/* Right Column - Profile Image */}
            <div className="flex justify-center" data-aos="fade-left">
              <div className="relative">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full blur-2xl opacity-50 animate-pulse"></div>
                
                {/* Profile Image */}
                <img 
                  src="/profile.jpg" 
                  alt={profile.name} 
                  className="relative w-64 h-64 md:w-80 md:h-80 rounded-full object-cover border-8 border-white/30 shadow-2xl animate-float"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                
                {/* Fallback Avatar */}
                <div className="hidden relative w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 items-center justify-center text-white text-8xl font-bold border-8 border-white/30 shadow-2xl animate-float">
                  {profile.name?.charAt(0)}
                </div>
                
                {/* Floating Badges */}
                <div className="absolute -top-4 -right-4 px-4 py-2 bg-white rounded-full shadow-lg animate-bounce">
                  <span className="text-2xl">💼</span>
                </div>
                <div className="absolute -bottom-4 -left-4 px-4 py-2 bg-white rounded-full shadow-lg animate-bounce delay-300">
                  <span className="text-2xl">🚀</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
          <div className="w-1 h-3 bg-white rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Download Modal */}
      <DownloadModal
        isOpen={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
        onDownload={handleDownload}
      />
    </section>
  );
};

export default Hero;
