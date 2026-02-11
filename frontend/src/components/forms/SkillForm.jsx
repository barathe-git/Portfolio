import { useState } from 'react';

/**
 * SkillForm - Reusable form for adding/editing skills
 */
function SkillForm({ 
  initialData = null, 
  onSubmit, 
  onCancel, 
  isLoading = false 
}) {
  const [formData, setFormData] = useState(initialData || {
    name: '',
    level: '',
    category: '',
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
    if (!formData.name?.trim()) newErrors.name = 'Skill name is required';
    if (!formData.level?.trim()) newErrors.level = 'Skill level is required';
    if (!formData.category?.trim()) newErrors.category = 'Skill category is required';
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
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Skill Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g., React, Python, Docker"
          className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white ${
            errors.name ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
          } focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none`}
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>

      {/* Level */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Level <span className="text-red-500">*</span>
        </label>
        <select
          name="level"
          value={formData.level}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white ${
            errors.level ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
          } focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none`}
        >
          <option value="">Select a level</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
          <option value="Expert">Expert</option>
        </select>
        {errors.level && <p className="text-red-500 text-sm mt-1">{errors.level}</p>}
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Category <span className="text-red-500">*</span>
        </label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white ${
            errors.category ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
          } focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none`}
        >
          <option value="">Select a category</option>
          <option value="Languages">Languages</option>
          <option value="Frameworks">Frameworks</option>
          <option value="Databases">Databases</option>
          <option value="Cloud & Services">Cloud & Services</option>
          <option value="Architecture">Architecture</option>
          <option value="Tools">Tools</option>
        </select>
        {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
      </div>

      {/* Actions */}
      <div className="flex gap-4 pt-6 border-t border-slate-200 dark:border-slate-700">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
        >
          {isLoading ? 'Saving...' : 'Save Skill'}
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

export default SkillForm;
