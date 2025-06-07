'use client';

import { useState, useEffect } from 'react';
import ResumeForm from '../components/ResumeForm';
import ResumePreview from '../components/ResumePreview';
import Footer from '../components/Footer';

export default function Home() {
  const [resumeData, setResumeData] = useState({
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
    skills: {
      programming: [],
      softSkills: [],
      tools: [],
      languages: [],
      other: []
    },
    certifications: [],
  });

  useEffect(() => {
    const savedData = localStorage.getItem('resumeData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setResumeData(parsedData);
      } catch (error) {
        console.error('Error loading saved resume data:', error);
      }
    }
  }, []);

  const handleResumeUpdate = (data) => {
    setResumeData(data);
    localStorage.setItem('resumeData', JSON.stringify(data));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto py-8 px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Resume Builder</h1>
            <p className="text-lg text-gray-600">
              Create a professional resume in minutes. Fill in your details and preview your resume in real-time.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6 lg:sticky lg:top-8 lg:h-[calc(100vh-4rem)] lg:overflow-y-auto">
              <ResumeForm onUpdate={handleResumeUpdate} initialData={resumeData} />
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 lg:sticky lg:top-8 lg:h-[calc(100vh-4rem)] lg:overflow-y-auto">
              <ResumePreview data={resumeData} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
