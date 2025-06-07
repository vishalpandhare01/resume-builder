'use client';

import { useState, useEffect } from 'react';

const inputBaseClasses = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200 ease-in-out text-base px-4 py-2.5";
const labelBaseClasses = "block text-sm font-medium text-gray-700 mb-1";
const errorBaseClasses = "text-red-500 text-sm mt-1 flex items-center gap-1";
const sectionBaseClasses = "space-y-6 bg-white p-6 rounded-lg shadow-sm border border-gray-100";
const buttonBaseClasses = "px-4 py-2 rounded-md transition-all duration-200 ease-in-out font-medium text-sm focus:outline-none focus:ring-2 focus:ring-offset-2";

export default function ResumeForm({ onUpdate, initialData }) {
  const [formData, setFormData] = useState(initialData || {
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      location: '',
      github: '',
      linkedin: '',
      portfolio: '',
      resumeObjective: '',
    },
    education: [],
    experience: [],
    projects: [],
    skills: {
      programming: [],
      softSkills: [],
      tools: [],
      languages: [],
      other: []
    },
    certifications: [],
  });

  const [errors, setErrors] = useState({});

  const [certifications, setCertifications] = useState(
    initialData?.certifications?.length > 0 
      ? initialData.certifications 
      : [{ name: '', issuer: '', date: '', url: '', type: 'certification' }]
  );

  const [selectedSkillCategory, setSelectedSkillCategory] = useState('programming');
  const [newSkill, setNewSkill] = useState('');

  const skillCategories = [
    { id: 'programming', label: 'Programming Languages' },
    { id: 'softSkills', label: 'Soft Skills' },
    { id: 'tools', label: 'Tools & Technologies' },
    { id: 'languages', label: 'Languages' },
    { id: 'other', label: 'Other Skills' }
  ];

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setCertifications(initialData.certifications?.length > 0 
        ? initialData.certifications 
        : [{ name: '', issuer: '', date: '', url: '', type: 'certification' }]
      );
    }
  }, [initialData]);

  // Add new useEffect to sync certifications with formData
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      certifications: certifications
    }));
  }, [certifications]);

  // Add useEffect to ensure projects array exists
  useEffect(() => {
    if (initialData && !initialData.projects) {
      setFormData(prev => ({
        ...prev,
        projects: []
      }));
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors = {};
    
    // Validate personal info
    if (!formData.personalInfo.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.personalInfo.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.personalInfo.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.personalInfo.phone.trim()) {
      newErrors.phone = 'Phone is required';
    }
    if (!formData.personalInfo.location.trim()) {
      newErrors.location = 'Location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (section, field, value, index = null) => {
    setFormData(prev => {
      const newData = { ...prev };
      if (section === 'skills') {
        newData.skills[index] = value;
      } else if (index !== null) {
        if (!newData[section]) {
          newData[section] = [];
        }
        if (!newData[section][index]) {
          newData[section][index] = {};
        }
        newData[section][index][field] = value;
      } else if (section === 'personalInfo') {
        newData.personalInfo[field] = value;
      }
      return newData;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const dataToSave = {
        ...formData,
        // Filter out empty experience entries
        experience: formData.experience.filter(exp => 
          exp.company.trim() || exp.position.trim() || exp.description.some(desc => desc.trim())
        ),
        certifications: certifications,
      };
      localStorage.setItem('resumeData', JSON.stringify(dataToSave));
      onUpdate(dataToSave);
    }
  };

  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, {
        school: '',
        degree: '',
        field: '',
        startDate: '',
        endDate: '',
        description: '',
      }],
    }));
  };

  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experience: [...prev.experience, {
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        description: [''],
      }],
    }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setFormData(prev => ({
        ...prev,
        skills: {
          ...prev.skills,
          [selectedSkillCategory]: [...prev.skills[selectedSkillCategory], newSkill.trim()]
        }
      }));
      setNewSkill('');
    }
  };

  const addCertification = () => {
    setCertifications([...certifications, { name: '', issuer: '', date: '', url: '', type: 'certification' }]);
  };

  const removeItem = (section, index) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index),
    }));
  };

  const removeCertification = (index) => {
    setCertifications(certifications.filter((_, i) => i !== index));
  };

  const handleCertificationChange = (index, field, value) => {
    const newCertifications = [...certifications];
    newCertifications[index] = { ...newCertifications[index], [field]: value };
    setCertifications(newCertifications);
  };

  const handleCertificationTypeChange = (index, type) => {
    const newCertifications = [...certifications];
    newCertifications[index] = { ...newCertifications[index], type };
    setCertifications(newCertifications);
  };

  const handleSkillChange = (category, index, value) => {
    setFormData(prev => {
      const newData = { ...prev };
      newData.skills[category][index] = value;
      return newData;
    });
  };

  const removeSkill = (category, index) => {
    setFormData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: prev.skills[category].filter((_, i) => i !== index)
      }
    }));
  };

  const addProject = () => {
    setFormData(prev => ({
      ...prev,
      projects: [...prev.projects, {
        name: '',
        technologies: '',
        description: '',
        url: '',
        date: '',
      }],
    }));
  };

  const removeProject = (index) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      <div className={sectionBaseClasses}>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelBaseClasses}>Name</label>
            <input
              type="text"
              value={formData.personalInfo.name}
              onChange={(e) => handleInputChange('personalInfo', 'name', e.target.value)}
              className={inputBaseClasses}
              placeholder="John Doe"
            />
            {errors.name && <p className={errorBaseClasses}>⚠️ {errors.name}</p>}
          </div>
          <div>
            <label className={labelBaseClasses}>Email</label>
            <input
              type="email"
              value={formData.personalInfo.email}
              onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
              className={inputBaseClasses}
              placeholder="john.doe@example.com"
            />
            {errors.email && <p className={errorBaseClasses}>⚠️ {errors.email}</p>}
          </div>
          <div>
            <label className={labelBaseClasses}>Phone</label>
            <input
              type="tel"
              value={formData.personalInfo.phone}
              onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
              className={inputBaseClasses}
              placeholder="+1 (555) 123-4567"
            />
            {errors.phone && <p className={errorBaseClasses}>⚠️ {errors.phone}</p>}
          </div>
          <div>
            <label className={labelBaseClasses}>Location</label>
            <input
              type="text"
              value={formData.personalInfo.location}
              onChange={(e) => handleInputChange('personalInfo', 'location', e.target.value)}
              className={inputBaseClasses}
              placeholder="City, Country"
            />
            {errors.location && <p className={errorBaseClasses}>⚠️ {errors.location}</p>}
          </div>
          <div>
            <label className={labelBaseClasses}>GitHub URL</label>
            <input
              type="url"
              value={formData.personalInfo.github}
              onChange={(e) => handleInputChange('personalInfo', 'github', e.target.value)}
              className={inputBaseClasses}
              placeholder="https://github.com/username"
            />
          </div>
          <div>
            <label className={labelBaseClasses}>LinkedIn URL</label>
            <input
              type="url"
              value={formData.personalInfo.linkedin}
              onChange={(e) => handleInputChange('personalInfo', 'linkedin', e.target.value)}
              className={inputBaseClasses}
              placeholder="https://linkedin.com/in/username"
            />
          </div>
          <div>
            <label className={labelBaseClasses}>Portfolio URL</label>
            <input
              type="url"
              value={formData.personalInfo.portfolio}
              onChange={(e) => handleInputChange('personalInfo', 'portfolio', e.target.value)}
              className={inputBaseClasses}
              placeholder="https://your-portfolio.com"
            />
          </div>
          <div className="md:col-span-2">
            <label className={labelBaseClasses}>Resume Objective</label>
            <textarea
              value={formData.personalInfo.resumeObjective}
              onChange={(e) => handleInputChange('personalInfo', 'resumeObjective', e.target.value)}
              className={`${inputBaseClasses} min-h-[120px] resize-y`}
              placeholder="Write a brief summary of your career goals and aspirations..."
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Education</h2>
          <button
            type="button"
            onClick={addEducation}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Add Education
          </button>
        </div>
        {formData.education.map((edu, index) => (
          <div key={index} className="border p-4 rounded-md bg-gray-50">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Education #{index + 1}</h3>
              <button
                type="button"
                onClick={() => removeItem('education', index)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">School</label>
                <input
                  type="text"
                  value={edu.school}
                  onChange={(e) => handleInputChange('education', 'school', e.target.value, index)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Degree</label>
                <input
                  type="text"
                  value={edu.degree}
                  onChange={(e) => handleInputChange('education', 'degree', e.target.value, index)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Field of Study</label>
                <input
                  type="text"
                  value={edu.field}
                  onChange={(e) => handleInputChange('education', 'field', e.target.value, index)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Start Date</label>
                  <input
                    type="date"
                    value={edu.startDate}
                    onChange={(e) => handleInputChange('education', 'startDate', e.target.value, index)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">End Date</label>
                  <input
                    type="date"
                    value={edu.endDate}
                    onChange={(e) => handleInputChange('education', 'endDate', e.target.value, index)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={edu.description}
                  onChange={(e) => handleInputChange('education', 'description', e.target.value, index)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows="3"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Work Experience</h2>
          <button
            type="button"
            onClick={addExperience}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Add Experience
          </button>
        </div>
        {formData.experience.map((exp, index) => (
          <div key={index} className="border p-4 rounded-md bg-gray-50">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Experience #{index + 1}</h3>
              <button
                type="button"
                onClick={() => removeItem('experience', index)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Company</label>
                <input
                  type="text"
                  value={exp.company}
                  onChange={(e) => handleInputChange('experience', 'company', e.target.value, index)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Position</label>
                <input
                  type="text"
                  value={exp.position}
                  onChange={(e) => handleInputChange('experience', 'position', e.target.value, index)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Start Date</label>
                  <input
                    type="date"
                    value={exp.startDate}
                    onChange={(e) => handleInputChange('experience', 'startDate', e.target.value, index)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">End Date</label>
                  <input
                    type="date"
                    value={exp.endDate}
                    onChange={(e) => handleInputChange('experience', 'endDate', e.target.value, index)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <div className="space-y-2">
                  {exp.description.map((bullet, bulletIndex) => (
                    <div key={bulletIndex} className="flex gap-2">
                      <input
                        type="text"
                        value={bullet}
                        onChange={(e) => {
                          const newDescription = [...exp.description];
                          newDescription[bulletIndex] = e.target.value;
                          handleInputChange('experience', 'description', newDescription, index);
                        }}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Enter bullet point"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newDescription = exp.description.filter((_, i) => i !== bulletIndex);
                          handleInputChange('experience', 'description', newDescription, index);
                        }}
                        className="mt-1 text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      const newDescription = [...exp.description, ''];
                      handleInputChange('experience', 'description', newDescription, index);
                    }}
                    className="mt-2 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    Add Bullet Point
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Projects</h2>
          <button
            type="button"
            onClick={addProject}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Add Project
          </button>
        </div>
        {(formData.projects || []).map((project, index) => (
          <div key={index} className="border p-4 rounded-md bg-gray-50">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Project #{index + 1}</h3>
              <button
                type="button"
                onClick={() => removeProject(index)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Project Name</label>
                <input
                  type="text"
                  value={project.name}
                  onChange={(e) => handleInputChange('projects', 'name', e.target.value, index)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="e.g., E-commerce Website"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Technologies Used</label>
                <input
                  type="text"
                  value={project.technologies}
                  onChange={(e) => handleInputChange('projects', 'technologies', e.target.value, index)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="e.g., React, Node.js, MongoDB"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Project URL</label>
                <input
                  type="url"
                  value={project.url}
                  onChange={(e) => handleInputChange('projects', 'url', e.target.value, index)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="e.g., https://github.com/username/project"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Completion Date</label>
                <input
                  type="date"
                  value={project.date}
                  onChange={(e) => handleInputChange('projects', 'date', e.target.value, index)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={project.description}
                  onChange={(e) => handleInputChange('projects', 'description', e.target.value, index)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows="3"
                  placeholder="Describe your project, its features, and your role in it"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Skills</h2>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Add New Skill</h3>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Skill Type</label>
              <select
                value={selectedSkillCategory}
                onChange={(e) => setSelectedSkillCategory(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="programming">Programming Languages</option>
                <option value="softSkills">Soft Skills</option>
                <option value="tools">Tools & Technologies</option>
                <option value="languages">Languages</option>
                <option value="other">Other Skills</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Skill Name</label>
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter skill name"
              />
            </div>
            <button
              type="button"
              onClick={handleAddSkill}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Add Skill
            </button>
          </div>
        </div>

        {skillCategories.map(category => (
          formData.skills[category.id].length > 0 && (
            <div key={category.id} className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-700">{category.label}</h3>
              <div className="grid grid-cols-1 gap-2">
                {formData.skills[category.id].map((skill, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="flex-1 bg-gray-100 px-3 py-2 rounded-md">{skill}</span>
                    <button
                      type="button"
                      onClick={() => removeSkill(category.id, index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Certifications & Achievements</h2>
          <button
            type="button"
            onClick={addCertification}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Add Certification
          </button>
        </div>
        {certifications.map((cert, index) => (
          <div key={index} className="mb-4 p-4 border rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center space-x-4">
                <select
                  value={cert.type}
                  onChange={(e) => handleCertificationTypeChange(index, e.target.value)}
                  className="border rounded p-2"
                >
                  <option value="certification">Certification</option>
                  <option value="achievement">Achievement</option>
                </select>
                <button
                  type="button"
                  onClick={() => removeCertification(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {cert.type === 'certification' ? 'Certification Name' : 'Achievement Title'}
                </label>
                <input
                  type="text"
                  value={cert.name}
                  onChange={(e) => handleCertificationChange(index, 'name', e.target.value)}
                  className="w-full border rounded p-2"
                  placeholder={cert.type === 'certification' ? "e.g., AWS Certified Developer" : "e.g., Employee of the Year"}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {cert.type === 'certification' ? 'Issuing Organization' : 'Awarding Organization'}
                </label>
                <input
                  type="text"
                  value={cert.issuer}
                  onChange={(e) => handleCertificationChange(index, 'issuer', e.target.value)}
                  className="w-full border rounded p-2"
                  placeholder={cert.type === 'certification' ? "e.g., Amazon Web Services" : "e.g., Company Name"}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="text"
                  value={cert.date}
                  onChange={(e) => handleCertificationChange(index, 'date', e.target.value)}
                  className="w-full border rounded p-2"
                  placeholder="e.g., January 2023"
                />
              </div>
              {cert.type === 'certification' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Certificate URL
                  </label>
                  <input
                    type="text"
                    value={cert.url}
                    onChange={(e) => handleCertificationChange(index, 'url', e.target.value)}
                    className="w-full border rounded p-2"
                    placeholder="e.g., https://certificate-url.com"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => {
            localStorage.removeItem('resumeData');
            setFormData({
              personalInfo: {
                name: '',
                email: '',
                phone: '',
                location: '',
                github: '',
                linkedin: '',
                portfolio: '',
                resumeObjective: '',
              },
              education: [],
              experience: [],
              projects: [],
              skills: {
                programming: [],
                softSkills: [],
                tools: [],
                languages: [],
                other: []
              },
              certifications: [],
            });
            setCertifications([{ name: '', issuer: '', date: '', url: '', type: 'certification' }]);
            onUpdate({
              personalInfo: {
                name: '',
                email: '',
                phone: '',
                location: '',
                github: '',
                linkedin: '',
                portfolio: '',
                resumeObjective: '',
              },
              education: [],
              experience: [],
              projects: [],
              skills: {
                programming: [],
                softSkills: [],
                tools: [],
                languages: [],
                other: []
              },
              certifications: [],
            });
          }}
          className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
        >
          Delete Resume
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
        >
          Save Resume
        </button>
      </div>
    </form>
  );
} 