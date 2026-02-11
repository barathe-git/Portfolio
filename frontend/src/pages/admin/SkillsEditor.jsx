import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import SkillForm from '../../components/forms/SkillForm';
import { Edit2, Trash2, Plus } from 'lucide-react';

/**
 * SkillsEditor - Admin page for managing skills
 */
function SkillsEditor() {
  const authContext = useContext(AuthContext);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingSkill, setEditingSkill] = useState(null);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080/api'}/skills`, {
        headers: { 'Authorization': `Bearer ${authContext.token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setSkills(data);
      } else {
        setError('Failed to load skills');
      }
    } catch (err) {
      console.error('Error fetching skills:', err);
      setError('Error loading skills');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080/api'}/skills`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authContext.token}`
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const newSkill = await response.json();
        setSkills([...skills, newSkill]);
        setSuccess('Skill added successfully!');
        setShowForm(false);
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError('Failed to add skill');
      }
    } catch (err) {
      console.error('Error adding skill:', err);
      setError('Error adding skill');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:8080/api'}/skills/${editingId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authContext.token}`
          },
          body: JSON.stringify(formData),
        }
      );
      if (response.ok) {
        const updatedSkill = await response.json();
        setSkills(skills.map(s => s.id === editingId ? updatedSkill : s));
        setSuccess('Skill updated successfully!');
        setEditingId(null);
        setEditingSkill(null);
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError('Failed to update skill');
      }
    } catch (err) {
      console.error('Error updating skill:', err);
      setError('Error updating skill');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:8080/api'}/skills/${id}`,
        {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${authContext.token}` }
        }
      );
      if (response.ok) {
        setSkills(skills.filter(s => s.id !== id));
        setSuccess('Skill deleted successfully!');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError('Failed to delete skill');
      }
    } catch (err) {
      console.error('Error deleting skill:', err);
      setError('Error deleting skill');
    } finally {
      setLoading(false);
    }
  };

  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    const category = skill.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {});

  if (loading && skills.length === 0) {
    return <div className="text-center text-slate-500">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          {editingId ? 'Edit Skill' : showForm ? 'Add Skill' : 'Skills'}
        </h2>
        {!showForm && !editingId && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
          >
            <Plus className="w-4 h-4" />
            Add Skill
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
          <SkillForm
            onSubmit={handleAdd}
            onCancel={() => setShowForm(false)}
            isLoading={loading}
          />
        </div>
      )}

      {editingId && editingSkill && (
        <div className="bg-slate-50 dark:bg-slate-700/50 p-6 rounded-lg border border-slate-200 dark:border-slate-600">
          <SkillForm
            initialData={editingSkill}
            onSubmit={handleEdit}
            onCancel={() => { setEditingId(null); setEditingSkill(null); }}
            isLoading={loading}
          />
        </div>
      )}

      {!showForm && !editingId && (
        <div className="space-y-6">
          {skills.length === 0 ? (
            <p className="text-slate-500 italic">No skills yet</p>
          ) : (
            Object.entries(skillsByCategory).map(([category, categorySkills]) => (
              <div key={category}>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  {category}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categorySkills.map(skill => (
                    <div
                      key={skill.id}
                      className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg border border-slate-200 dark:border-slate-600 flex justify-between items-center"
                    >
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {skill.name}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {skill.level}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingId(skill.id);
                            setEditingSkill(skill);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(skill.id)}
                          className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default SkillsEditor;
