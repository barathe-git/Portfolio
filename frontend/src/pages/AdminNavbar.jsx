import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, BarChart3, Eye } from 'lucide-react';

/**
 * Admin Navbar - Navigation for admin dashboard
 */
function AdminNavbar() {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  const handleLogout = () => {
    authContext.logout();
    navigate('/');
  };

  return (
    <nav className="bg-white dark:bg-slate-800 shadow-md border-b border-slate-200 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Portfolio Admin
          </h2>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <a
            href="/"
            className="flex items-center gap-2 px-4 py-2 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            title="View Resume"
          >
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline text-sm font-medium">View Resume</span>
          </a>
          <div className="text-sm">
            <p className="text-slate-600 dark:text-slate-400">Logged in as</p>
            <p className="font-semibold text-slate-900 dark:text-white">
              {authContext.user?.username}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default AdminNavbar;
