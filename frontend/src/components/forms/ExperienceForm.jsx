import { useState } from 'react';

/**
 * ExperienceForm - Reusable form for adding/editing experiences
 */
function ExperienceForm({ 
  initialData = null, 
  onSubmit, 
  onCancel, 
  isLoading = false,
  availableProjects = []
}) {
  const [formData, setFormData] = useState(initialData || {
    company: '',
    role: '',
    duration: '',
    description: '',
    projects: [],
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.company?.trim()) newErrors.company = 'Company name is required';
    if (!formData.role?.trim()) newErrors.role = 'Role is required';
    if (!formData.duration?.trim()) newErrors.duration = 'Duration is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      await onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Company */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Company <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="company"
          value={formData.company}
          onChange={handleChange}
          placeholder="Company Name"
          className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white ${
            errors.company ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
          } focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none`}
        />
        {errors.company && <p className="text-red-500 text-sm mt-1">{errors.company}</p>}
      </div>

      {/* Role */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Role <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="role"
          value={formData.role}
          onChange={handleChange}
          placeholder="Job Title"
          className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white ${
            errors.role ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
          } focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none`}
        />
        {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
      </div>

      {/* Duration */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Duration <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          placeholder="Jan 2020 - Dec 2021"
          className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white ${
            errors.duration ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
          } focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none`}
        />
        {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe your responsibilities and achievements..."
          rows="4"
          className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        />
      </div>

      {/* Projects */}
      {availableProjects.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Associated Projects
          </label>
          <div className="space-y-2 max-h-48 overflow-y-auto border border-slate-300 dark:border-slate-600 rounded-lg p-3 bg-white dark:bg-slate-700">
            {availableProjects.map((project) => (
              <label
                key={project.id}
                className="flex items-center gap-3 p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-600 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={formData.projects?.some(p => p.id === project.id) || false}
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    setFormData(prev => ({
                      ...prev,
                      projects: isChecked
                        ? [...(prev.projects || []), { id: project.id, name: project.name }]
                        : (prev.projects || []).filter(p => p.id !== project.id)
                    }));
                  }}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{project.name}</p>
                  {project.techStack && (
                    <p className="text-xs text-slate-500 dark:text-slate-400">{project.techStack}</p>
                  )}
                </div>
              </label>
            ))}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Select projects associated with this experience
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-4 pt-6 border-t border-slate-200 dark:border-slate-700">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
        >
          {isLoading ? 'Saving...' : 'Save Experience'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-700 disabled:bg-slate-400 text-slate-900 dark:text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default ExperienceForm;
