/**
 * Utility functions for downloading CV/Resume in different formats
 */

/**
 * Generate and download CV as PDF-style HTML
 */
export const downloadCVAsPDF = (profile, experiences, education, skills, projects) => {
  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    const cat = skill.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill.name);
    return acc;
  }, {});

  const cvContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${profile.name} - Resume</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body { 
      font-family: 'Times New Roman', Times, serif;
      max-width: 850px; 
      margin: 0 auto; 
      padding: 40px 60px;
      line-height: 1.6;
      color: #000;
      background: #fff;
    }
    
    /* Header Section */
    .header {
      text-align: center;
      margin-bottom: 25px;
      border-bottom: 1px solid #000;
      padding-bottom: 15px;
    }
    
    h1 { 
      font-size: 28px;
      font-weight: bold;
      margin-bottom: 8px;
      letter-spacing: 0.5px;
    }
    
    .contact-info {
      font-size: 12px;
      color: #333;
    }
    
    .contact-info a {
      color: #333;
      text-decoration: none;
    }
    
    /* Section Headers */
    h2 { 
      font-size: 16px;
      font-weight: bold;
      margin-top: 25px;
      margin-bottom: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    /* Section Content */
    .section {
      margin-bottom: 20px;
    }
    
    .section p {
      font-size: 12px;
      text-align: justify;
      margin-bottom: 10px;
    }
    
    /* Skills Section */
    .skills-list {
      font-size: 12px;
      margin-left: 20px;
    }
    
    .skills-list li {
      margin-bottom: 6px;
      line-height: 1.5;
    }
    
    .skill-category {
      font-weight: bold;
      display: inline;
    }
    
    /* Work Experience */
    .experience-item {
      margin-bottom: 18px;
    }
    
    .experience-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 3px;
    }
    
    .company-name {
      font-weight: bold;
      font-size: 13px;
    }
    
    .duration {
      font-size: 12px;
      font-style: italic;
    }
    
    .role {
      font-size: 12px;
      font-style: italic;
      margin-bottom: 6px;
    }
    
    .project-name {
      font-weight: bold;
      font-size: 12px;
      margin-top: 10px;
      margin-bottom: 4px;
    }
    
    .experience-item ul {
      margin-left: 25px;
      font-size: 12px;
    }
    
    .experience-item ul li {
      margin-bottom: 4px;
    }
    
    /* Education */
    .education-item {
      margin-bottom: 12px;
    }
    
    .education-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
    }
    
    .institute-name {
      font-weight: bold;
      font-size: 13px;
    }
    
    .degree {
      font-size: 12px;
      margin-bottom: 2px;
    }
    
    .board-info {
      font-size: 12px;
      font-style: italic;
      color: #333;
    }
    
    @media print { 
      body { 
        margin: 0; 
        padding: 20px 40px; 
      }
      @page {
        margin: 0.5in;
      }
    }
  </style>
</head>
<body>
  <!-- Header -->
  <div class="header">
    <h1>${profile.name}</h1>
    <div class="contact-info">
      ${profile.location || ''}${profile.email ? ' | ' + profile.email : ''}${profile.phone ? ' | ' + profile.phone : ''}
    </div>
  </div>

  <!-- Summary -->
  <div class="section">
    <h2>Summary</h2>
    <p>${profile.summary}</p>
  </div>

  <!-- Skills -->
  ${skills && skills.length > 0 ? `
  <div class="section">
    <h2>Skills</h2>
    <ul class="skills-list">
      ${Object.entries(groupedSkills).map(([category, skillList]) => `
        <li><span class="skill-category">${category}:</span> ${skillList.join(', ')}</li>
      `).join('')}
    </ul>
  </div>
  ` : ''}

  <!-- Work Experience -->
  ${experiences && experiences.length > 0 ? `
  <div class="section">
    <h2>Work Experience</h2>
    ${experiences.map(exp => `
      <div class="experience-item">
        <div class="experience-header">
          <span class="company-name">${exp.company}</span>
          <span class="duration">${exp.duration}</span>
        </div>
        <div class="role">${exp.role}</div>
        
        ${exp.projects && exp.projects.length > 0 ? 
          Array.from(exp.projects).map(proj => `
            <div class="project-name">${proj.name}</div>
            <ul>
              ${proj.highlight && proj.highlight.length > 0 
                ? proj.highlight.map(highlight => `<li>${highlight}</li>`).join('')
                : `<li>${proj.description}</li>`
              }
            </ul>
          `).join('')
          : exp.description ? `<p>${exp.description}</p>` : ''
        }
      </div>
    `).join('')}
  </div>
  ` : ''}

  <!-- Education -->
  ${education && education.length > 0 ? `
  <div class="section">
    <h2>Education</h2>
    ${education.map(edu => `
      <div class="education-item">
        <div class="education-header">
          <span class="institute-name">${edu.institute}</span>
          <span class="duration">${edu.duration}</span>
        </div>
        ${edu.degree ? `<div class="degree">${edu.degree}</div>` : ''}
        ${edu.board ? `<div class="board-info">${edu.board}</div>` : ''}
        ${edu.cgpa ? `<div class="board-info">CGPA: ${edu.cgpa}</div>` : ''}
        ${edu.percentage ? `<div class="board-info">Percentage: ${edu.percentage}%</div>` : ''}
      </div>
    `).join('')}
  </div>
  ` : ''}

</body>
</html>
  `.trim();

  // Create blob and download
  const blob = new Blob([cvContent], { type: 'text/html' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${profile.name.replace(/\s+/g, '_')}_Resume.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

/**
 * Download portfolio data as CSV
 */
export const downloadPortfolioAsCSV = (profile, experiences, education, skills, projects) => {
  let csvContent = '';

  // Profile Section
  csvContent += 'PROFILE INFORMATION\n';
  csvContent += 'Field,Value\n';
  csvContent += `Name,"${profile.name}"\n`;
  csvContent += `Title,"${profile.title}"\n`;
  csvContent += `Email,"${profile.email}"\n`;
  csvContent += `Location,"${profile.location}"\n`;
  csvContent += `Phone,"${profile.phone || 'N/A'}"\n`;
  csvContent += `LinkedIn,"${profile.linkedin || 'N/A'}"\n`;
  csvContent += `GitHub,"${profile.github || 'N/A'}"\n`;
  csvContent += `Summary,"${profile.summary?.replace(/"/g, '""')}"\n`;
  csvContent += '\n';

  // Skills Section
  if (skills && skills.length > 0) {
    csvContent += 'SKILLS\n';
    csvContent += 'Category,Skill Name,Level\n';
    skills.forEach(skill => {
      csvContent += `"${skill.category || 'Other'}","${skill.name}","${skill.level || 'N/A'}"\n`;
    });
    csvContent += '\n';
  }

  // Projects Section
  if (projects && projects.length > 0) {
    csvContent += 'PROJECTS\n';
    csvContent += 'Project Name,Description,Tech Stack,GitHub URL,Live Demo URL\n';
    projects.forEach(project => {
      csvContent += `"${project.name}","${project.description?.replace(/"/g, '""')}","${project.techStack || 'N/A'}","${project.githubUrl || 'N/A'}","${project.liveDemoUrl || 'N/A'}"\n`;
    });
    csvContent += '\n';
  }

  // Experience Section
  if (experiences && experiences.length > 0) {
    csvContent += 'WORK EXPERIENCE\n';
    csvContent += 'Company,Role,Duration,Description\n';
    experiences.forEach(exp => {
      csvContent += `"${exp.company}","${exp.role}","${exp.duration}","${exp.description?.replace(/"/g, '""') || 'N/A'}"\n`;
    });
    csvContent += '\n';
  }

  // Education Section
  if (education && education.length > 0) {
    csvContent += 'EDUCATION\n';
    csvContent += 'Institute,Degree,Board,Duration,CGPA,Percentage\n';
    education.forEach(edu => {
      csvContent += `"${edu.institute}","${edu.degree || 'N/A'}","${edu.board || 'N/A'}","${edu.duration}","${edu.cgpa || 'N/A'}","${edu.percentage || 'N/A'}"\n`;
    });
  }

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${profile.name.replace(/\s+/g, '_')}_Portfolio_Data.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

/**
 * Download as JSON
 */
export const downloadPortfolioAsJSON = (profile, experiences, education, skills, projects) => {
  const data = {
    profile,
    experiences,
    education,
    skills,
    projects,
    exportDate: new Date().toISOString()
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${profile.name.replace(/\s+/g, '_')}_Portfolio.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

