'use client';

import { useState, useEffect } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import PDFDocument from './PDFDocument';

export default function ResumePreview({ data }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 shadow-lg">
      {/* Personal Info */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">{data.personalInfo.name}</h1>
        <p className="text-gray-600">
          {data.personalInfo.email} • {data.personalInfo.phone} • {data.personalInfo.location}
        </p>
        <div className="flex justify-center space-x-4 mt-2">
          {data.personalInfo.github && (
            <a
              href={data.personalInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
            >
              GitHub
            </a>
          )}
          {data.personalInfo.linkedin && (
            <a
              href={data.personalInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
            >
              LinkedIn
            </a>
          )}
          {data.personalInfo.portfolio && (
            <a
              href={data.personalInfo.portfolio}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
            >
              Portfolio
            </a>
          )}
        </div>
      </div>

      {/* Objective */}
      {data.personalInfo.resumeObjective && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 border-b pb-2">Objective</h2>
          <p className="text-gray-700 leading-relaxed">{data.personalInfo.resumeObjective}</p>
        </div>
      )}

      {/* Education Section */}
      {data.education.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 border-b pb-2">Education</h2>
          {data.education.map((edu, index) => (
            <div key={index} className="mb-4">
              <h3 className="text-xl font-semibold">{edu.school}</h3>
              <p className="text-gray-600">
                {edu.degree} in {edu.field} • {edu.startDate} - {edu.endDate}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Experience Section */}
      {data.experience && data.experience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 border-b pb-2">Experience</h2>
          {data.experience.map((exp, index) => (
            <div key={index} className="mb-4">
              <h3 className="text-xl font-semibold">{exp.position}</h3>
              <p className="text-gray-600">
                {exp.company} • {exp.startDate} - {exp.endDate}
              </p>
              <ul className="mt-2 list-disc pl-5 space-y-1">
                {exp.description.map((bullet, bulletIndex) => (
                  <li key={bulletIndex} className="text-gray-700">{bullet}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Projects Section */}
      {data.projects && data.projects.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 border-b pb-2">Projects</h2>
          {data.projects.map((project, index) => (
            <div key={index} className="mb-4">
              <h3 className="text-xl font-semibold">{project.name}</h3>
              <p className="text-gray-600">
                {project.technologies}
              </p>
              <p className="mt-2">{project.description}</p>
              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  View Project
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Skills Section */}
      {Object.keys(data.skills).some(category => data.skills[category].length > 0) && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 border-b pb-2">Skills</h2>
          {Object.entries(data.skills).map(([category, skills]) => (
            skills.length > 0 && (
              <div key={category} className="mb-4">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  {category === 'programming' && 'Programming Languages'}
                  {category === 'softSkills' && 'Soft Skills'}
                  {category === 'tools' && 'Tools & Technologies'}
                  {category === 'languages' && 'Languages'}
                  {category === 'other' && 'Other Skills'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )
          ))}
        </div>
      )}

      {/* Certifications & Achievements Section */}
      {data.certifications && data.certifications.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">Certifications & Achievements</h2>
          <div className="space-y-4">
            {data.certifications.map((cert, index) => (
              <div key={index} className="mb-4">
                <h3 className="font-semibold">
                  {cert.type === 'achievement' ? '🏆 ' : '📜 '}
                  {cert.name}
                </h3>
                <p className="text-gray-600">
                  {cert.issuer} • {cert.date}
                </p>
                {cert.type === 'certification' && cert.url && (
                  <a
                    href={cert.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    View Certificate
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <PDFDownloadLink
          document={<PDFDocument data={data} />}
          fileName={`${data.personalInfo.name.replace(/\s+/g, '_')}_Resume.pdf`}
          className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          {({ blob, url, loading, error }) =>
            loading ? 'Generating PDF...' : 'Download PDF'
          }
        </PDFDownloadLink>
      </div>
    </div>
  );
} 