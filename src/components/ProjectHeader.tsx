import React from 'react';

interface ProjectHeaderProps {
  projectName: string;
  userName: string;
  onBack: () => void;
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({ projectName, userName, onBack }) => {
  return (
    <header className="project-header">
      <div className="project-header-left">
        <button className="back-btn" onClick={onBack}>
          <i className="fas fa-arrow-left"></i>
          Back
        </button>
        <div className="project-title">
          <h1>Results</h1>
          <p>{projectName}</p>
        </div>
      </div>
      <div className="project-header-right">
        <div className="user-profile">
          <img 
            src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face" 
            alt="Profile" 
            className="profile-image"
          />
          <span className="profile-name">{userName}</span>
        </div>
      </div>
    </header>
  );
};

export default ProjectHeader;
