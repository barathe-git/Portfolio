import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import EducationForm from "../../components/forms/EducationForm";
import { Edit2, Trash2, Plus } from 'lucide-react';

/**
 * EducationEditor - Admin page for managing education
 */
function EducationEditor() {
  const authContext = useContext(AuthContext);
  const [educations, setEducations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingEducation, setEditingEducation] = useState(null);

  useEffect(() => {
    fetchEducations();
  }, []);

  const fetchEducations = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080/api'}/education`, {
        headers: { 'Authorization': `Bearer ${authContext.token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setEducations(data);
      } else {
        setError('Failed to load educations');
      }
    } catch (err) {
      console.error('Error fetching educations:', err);
      setError('Error loading educations');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080/api'}/education`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authContext.token}`
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const newEducation = await response.json();
        setEducations([...educations, newEducation]);
        setSuccess('Education record added successfully!');
        setShowForm(false);
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError('Failed to add education');
      }
    } catch (err) {
      console.error('Error adding education:', err);
      setError('Error adding education');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:8080/api'}/education/${editingId}`,
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
        const updatedEducation = await response.json();
        setEducations(educations.map(e => e.id === editingId ? updatedEducation : e));
        setSuccess('Education record updated successfully!');
        setEditingId(null);
        setEditingEducation(null);
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError('Failed to update education');
      }
    } catch (err) {
      console.error('Error updating education:', err);
      setError('Error updating education');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this education record?')) return;
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:8080/api'}/education/${id}`,
        {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${authContext.token}` }
        }
      );
      if (response.ok) {
        setEducations(educations.filter(e => e.id !== id));
        setSuccess('Education record deleted successfully!');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError('Failed to delete education');
      }
    } catch (err) {
      console.error('Error deleting education:', err);
      setError('Error deleting education');
    } finally {
      setLoading(false);
    }
  };

  if (loading && educations.length === 0) {
    return <div className="text-center text-slate-500">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          {editingId ? 'Edit Education' : showForm ? 'Add Education' : 'Education'}
        </h2>
        {!showForm && !editingId && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
          >
            <Plus className="w-4 h-4" />
            Add Education
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
          <EducationForm
            onSubmit={handleAdd}
            onCancel={() => setShowForm(false)}
            isLoading={loading}
          />
        </div>
      )}

      {editingId && editingEducation && (
        <div className="bg-slate-50 dark:bg-slate-700/50 p-6 rounded-lg border border-slate-200 dark:border-slate-600">
          <EducationForm
            initialData={editingEducation}
            onSubmit={handleEdit}
            onCancel={() => { setEditingId(null); setEditingEducation(null); }}
            isLoading={loading}
          />
        </div>
      )}

      {!showForm && !editingId && (
        <div className="space-y-4">
          {educations.length === 0 ? (
            <p className="text-slate-500 italic">No education records yet</p>
          ) : (
            educations.map(edu => (
              <div
                key={edu.id}
                className="bg-slate-50 dark:bg-slate-700/50 p-6 rounded-lg border border-slate-200 dark:border-slate-600 flex justify-between items-start"
              >
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {edu.degree}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                    {edu.institute}
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    {edu.duration}
                  </p>
                  <div className="flex gap-4 mt-2 text-sm">
                    {edu.cgpa && <span>CGPA: <span className="font-semibold">{edu.cgpa}</span></span>}
                    {edu.percentage && <span>Percentage: <span className="font-semibold">{edu.percentage}</span></span>}
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => {
                      setEditingId(edu.id);
                      setEditingEducation(edu);
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(edu.id)}
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

export default EducationEditor;
