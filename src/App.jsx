import axios from 'axios';
import React, { useState, useEffect } from 'react';
import './App.css';

// Vercel API routes - same domain, no CORS needed
const API_URL = '';
console.log('Using Vercel API routes - no CORS needed');

const projects = [
  { 
    id: 1, 
    name: "Create an Accessible Venue at the Brockport Welcome Center", 
    location: "11 Water Street", 
    cost: 300000, 
    totalCost: 300000, 
    description: "This project will retrofit and expand accessible outdoor seating at the Brockport Welcome Center to enhance waterfront amenities for residents and Erie Canal visitors. The work includes creating inclusive seating with waterfront views and making necessary site preparation and infrastructure improvements. These enhancements will transform the Welcome Center into a more inviting community gathering place that better serves both locals and tourists exploring the waterfront area.", 
    imagePath: "/images/project1.jpg" 
  },
  { 
    id: 2, 
    name: "Enhance the Main Street Streetscape", 
    location: "From the Canal Bridge to State Street", 
    cost: 2400000, 
    totalCost: 2400000, 
    description: "This project will revitalize Main Street's historic commercial district through the replacement of existing sidewalks, installing new street trees, and modernizing the lighting system with LED fixtures that include power connections for special events. The project will also add waste receptacles, banner poles, and bike racks to encourage cycling in the downtown area. These improvements are designed to enhance the historic commercial district's appeal and functionality for both residents and visitors.", 
    imagePath: "/images/project2.jpg" 
  },
  { 
    id: 3, 
    name: "Enhance the Clinton Street Streetscape", 
    location: "Clinton Street", 
    cost: 0, 
    totalCost: 0, 
    description: "There are two options for this project, as described below.", 
    imagePath: "/images/project3.jpg",
    hasOptions: true,
    options: [
      {
        id: "3a",
        name: "Option 1: Main Street to Utica Street",
        cost: 1200000,
        totalCost: 1200000,
        description: "This project will enhance Clinton Street from Main Street to Utica Street with wider sidewalks, improved lighting, enhanced crosswalks, landscaping, and road repaving."
      },
      {
        id: "3b", 
        name: "Option 2: Main Street to Merchant Street",
        cost: 950000,
        totalCost: 950000,
        description: "This project will enhance Clinton Street from Main Street to Merchant Street with wider sidewalks, improved lighting, enhanced crosswalks, landscaping, and road repaving."
      }
    ]
  },
  { 
    id: 4, 
    name: "Small Project Grant Fund", 
    location: "NY Forward Area", 
    cost: 300000, 
    totalCost: 400000, 
    description: "This project will establish a grant fund for small projects in the NY Forward Area, such as facade improvements and small-scale renovations. Funding may also be used to renovate multifamily housing to make it more marketable. The fund will be administered by the Village. Grant recipients will be required to provide a minimum 25% match.", 
    imagePath: "/images/project4.jpg" 
  },
  { 
    id: 5, 
    name: "Enhance Accessibility at St. Luke's Episcopal Church", 
    location: "14 State Street", 
    cost: 800000, 
    totalCost: 833000, 
    description: "This project will rehabilitate the historic St. Luke's Episcopal Church to improve accessibility to the Brockport Ecumenical Food Shelf and Clothing Center. The work includes installing a new elevator, repairing the Main Street entry stairs and ramp to ensure ADA compliance, and renovating the basement with an updated layout and moisture-proofing solutions. These enhancements will make the vital community services housed in the building more accessible to all residents who need them.", 
    imagePath: "/images/project5.jpg" 
  },
  { 
    id: 6, 
    name: "Modernize Brockport Fire Station", 
    location: "38 Market Street", 
    cost: 150000, 
    totalCost: 300000, 
    description: "This project will replace eight overhead bay doors at Station #1 with high-quality aluminum full-view doors featuring improved thermal performance and custom red paint to match department branding. These upgrades will enhance the downtown streetscape appearance while improving the station's operational efficiency, reliability, and energy performance. This work represents phase 1 of a larger beautification effort planned for Station #1.", 
    imagePath: "/images/project6.jpg" 
  },
  { 
    id: 7, 
    name: "Enhance 2 Main Street as a Canal Gateway", 
    location: "2 Main Street", 
    cost: 200000, 
    totalCost: 400000, 
    description: "This project will beautify this prominent mixed-use property to strengthen its appeal as a gateway to the canal. Improvements include upgrades to three commercial storefronts and six apartments, featuring new parking areas, roofing, siding, windows, and central air conditioning for the storefronts. The work also includes installing energy-efficient laundry facilities and adding landscaping with canal-side benches.", 
    imagePath: "/images/project7.jpg" 
  },
  { 
    id: 8, 
    name: "Revitalize Blighted Property at 41 Clark Street with New Townhomes", 
    location: "41 Clark Street", 
    cost: 800000, 
    totalCost: 4000000, 
    description: "This project will demolish a blighted single-family home and barn to make way for new residential development. The plan includes constructing 12 new townhomes, with each unit featuring 3 bedrooms, 2.5 bathrooms, and a single-car garage. The project will require both a Special Use Permit and Area Variance as part of the approval process.", 
    imagePath: "/images/project8.jpg" 
  },
  { 
    id: 9, 
    name: "Improve Accessibility at the Lift Bridge Book Shop", 
    location: "45 Main Street", 
    cost: 350000, 
    totalCost: 400000, 
    description: "This project will enhance accessibility at the Lift Bridge Book Shop by modifying the side entrance to meet ADA requirements and installing a lift to provide access to the lower level. The work includes constructing a fully accessible bathroom on the lower level. The accessibility enhancements will make it possible for the lower level to be used for community events and improve its overall appeal.", 
    imagePath: "/images/project9.jpg" 
  },
  { 
    id: 10, 
    name: "Restore Upper Floor Apartments and Facade at 46-50 Main Street", 
    location: "46-50 Main Street", 
    cost: 350000, 
    totalCost: 750000, 
    description: "This project will reconfigure the vacant third floor into three new one-bedroom apartments. The apartments will be targeted to graduate students and young professionals, addressing housing needs for this demographic. The work will also enhance the building's facade by replacing the existing 1970s vinyl siding with historically appropriate brickwork. This project builds on previously completed renovations to the first floor commercial spaces.", 
    imagePath: "/images/project10.jpg" 
  },
  { 
    id: 11, 
    name: "Develop Sustainable Mixed-Income Apartments at 60-90 Clinton Street", 
    location: "60-90 Clinton Street", 
    cost: 1500000, 
    totalCost: 8600000, 
    description: "This project will transform the vacant lot at 60-90 Clinton Street into a new 25,000-square-foot apartment building with 25 one- and two-bedroom units. The building will feature sustainable high-efficiency electric heating and cooling systems along with fully electric appliances. This development will provide high-quality, mixed-income housing options designed to serve SUNY Brockport employees, teachers, and hospital workers.", 
    imagePath: "/images/project11.jpg" 
  },
  { 
    id: 12, 
    name: "Upgrade 73 Main Street Exterior Facade", 
    location: "73 Main Street", 
    cost: 50000, 
    totalCost: 100000, 
    description: "This project will upgrade the mixed-use building at 73 Main Street by rehabilitating the exterior facade that faces the public parking lot and installing energy-efficient windows throughout the building. The work will also include replacing several exterior doors, reconfiguring the steep rear stairway for improved safety, and incorporating a mural to enhance the building's visual appeal.", 
    imagePath: "/images/project12.jpg" 
  },
  { 
    id: 13, 
    name: "Restore the Morgan Manning House Post-Fire", 
    location: "151 Main Street", 
    cost: 450000, 
    totalCost: 450000, 
    description: "This project will enhance accessibility to the museum by installing a new staircase and lift connecting to the side building entrance, along with new accessible parking spaces. Restrooms will be renovated to be ADA compliant, and enhanced security lighting will be installed. The work will also include renovating the kitchen to support events. This project complements the ongoing rehabilitation following the recent devastating fire to the building.", 
    imagePath: "/images/project13.jpg" 
  }
];

function App() {
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [remainingBudget, setRemainingBudget] = useState(4500000);
  const [comments, setComments] = useState({});
  const [showInstructions, setShowInstructions] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [sunyAffiliation, setSunyAffiliation] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const totalCost = selectedProjects.reduce((sum, projectId) => {
      // Handle regular projects
      const project = projects.find(p => p.id === parseInt(projectId));
      if (project && !project.hasOptions) {
        return sum + project.cost;
      }

      // Handle project options (like 3a, 3b)
      const optionProject = projects.find(p => p.hasOptions && p.options.some(opt => opt.id === projectId));
      if (optionProject) {
        const option = optionProject.options.find(opt => opt.id === projectId);
        return sum + option.cost;
      }

      return sum;
    }, 0);
    setRemainingBudget(4500000 - totalCost);
  }, [selectedProjects]);

  const handleProjectToggle = (projectId) => {
    setSelectedProjects(prev => {
      // For Project 3 options, ensure only one option can be selected at a time
      if (projectId === '3a' || projectId === '3b') {
        // If clicking the same option that's already selected, deselect it
        if (prev.includes(projectId)) {
          return prev.filter(id => id !== projectId);
        }
        // Otherwise, remove any existing Project 3 option and add the new one
        const filtered = prev.filter(id => id !== '3a' && id !== '3b');
        return [...filtered, projectId];
      }

      // Regular project toggle
      return prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId];
    });
  };

  const handleCommentChange = (projectId, comment) => {
    setComments(prev => ({
      ...prev,
      [projectId]: comment
    }));
  };

  const getProgressBarStyle = () => {
    const percentage = ((4500000 - remainingBudget) / 4500000) * 100;
    return {
      width: `${percentage}%`,
      backgroundColor: remainingBudget >= 0 ? '#4CAF50' : '#F44336',
    };
  };

  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  const handleNextPage = () => {
    if (sunyAffiliation) {
      setShowInstructions(false);
      setEmailError('');
      scrollToTop();
    } else {
      setEmailError('Please select your SUNY Brockport affiliation.');
    }
  };

  const handlePreviousPage = () => {
    setShowInstructions(true);
    scrollToTop();
  };

  const handleSubmit = async () => {
    if (isSubmitted) return; // Prevent multiple submissions

    // Double-check that at least one project is selected
    if (selectedProjects.length === 0) {
      alert('Please select at least one project before submitting your survey.');
      return;
    }

    // Show custom confirmation modal
    setShowConfirmModal(true);
  };

  const confirmSubmit = async () => {
    setShowConfirmModal(false);

    try {
      // Process the selected projects to handle Project 3 options explicitly
      const processedProjects = selectedProjects.map(projectId => {
        if (projectId === '3a' || projectId === '3b') {
          return {
            projectId: 3,
            option: projectId === '3a' ? 1 : 2,
            optionName: projectId === '3a' ? 'Main Street to Utica Street' : 'Main Street to Merchant Street',
            cost: projectId === '3a' ? 1200000 : 950000
          };
        }
        // For regular projects
        const project = projects.find(p => p.id === parseInt(projectId));
        return {
          projectId: parseInt(projectId),
          cost: project ? project.cost : 0
        };
      });

      const surveyData = {
        userName,
        userEmail,
        sunyAffiliation,
        selectedProjects: processedProjects,
        rawSelectedProjects: selectedProjects, // Keep original for backup
        comments
      };

      console.log('Submitting survey data:', surveyData);
      console.log('API URL:', API_URL);
      const response = await axios.post(`${API_URL}/api/submit-survey`, surveyData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Survey submission response:', response.data);
      setIsSubmitted(true);
      setShowSuccess(true);
      scrollToTop();
    } catch (error) {
      console.error('Error submitting survey:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error setting up request:', error.message);
      }
      alert(`Error submitting survey: ${error.message}. Please try again.`);
    }
  };

  const cancelSubmit = () => {
    setShowConfirmModal(false);
  };

  const renderProjectCard = (project, index) => {
    if (project.hasOptions) {
      // Special rendering for Project 3 with options
      const selectedOption = selectedProjects.find(id => id === '3a' || id === '3b');
      const isSelected = !!selectedOption;

      return (
        <div key={project.id} className={`project-card ${isSelected ? 'selected' : ''}`}>
          <div className="project-image">
            <img src={project.imagePath} alt={project.name} />
          </div>
          <div className="project-content">
            <p className="project-number">Project {index + 1} of 13</p>
            <h3>{project.name}</h3>
            <p className="project-description"><strong>Description:</strong> {project.description}</p>

            <div className="project-options">
              {project.options.map((option) => (
                <div key={option.id} className="project-option">
                  <h4>{option.name}</h4>
                  <p className="option-description">{option.description}</p>
                  <p className="project-cost"><strong>Funding Request: ${option.cost.toLocaleString()}</strong></p>
                  <p className="project-total-cost">Total Project Cost: ${option.totalCost.toLocaleString()}</p>
                  <div className="fund-checkbox">
                    <input
                      type="checkbox"
                      id={`fund-${option.id}`}
                      checked={selectedProjects.includes(option.id)}
                      onChange={() => handleProjectToggle(option.id)}
                    />
                    <label htmlFor={`fund-${option.id}`}>Fund this Option</label>
                  </div>
                </div>
              ))}
            </div>

            <textarea
              value={comments[project.id] || ''}
              onChange={(e) => handleCommentChange(project.id, e.target.value)}
              placeholder="Add your comments here..."
            />
          </div>
        </div>
      );
    }

    // Regular project rendering
    return (
      <div key={project.id} className={`project-card ${selectedProjects.includes(project.id) ? 'selected' : ''}`}>
        <div className="project-image">
          <img src={project.imagePath} alt={project.name} />
        </div>
        <div className="project-content">
          <p className="project-number">Project {index + 1} of 13</p>
          <h3>{project.name}</h3>
          <p className="project-description"><strong>Description:</strong> {project.description}</p>
          <p className="project-cost"><strong>Funding Request: ${project.cost.toLocaleString()}</strong></p>
          <p className="project-total-cost">Total Project Cost: ${project.totalCost.toLocaleString()}</p>
          <div className="fund-checkbox">
            <input
              type="checkbox"
              id={`fund-${project.id}`}
              checked={selectedProjects.includes(project.id)}
              onChange={() => handleProjectToggle(project.id)}
            />
            <label htmlFor={`fund-${project.id}`}>Fund this Project</label>
          </div>
          <textarea
            value={comments[project.id] || ''}
            onChange={(e) => handleCommentChange(project.id, e.target.value)}
            placeholder="Add your comments here..."
          />
        </div>
      </div>
    );
  };

  return (
    <div className="App">
      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Confirm Submission</h2>
            <p>Are you sure you want to submit your survey? You will not be able to make changes after submitting.</p>
            <div className="modal-buttons">
              <button className="modal-confirm-button" onClick={confirmSubmit}>
                Yes, Submit Survey
              </button>
              <button className="modal-cancel-button" onClick={cancelSubmit}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccess ? (
      <div className="success-page">
        <div className="success-content">
          <h1>Thank You!</h1>
          <h2>Your survey has been submitted successfully.</h2>
          <p>Your responses will be shared with the Local Planning Committee to help guide their decisions about which projects to recommend for funding.</p>
          <p><strong>You may now close this page.</strong></p>
        </div>
      </div>
      ) : (
        <>
          {!showInstructions && (
            <header className="sticky-header">
              <h1>Brockport NY Forward Project Funding Survey</h1>
              <div className="budget-container">
                <div className="progress-container">
                  <div className="progress-bar">
                    <div style={getProgressBarStyle()}></div>
                  </div>
                </div>
                <div className="budget-info">
                  <span><strong>Total Budget:</strong> ${(4500000).toLocaleString()}</span>
                  <span><strong>Remaining:</strong> ${remainingBudget.toLocaleString()}</span>
                </div>
                <button 
                  className={`submit-button ${isSubmitted ? 'submitted' : ''}`}
                  onClick={handleSubmit} 
                  disabled={remainingBudget < 0 || selectedProjects.length === 0 || isSubmitted}
                >
                  {isSubmitted ? 'Submitted' : 'Submit'}
                </button>
              </div>
              {remainingBudget < 0 && (
                <div className="budget-error">
                  You have exceeded the $4,500,000 budget. Please remove some projects from your selection.
                </div>
              )}
            </header>
          )}
          <main>
            {showInstructions ? (
              <div className="instructions-page">
                <div className="instructions-box">
                  <h1>Brockport NY Forward Project Funding Survey</h1>
                  <h3>Instructions</h3>
                  <p>The Village of Brockport was awarded $4,500,000 from New York State through the NY Forward program to revitalize downtown. Several projects have been proposed for potential funding. <strong>This survey gives you the opportunity to provide feedback on which projects you think would most benefit downtown Brockport.</strong></p> 
                  <p>In this survey, you will get a budget of $4,500,000 to "spend" on the proposed projects. You can choose which projects you would fund by clicking the checkbox next to each project. A progress bar at the top of the screen will automatically sum how much money you have spent, and will indicate how much money you have remaining in your budget. You will not be able to submit the survey if you spend more than $4,500,000. You can also leave comments about the proposed projects in the box provided.</p>

                  <div className="callout-box">
                    <strong className="important-text">Important:</strong> Please complete this survey in one sitting. It should take approximately 15 minutes to complete. Your progress will NOT be saved if you close or refresh this window before submitting the survey.
                  </div>
                </div>

                <div className="content-box">
                  <h3>How We Will Use This Data</h3>
                  <p>Your responses will be shared anonymously with the Local Planning Committee, which is the group that will decide which of the proposed projects to recommend to New York State for potential funding. The next meeting of the Local Planning Committee is Tuesday, October 7th at 6:00 PM at the Parish Center at Church of Nativity of the Blessed Virgin Mary (152 Main Street). This meeting is open to the public, with time reserved at the end for comments. For more information, please visit: <a href="https://www.brockportforward.com/" target="_blank" rel="noopener noreferrer">www.brockportforward.com/</a>.</p>
                </div>

                <div className="content-box">
                  <h3>Due Date</h3>
                  <p>This survey will close on Monday, September 29th at 11:59 PM.</p>
                </div>

                <div className="content-box">
                  <div className="user-input">
                    <div className="affiliation-question">
                      <label>What is your affiliation, if any, with SUNY Brockport?</label>
                      <div className="radio-options">
                        <label className="radio-option">
                          <input
                            type="radio"
                            name="sunyAffiliation"
                            value="Student"
                            checked={sunyAffiliation === 'Student'}
                            onChange={(e) => setSunyAffiliation(e.target.value)}
                          />
                          Student
                        </label>
                        <label className="radio-option">
                          <input
                            type="radio"
                            name="sunyAffiliation"
                            value="Faculty"
                            checked={sunyAffiliation === 'Faculty'}
                            onChange={(e) => setSunyAffiliation(e.target.value)}
                          />
                          Faculty
                        </label>
                        <label className="radio-option">
                          <input
                            type="radio"
                            name="sunyAffiliation"
                            value="Staff"
                            checked={sunyAffiliation === 'Staff'}
                            onChange={(e) => setSunyAffiliation(e.target.value)}
                          />
                          Staff
                        </label>
                        <label className="radio-option">
                          <input
                            type="radio"
                            name="sunyAffiliation"
                            value="Not affiliated"
                            checked={sunyAffiliation === 'Not affiliated'}
                            onChange={(e) => setSunyAffiliation(e.target.value)}
                          />
                          I am not affiliated with SUNY Brockport
                        </label>
                      </div>
                    </div>
                  </div>

                  <p className="anonymous-note">Your responses will be anonymous. Thank you for your participation.</p>

                  <button
                    className="next-button"
                    onClick={handleNextPage}
                    disabled={!sunyAffiliation}
                  >
                    Next Page
                  </button>
                  {emailError && <p className="email-error">{emailError}</p>}
                </div>
              </div>
            ) : (
              <div className="projects-list">
                {projects.map((project, index) => renderProjectCard(project, index))}
                <div className="bottom-buttons">
                  <button className="previous-button" onClick={handlePreviousPage}>Previous Page</button>
                  <button 
                    className={`bottom-submit-button ${isSubmitted ? 'submitted' : ''}`}
                    onClick={handleSubmit} 
                    disabled={remainingBudget < 0 || selectedProjects.length === 0 || isSubmitted}
                  >
                    {isSubmitted ? 'Submitted' : 'Submit'}
                  </button>
                </div>
              </div>
            )}
          </main>
          <footer className="footer">
            <div className="footer-line"></div>
            <p>Brockport NY Forward</p>
          </footer>
        </>
      )}
    </div>
  );
}

export default App;