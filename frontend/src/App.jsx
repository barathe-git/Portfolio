import { useState, useEffect } from 'react';
import AOS from 'aos';
import { AlertTriangle, LoaderCircle, RefreshCw } from 'lucide-react';
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
      duration: 650,
      once: true,
      easing: 'ease-out-cubic',
      offset: 40,
      disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
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
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-5">
        <div className="text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-blue-700 text-white shadow-xl shadow-blue-700/20"><LoaderCircle className="animate-spin" size={28} aria-hidden="true" /></span>
          <p className="mt-6 font-heading text-xl font-semibold text-slate-950">Loading portfolio</p>
          <p className="mt-2 text-sm text-slate-500">Preparing selected work and experience.</p>
        </div>
      </div>
    );
  }

  // Error Screen
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-5">
        <div className="surface-card w-full max-w-md p-8 text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-red-50 text-red-700"><AlertTriangle size={28} aria-hidden="true" /></span>
          <h2 className="mt-6 text-2xl font-semibold text-slate-950">Unable to load the portfolio</h2>
          <p className="mt-3 leading-7 text-slate-600">{error}</p>
          <button type="button" onClick={() => window.location.reload()} className="button-primary mt-7 w-full"><RefreshCw size={18} aria-hidden="true" />Try again</button>
        </div>
      </div>
    );
  }

  // Main Portfolio
  return (
    <div className="min-h-screen bg-slate-50">
      <a href="#main-content" className="sr-only fixed left-4 top-4 z-[100] rounded-lg bg-white px-4 py-3 font-semibold text-blue-700 focus:not-sr-only">Skip to main content</a>
      <Navbar />
      <main id="main-content">
        <Hero profile={profile} experiences={experiences} education={education} skills={skills} projects={projects} />
        <About profile={profile} />
        <Skills skills={skills} />
        <Projects projects={projects} />
        <Experience experiences={experiences} />
        <Education education={education} />
      </main>
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
