import { useState, useEffect } from 'react';
import AOS from 'aos';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Education from './components/Education';
import Footer from './components/Footer';
import { portfolioAPI } from './api/api';

/**
 * Main App Component
 * Fetches and manages all portfolio data, distributing it to child components
 */
function App() {
  // State management for portfolio data
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Initialize AOS animation library
   */
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-out',
    });
  }, []);

  /**
   * Fetch all portfolio data on component mount
   * Uses Promise.all for parallel API calls to improve performance
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all data in parallel for better performance
        const [profileRes, skillsRes, projectsRes, experiencesRes, educationRes] = 
          await Promise.all([
            portfolioAPI.getProfile(),
            portfolioAPI.getSkills(),
            portfolioAPI.getProjects(),
            portfolioAPI.getExperience(),
            portfolioAPI.getEducation(),
          ]);

        // Update state with fetched data
        setProfile(profileRes.data);
        setSkills(skillsRes.data);
        setProjects(projectsRes.data);
        setExperiences(experiencesRes.data);
        setEducation(educationRes.data);
      } catch (err) {
        console.error('Error fetching portfolio data:', err);
        setError('Failed to load portfolio data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Modern Loading Screen
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
        <div className="text-center">
          <div className="relative">
            {/* Animated Spinner */}
            <div className="w-24 h-24 border-8 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-white rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="mt-8 text-2xl font-bold text-white animate-pulse">
            Loading Portfolio...
          </p>
          <p className="mt-2 text-white/80">
            Please wait while we fetch your data
          </p>
        </div>
      </div>
    );
  }

  // Error Screen
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
        <div className="glass-card max-w-md w-full p-8 text-center">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Oops! Something went wrong
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn-modern w-full"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Main Portfolio
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero 
        profile={profile} 
        experiences={experiences}
        education={education}
        skills={skills}
        projects={projects}
      />
      <About profile={profile} />
      <Skills skills={skills} />
      <Projects projects={projects} />
      <Experience experiences={experiences} />
      <Education education={education} />
      <Footer 
        profile={profile}
        experiences={experiences}
        education={education}
        skills={skills}
        projects={projects}
      />
    </div>
  );
}

export default App;
