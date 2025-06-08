'use client';

import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 20,
    borderBottom: '1 solid #e5e7eb',
    paddingBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    width: '40%',
    alignItems: 'flex-end',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#1f2937',
  },
  contact: {
    fontSize: 10,
    color: '#4b5563',
    marginBottom: 3,
  },
  socialLinks: {
    fontSize: 9,
    color: '#4b5563',
    marginBottom: 3,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1f2937',
    borderBottom: '1 solid #e5e7eb',
    paddingBottom: 5,
  },
  objectiveSection: {
    marginBottom: 10,
    padding: 5,
    backgroundColor: '#f9fafb',
    borderRadius: 4,
  },
  objectiveTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 3,
  },
  objectiveText: {
    fontSize: 10,
    color: '#1f2937',
    lineHeight: 1.4,
    textAlign: 'justify',
  },
  item: {
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemLeft: {
    width: '70%',
  },
  itemRight: {
    width: '25%',
  },
  itemHeader: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 1,
  },
  itemSubheader: {
    fontSize: 10,
    color: '#4b5563',
    marginBottom: 2,
  },
  itemDescription: {
    fontSize: 9,
    color: '#4b5563',
    lineHeight: 1.3,
  },
  dateText: {
    fontSize: 9,
    color: '#4b5563',
    textAlign: 'right',
  },
  skills: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  skillCategory: {
    marginBottom: 6,
    width: '100%',
  },
  skillCategoryTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 3,
    textTransform: 'uppercase',
  },
  skillList: {
    fontSize: 9,
    color: '#1f2937',
    marginLeft: 12,
    lineHeight: 1.4,
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '70%',
  },
  skillItem: {
    width: '20.66%',
    padding: 0,
    margin: 0,
  },
  url: {
    fontSize: 8,
    color: '#2563eb',
    marginTop: 2,
  },
});

const formatDate = (date) => {
  if (!date) return 'Present';
  
  // If date is already in the format we want, return it
  if (date.includes('Present')) return date;
  
  // Parse the date string
  const dateObj = new Date(date);
  
  // Format as Month Year
  const month = dateObj.toLocaleString('default', { month: 'long' });
  const year = dateObj.getFullYear();
  
  return `${month} ${year}`;
};

const PDFDocument = ({ data }) => {
  if (!data) return null;

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  const formatSkills = (skills) => {
    return skills.map(skill => capitalizeFirstLetter(skill.trim())).join(', ');
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Profile Section */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.name}>{data.personalInfo.name}</Text>
            <Text style={styles.contact}>{data.personalInfo.email}</Text>
            <Text style={styles.contact}>{data.personalInfo.phone}</Text>
            <Text style={styles.contact}>{data.personalInfo.location}</Text>
          </View>
          <View style={styles.headerRight}>
            {data.personalInfo.github && (
              <Text style={styles.socialLinks}>GitHub: {data.personalInfo.github}</Text>
            )}
            {data.personalInfo.linkedin && (
              <Text style={styles.socialLinks}>LinkedIn: {data.personalInfo.linkedin}</Text>
            )}
            {data.personalInfo.portfolio && (
              <Text style={styles.socialLinks}>Portfolio: {data.personalInfo.portfolio}</Text>
            )}
          </View>
        </View>

        {/* Objective Section */}
        {data.personalInfo.resumeObjective && (
          <View style={[styles.objectiveSection, { marginTop: 5, marginBottom: 5 }]}>
            <Text style={styles.objectiveTitle}>Professional Summary</Text>
            <Text style={styles.objectiveText}>{data.personalInfo.resumeObjective}</Text>
          </View>
        )}

        {/* Education Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>
          {data.education.map((edu, index) => (
            <View key={index} style={styles.item}>
              <View style={styles.itemLeft}>
                <Text style={styles.itemHeader}>
                  {edu.school} 
                </Text>
                <Text style={styles.itemSubheader}>
                  {edu.degree}
                  {edu.field}
                </Text>
              </View>
              <View style={styles.itemRight}>
                <Text style={styles.dateText}>
                  {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Experience Section */}
        {data.experience && data.experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {data.experience.map((exp, index) => (
              <View key={index} style={styles.item}>
                <View style={styles.itemLeft}>
                  <Text style={styles.itemHeader}>{exp.position}</Text>
                  <Text style={styles.itemSubheader}>{exp.company}</Text>
                  {exp.description.map((bullet, bulletIndex) => (
                    <Text key={bulletIndex} style={[styles.itemDescription, { marginLeft: 10 }]}>
                      • {bullet}
                    </Text>
                  ))}
                </View>
                <View style={styles.itemRight}>
                  <Text style={styles.dateText}>
                    {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Projects Section - Only shown if projects exist */}
        {data.projects && data.projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {data.projects.map((project, index) => (
              <View key={index} style={styles.item}>
                <View style={styles.itemLeft}>
                  <Text style={styles.itemHeader}>{project.name}</Text>
                  <Text style={styles.itemSubheader}>{project.technologies}</Text>
                  <Text style={styles.itemDescription}>{project.description}</Text>
                  {project.url && (
                    <Text style={styles.url}>Project URL: {project.url}</Text>
                  )}
                </View>
                <View style={styles.itemRight}>
                  <Text style={styles.dateText}>
                    {formatDate(project.date)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Skills Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills</Text>
          <View style={styles.skills}>
            {Object.entries(data.skills).map(([category, skills]) => (
              skills.length > 0 && (
                <View key={category} style={styles.skillCategory}>
                  <Text style={styles.skillCategoryTitle}>
                    {category === 'programming' && 'Programming Languages'}
                    {category === 'softSkills' && 'Soft Skills'}
                    {category === 'tools' && 'Tools & Technologies'}
                    {category === 'languages' && 'Languages'}
                    {category === 'other' && 'Other Skills'}
                  </Text>
                  <View style={styles.skillList}>
                    {skills.map((skill, index) => (
                      <Text key={index} style={styles.skillItem}>
                        {index > 0 ? ',' : ''}
                        {capitalizeFirstLetter(skill.trim())}
                      </Text>
                    ))}
                  </View>
                </View>
              )
            ))}
          </View>
        </View>

        {/* Certifications & Achievements Section */}
        {data.certifications && data.certifications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certifications & Achievements</Text>
            {data.certifications.map((cert, index) => (
              <View key={index} style={styles.item}>
                <View style={styles.itemLeft}>
                  <Text style={styles.itemHeader}>{cert.name}</Text>
                  <Text style={styles.itemSubheader}>{cert.issuer}</Text>
                  {cert.url && (
                    <Text style={styles.url}>Certificate URL: {cert.url}</Text>
                  )}
                </View>
                <View style={styles.itemRight}>
                  <Text style={styles.dateText}>
                    {formatDate(cert.date)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
};

export default PDFDocument; 