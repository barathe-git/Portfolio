import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import ProfileForm from '../../components/forms/ProfileForm';
import { API_CONFIG } from '../../constants';

/**
 * ProfileEditor - Admin page for editing profile
 */
function ProfileEditor() {
  const authContext = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_CONFIG.BASE_URL}/profile`, {
        headers: { 'Authorization': `Bearer ${authContext.token}` }
      });
      if (response.ok) {
        const result = await response.json();
        // Handle ApiResponse wrapper
        const data = result.status === 'success' ? result.data : result;
        setProfile(data);
      } else {
        const result = await response.json();
        setError(result.message || 'Failed to load profile');
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Error loading profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/profile/${profile.id}`,
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
        setProfile(result.data);
        setSuccess(result.message || 'Profile updated successfully!');
        setIsEditing(false);
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(result.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profile) {
    return <div className="text-center text-slate-500">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          {isEditing ? 'Edit Profile' : 'Profile'}
        </h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
          >
            Edit
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

      {/* Form or Display */}
      {isEditing ? (
        <ProfileForm
          initialData={profile}
          onSubmit={handleSubmit}
          onCancel={() => setIsEditing(false)}
          isLoading={loading}
        />
      ) : (
        profile && (
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Full Name</p>
              <p className="text-lg font-semibold text-slate-900 dark:text-white">{profile.name}</p>
            </div>
            <div>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Title</p>
              <p className="text-lg font-semibold text-slate-900 dark:text-white">{profile.title}</p>
            </div>
            <div>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Email</p>
              <p className="text-lg font-semibold text-slate-900 dark:text-white">{profile.email}</p>
            </div>
            <div>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Phone</p>
              <p className="text-lg font-semibold text-slate-900 dark:text-white">{profile.phone || 'N/A'}</p>
            </div>
            <div>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Location</p>
              <p className="text-lg font-semibold text-slate-900 dark:text-white">{profile.location || 'N/A'}</p>
            </div>
            <div>
              <p className="text-slate-600 dark:text-slate-400 text-sm">GitHub</p>
              <a href={profile.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                {profile.github || 'N/A'}
              </a>
            </div>
            <div className="md:col-span-2">
              <p className="text-slate-600 dark:text-slate-400 text-sm">Summary</p>
              <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{profile.summary || 'N/A'}</p>
            </div>
          </div>
        )
      )}
    </div>
  );
}

export default ProfileEditor;
