import { useState } from 'react';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import AdminNavbar from './AdminNavbar';
import ProfileEditor from './admin/ProfileEditor';
import ProjectsEditor from './admin/ProjectsEditor';
import ExperienceEditor from './admin/ExperienceEditor';
import EducationEditor from './admin/EducationEditor';
import SkillsEditor from './admin/SkillsEditor';

/**
 * Admin Dashboard - Main layout for admin panel
 */
function AdminDashboard() {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('profile');

  // Redirect handled by ProtectedRoute, but as fallback go to main page
  if (!authContext?.isAuthenticated && !localStorage.getItem('auth_token')) {
    navigate('/');
    return null;
  }

  // Tab configuration
  const tabs = [
    { id: 'profile', label: 'Profile', component: ProfileEditor },
    { id: 'projects', label: 'Projects', component: ProjectsEditor },
    { id: 'experience', label: 'Experience', component: ExperienceEditor },
    { id: 'education', label: 'Education', component: EducationEditor },
    { id: 'skills', label: 'Skills', component: SkillsEditor },
  ];

  const activeTabConfig = tabs.find(t => t.id === activeTab);
  const ActiveComponent = activeTabConfig?.component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <AdminNavbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Welcome back, <span className="font-semibold">{authContext.user?.username}</span>!
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex gap-2 overflow-x-auto pb-2 border-b border-slate-300 dark:border-slate-700">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 font-medium whitespace-nowrap rounded-t-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8">
          {ActiveComponent && <ActiveComponent />}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
