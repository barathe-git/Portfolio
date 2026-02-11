import { useState } from 'react';

/**
 * EducationForm - Reusable form for adding/editing education
 */
function EducationForm({ 
  initialData = null, 
  onSubmit, 
  onCancel, 
  isLoading = false 
}) {
  const [formData, setFormData] = useState(initialData || {
    institute: '',
    degree: '',
    duration: '',
    cgpa: '',
    percentage: '',
    board: '',
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
    if (!formData.institute?.trim()) newErrors.institute = 'Institute name is required';
    if (!formData.degree?.trim()) newErrors.degree = 'Degree is required';
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
      {/* Institute */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Institute <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="institute"
          value={formData.institute}
          onChange={handleChange}
          placeholder="University Name"
          className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white ${
            errors.institute ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
          } focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none`}
        />
        {errors.institute && <p className="text-red-500 text-sm mt-1">{errors.institute}</p>}
      </div>

      {/* Degree */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Degree <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="degree"
          value={formData.degree}
          onChange={handleChange}
          placeholder="Bachelor of Science"
          className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white ${
            errors.degree ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
          } focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none`}
        />
        {errors.degree && <p className="text-red-500 text-sm mt-1">{errors.degree}</p>}
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
          placeholder="2018 - 2022"
          className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white ${
            errors.duration ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
          } focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none`}
        />
        {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration}</p>}
      </div>

      {/* CGPA */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          CGPA
        </label>
        <input
          type="number"
          name="cgpa"
          value={formData.cgpa}
          onChange={handleChange}
          placeholder="3.8"
          step="0.01"
          className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        />
      </div>

      {/* Percentage */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Percentage
        </label>
        <input
          type="text"
          name="percentage"
          value={formData.percentage}
          onChange={handleChange}
          placeholder="85%"
          className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        />
      </div>

      {/* Board */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Board
        </label>
        <input
          type="text"
          name="board"
          value={formData.board}
          onChange={handleChange}
          placeholder="CBSE"
          className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-4 pt-6 border-t border-slate-200 dark:border-slate-700">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
        >
          {isLoading ? 'Saving...' : 'Save Education'}
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

export default EducationForm;
