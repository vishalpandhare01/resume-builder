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
    <div className="max-w-[210mm] mx-auto bg-white p-8 shadow-lg">
      {/* Profile Section */}
      <div className="flex justify-between mb-8 border-b pb-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-2 text-gray-800">{data.personalInfo.name}</h1>
          <p className="text-sm text-gray-600 mb-1">{data.personalInfo.email}</p>
          <p className="text-sm text-gray-600 mb-1">{data.personalInfo.phone}</p>
          <p className="text-sm text-gray-600">{data.personalInfo.location}</p>
        </div>
        <div className="w-[40%] text-right">
          {data.personalInfo.github && (
            <p className="text-sm text-gray-600 mb-1">GitHub: {data.personalInfo.github}</p>
          )}
          {data.personalInfo.linkedin && (
            <p className="text-sm text-gray-600 mb-1">LinkedIn: {data.personalInfo.linkedin}</p>
          )}
          {data.personalInfo.portfolio && (
            <p className="text-sm text-gray-600">Portfolio: {data.personalInfo.portfolio}</p>
          )}
        </div>
      </div>

      {/* Objective Section */}
      {data.personalInfo.resumeObjective && (
        <div className="mb-6 bg-gray-50 p-3 rounded">
          <h2 className="text-sm font-bold text-gray-800 mb-2">Professional Summary</h2>
          <p className="text-sm text-gray-700 leading-relaxed">{data.personalInfo.resumeObjective}</p>
        </div>
      )}

      {/* Education Section */}
      {data.education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-base font-bold mb-3 border-b pb-2 text-gray-800">Education</h2>
          {data.education.map((edu, index) => (
            <div key={index} className="flex justify-between mb-3">
              <div className="w-[70%]">
                <h3 className="text-sm font-bold text-gray-800">{edu.school}</h3>
                <p className="text-sm text-gray-600">
                  {edu.degree} {edu.field}
                </p>
              </div>
              <div className="w-[25%] text-right">
                <p className="text-sm text-gray-600">
                  {edu.startDate} - {edu.endDate}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Experience Section */}
      {data.experience && data.experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-base font-bold mb-3 border-b pb-2 text-gray-800">Experience</h2>
          {data.experience.map((exp, index) => (
            <div key={index} className="flex justify-between mb-3">
              <div className="w-[70%]">
                <h3 className="text-sm font-bold text-gray-800">{exp.position}</h3>
                <p className="text-sm text-gray-600 mb-2">{exp.company}</p>
                <ul className="list-disc pl-5 space-y-1">
                  {exp.description.map((bullet, bulletIndex) => (
                    <li key={bulletIndex} className="text-sm text-gray-600">{bullet}</li>
                  ))}
                </ul>
              </div>
              <div className="w-[25%] text-right">
                <p className="text-sm text-gray-600">
                  {exp.startDate} - {exp.endDate}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Projects Section */}
      {data.projects && data.projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-base font-bold mb-3 border-b pb-2 text-gray-800">Projects</h2>
          {data.projects.map((project, index) => (
            <div key={index} className="flex justify-between mb-3">
              <div className="w-[70%]">
                <h3 className="text-sm font-bold text-gray-800">{project.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{project.technologies}</p>
                <p className="text-sm text-gray-600">{project.description}</p>
                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    View Project
                  </a>
                )}
              </div>
              <div className="w-[25%] text-right">
                <p className="text-sm text-gray-600">{project.date}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Skills Section */}
      {data.skills && Object.keys(data.skills).length > 0 && (
        <div className="mb-6">
          <h2 className="text-base font-bold mb-3 border-b pb-2 text-gray-800">Skills</h2>
          {Object.entries(data.skills).map(([category, skills]) => (
            skills.length > 0 && (
              <div key={category} className="mb-3">
                <h3 className="text-xs font-bold text-gray-800 uppercase mb-2">
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
                      className="text-xs text-gray-700"
                    >
                      {skill}{index < skills.length - 1 ? ', ' : ''}
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
          <h2 className="text-base font-bold mb-3 border-b pb-2 text-gray-800">Certifications & Achievements</h2>
          {data.certifications.map((cert, index) => (
            <div key={index} className="flex justify-between mb-3">
              <div className="w-[70%]">
                <h3 className="text-sm font-bold text-gray-800">
                  {cert.type === 'achievement' ? '🏆 ' : '📜 '}
                  {cert.name}
                </h3>
                <p className="text-sm text-gray-600">{cert.issuer}</p>
                {cert.url && (
                  <a
                    href={cert.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    View Certificate
                  </a>
                )}
              </div>
              <div className="w-[25%] text-right">
                <p className="text-sm text-gray-600">{cert.date}</p>
              </div>
            </div>
          ))}
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