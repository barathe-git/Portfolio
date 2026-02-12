import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import ProjectForm from '../../components/forms/ProjectForm';
import { Edit2, Trash2, Plus } from 'lucide-react';
import { API_CONFIG } from '../../constants';

/**
 * ProjectsEditor - Admin page for managing projects
 */
function ProjectsEditor() {
  const authContext = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingProject, setEditingProject] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_CONFIG.BASE_URL}/projects`, {
        headers: { 'Authorization': `Bearer ${authContext.token}` }
      });
      if (response.ok) {
        const result = await response.json();
        const data = result.status === 'success' ? result.data : result;
        setProjects(data);
      } else {
        const result = await response.json();
        setError(result.message || 'Failed to load projects');
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Error loading projects');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_CONFIG.BASE_URL}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authContext.token}`
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (response.ok && result.status === 'success') {
        setProjects([...projects, result.data]);
        setSuccess(result.message || 'Project added successfully!');
        setShowForm(false);
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(result.message || 'Failed to add project');
      }
    } catch (err) {
      console.error('Error adding project:', err);
      setError('Error adding project');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/projects/${editingId}`,
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
        setProjects(projects.map(p => p.id === editingId ? result.data : p));
        setSuccess(result.message || 'Project updated successfully!');
        setEditingId(null);
        setEditingProject(null);
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(result.message || 'Failed to update project');
      }
    } catch (err) {
      console.error('Error updating project:', err);
      setError('Error updating project');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/projects/${id}`,
        {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${authContext.token}` }
        }
      );
      if (response.ok) {
        const result = await response.json();
        setProjects(projects.filter(p => p.id !== id));
        setSuccess(result.message || 'Project deleted successfully!');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        const result = await response.json();
        setError(result.message || 'Failed to delete project');
      }
    } catch (err) {
      console.error('Error deleting project:', err);
      setError('Error deleting project');
    } finally {
      setLoading(false);
    }
  };

  if (loading && projects.length === 0) {
    return <div className="text-center text-slate-500">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          {editingId ? 'Edit Project' : showForm ? 'Add New Project' : 'Projects'}
        </h2>
        {!showForm && !editingId && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
          >
            <Plus className="w-4 h-4" />
            Add Project
          </button>
        )}
      </div>

      {/* Messages */}
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

      {/* Form */}
      {showForm && (
        <div className="bg-slate-50 dark:bg-slate-700/50 p-6 rounded-lg border border-slate-200 dark:border-slate-600">
          <ProjectForm
            onSubmit={handleAdd}
            onCancel={() => setShowForm(false)}
            isLoading={loading}
          />
        </div>
      )}

      {editingId && editingProject && (
        <div className="bg-slate-50 dark:bg-slate-700/50 p-6 rounded-lg border border-slate-200 dark:border-slate-600">
          <ProjectForm
            initialData={editingProject}
            onSubmit={handleEdit}
            onCancel={() => { setEditingId(null); setEditingProject(null); }}
            isLoading={loading}
          />
        </div>
      )}

      {/* Projects List */}
      {!showForm && !editingId && (
        <div className="space-y-4">
          {projects.length === 0 ? (
            <p className="text-slate-500 italic">No projects yet</p>
          ) : (
            projects.map(project => (
              <div
                key={project.id}
                className="bg-slate-50 dark:bg-slate-700/50 p-6 rounded-lg border border-slate-200 dark:border-slate-600 flex justify-between items-start"
              >
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {project.name}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">
                    {project.description}
                  </p>
                  {project.techStack && (
                    <p className="text-slate-500 dark:text-slate-500 text-xs mt-2">
                      <span className="font-semibold">Tech:</span> {project.techStack}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => {
                      setEditingId(project.id);
                      setEditingProject(project);
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
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

export default ProjectsEditor;
