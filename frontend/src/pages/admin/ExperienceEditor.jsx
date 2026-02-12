import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import ExperienceForm from '../../components/forms/ExperienceForm';
import { Edit2, Trash2, Plus } from 'lucide-react';
import { API_CONFIG } from '../../constants';

/**
 * ExperienceEditor - Admin page for managing experiences
 */
function ExperienceEditor() {
  const authContext = useContext(AuthContext);
  const [experiences, setExperiences] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingExperience, setEditingExperience] = useState(null);

  useEffect(() => {
    fetchExperiences();
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/projects`, {
        headers: { 'Authorization': `Bearer ${authContext.token}` }
      });
      if (response.ok) {
        const result = await response.json();
        const data = result.status === 'success' ? result.data : result;
        setProjects(data);
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
    }
  };

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_CONFIG.BASE_URL}/experience`, {
        headers: { 'Authorization': `Bearer ${authContext.token}` }
      });
      if (response.ok) {
        const result = await response.json();
        const data = result.status === 'success' ? result.data : result;
        setExperiences(data);
      } else {
        const result = await response.json();
        setError(result.message || 'Failed to load experiences');
      }
    } catch (err) {
      console.error('Error fetching experiences:', err);
      setError('Error loading experiences');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_CONFIG.BASE_URL}/experience`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authContext.token}`
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (response.ok && result.status === 'success') {
        setExperiences([...experiences, result.data]);
        setSuccess(result.message || 'Experience added successfully!');
        setShowForm(false);
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(result.message || 'Failed to add experience');
      }
    } catch (err) {
      console.error('Error adding experience:', err);
      setError('Error adding experience');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/experience/${editingId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authContext.token}`
          },
          body: JSON.stringify(formData),
        }
      );
      const result = await response.json();
      if (response.ok && result.status === 'success') {
        setExperiences(experiences.map(e => e.id === editingId ? result.data : e));
        setSuccess(result.message || 'Experience updated successfully!');
        setEditingId(null);
        setEditingExperience(null);
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(result.message || 'Failed to update experience');
      }
    } catch (err) {
      console.error('Error updating experience:', err);
      setError('Error updating experience');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this experience?')) return;
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/experience/${id}`,
        {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${authContext.token}` }
        }
      );
      if (response.ok) {
        const result = await response.json();
        setExperiences(experiences.filter(e => e.id !== id));
        setSuccess(result.message || 'Experience deleted successfully!');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        const result = await response.json();
        setError(result.message || 'Failed to delete experience');
      }
    } catch (err) {
      console.error('Error deleting experience:', err);
      setError('Error deleting experience');
    } finally {
      setLoading(false);
    }
  };

  if (loading && experiences.length === 0) {
    return <div className="text-center text-slate-500">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          {editingId ? 'Edit Experience' : showForm ? 'Add Experience' : 'Experience'}
        </h2>
        {!showForm && !editingId && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
          >
            <Plus className="w-4 h-4" />
            Add Experience
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg border border-red-200 dark:border-red-800">
          <p className="text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}
      {success && (
        <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg border border-green-200 dark:border-green-800">
          <p className="text-green-700 dark:text-green-400">{success}</p>
        </div>
      )}

      {showForm && (
        <div className="bg-slate-50 dark:bg-slate-700/50 p-6 rounded-lg border border-slate-200 dark:border-slate-600">
          <ExperienceForm
            onSubmit={handleAdd}
            onCancel={() => setShowForm(false)}
            isLoading={loading}
            availableProjects={projects}
          />
        </div>
      )}

      {editingId && editingExperience && (
        <div className="bg-slate-50 dark:bg-slate-700/50 p-6 rounded-lg border border-slate-200 dark:border-slate-600">
          <ExperienceForm
            initialData={editingExperience}
            onSubmit={handleEdit}
            onCancel={() => { setEditingId(null); setEditingExperience(null); }}
            isLoading={loading}
            availableProjects={projects}
          />
        </div>
      )}

      {!showForm && !editingId && (
        <div className="space-y-4">
          {experiences.length === 0 ? (
            <p className="text-slate-500 italic">No experiences yet</p>
          ) : (
            experiences.map(exp => (
              <div
                key={exp.id}
                className="bg-slate-50 dark:bg-slate-700/50 p-6 rounded-lg border border-slate-200 dark:border-slate-600 flex justify-between items-start"
              >
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {exp.role} | {exp.company}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                    {exp.duration}
                  </p>
                  {exp.description && (
                    <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">
                      {exp.description}
                    </p>
                  )}
                  {exp.projects && exp.projects.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Projects:</p>
                      <div className="flex flex-wrap gap-1">
                        {exp.projects.map(p => (
                          <span key={p.id} className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded">
                            {p.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => {
                      setEditingId(exp.id);
                      setEditingExperience(exp);
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(exp.id)}
                    className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default ExperienceEditor;
