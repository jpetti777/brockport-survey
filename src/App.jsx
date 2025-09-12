import axios from 'axios';
import React, { useState, useEffect } from 'react';
import './App.css';

// Vercel API routes - same domain, no CORS needed
const API_URL = '';
console.log('Using Vercel API routes - no CORS needed');

const projects = [
  { id: 1, name: "Main Street & Church Street Enhancements", location: "Main Street & Church Street", cost: 500000, totalCost: 500000, description: "This project will enhance and beautify Main Street and Church Street with new amenities, including benches, planter boxes, hanging planters, and trash/recycling receptacles. This project will also take steps to improve pedestrian and vehicular safety through enhanced crosswalk treatments and the installation of a landscaped median on a portion of Main Street.", imagePath: "/images/project1.jpg" },
  { id: 2, name: "Exchange Street \"Festival Street\"", location: "Exchange Street, from Main Street to parking lot entry", cost: 500000, totalCost: 500000, description: "This project will raise a portion of Exchange Street to curb-level to make the street more pedestrian-friendly and easier to temporarily close for festivals and events. Additional amenities will be installed including benches, planters, string lights, and a gateway feature that identifies Exchange Street as a unique community space.", imagePath: "/images/project2.jpg" },
  { id: 3, name: "Exchange Street Parking Lot Enhancements", location: "Exchange Street Parking Lot", cost: 1000000, totalCost: 1000000, description: "This project will enhance the Exchange Street parking lot with landscaped islands to make it more inviting and aesthetically pleasing. In addition, a small area in the rear of the parking lot will be formalized as the \"Harvest Host\" area, with amenities including benches, trash receptacles, and electrical hookups that will allow for overnight RV parking in this area.", imagePath: "/images/project3.jpg" },
  { id: 4, name: "Crooked Bridge Park Improvements", location: "Crooked Bridge Park", cost: 1000000, totalCost: 1000000, description: "This project will activate Crooked Bridge Park with the addition of an ADA-accessible walkway to Flint Creek, a small pavilion, and an area for kayakers to safely exit the creek.", imagePath: "/images/project4.jpg" },
  { id: 5, name: "Wayfinding & Downtown Branding", location: "NY Forward Area", cost: 300000, totalCost: 300000, description: "This project will install a system of directional, informational, and interpretive signage at key locations and destinations to guide visitors throughout downtown Brockport. This project will also develop a new brand and marketing strategy to attract residents, visitors, and businesses to Brockport.", imagePath: "/images/project5.jpg" },
  { id: 6, name: "Small Project Grant Fund", location: "NY Forward Area", cost: 600000, totalCost: 780000, description: "This project will create a matching grant fund for small projects in the NY Forward Area, such as facade improvements, renovations to commercial and mixed-use buildings, and business assistance. Grant recipients will be required to provide a minimum 25% match.", imagePath: "/images/project6.jpg" },
  { id: 7, name: "Library Entry Upgrades & Reading Garden", location: "Brockport Library", cost: 500000, totalCost: 500000, description: "This project will formalize the rear entry to the Brockport Library so that it is more visible to the community and also ADA-accessible. In addition, a small reading garden will be created outside the rear entry to create a quiet space for reflection.", imagePath: "/images/project7.jpg" },
  { id: 8, name: "Brockport Community Center Multi-Purpose Space", location: "Brockport Community Center", cost: 1500000, totalCost: 1500000, description: "This project will reconfigure the existing Brockport Community Center cafeteria and kitchen to create a multi-purpose space, with a stage for performances, teaching kitchen, flexible community space, and outdoor plaza area.", imagePath: "/images/project8.jpg" },
  { id: 9, name: "Memorial Park Accessibility Improvements & Upgrades", location: "Memorial Park", cost: 100000, totalCost: 100000, description: "This project will create accessible access to Memorial Park by extending the existing sidewalk from the Flint Creek bridge to the west entry of the memorial. Additional enhancements will include landscaging, lighting, and joint re-pointing.", imagePath: "/images/project9.jpg" },
  { id: 10, name: "Town Hall Outdoor Space Enhancements", location: "Town Hall", cost: 250000, totalCost: 250000, description: "This project will enhance the greenspace on the east-side of Town Hall with seating, landscaping, and a walkway connecting Main Street to the rear parking lot. The greenspace will feature a flagpole, the bell from the firehouse, and a commemorative plaque. In addition, this project will enhance the comfort and safety of the alleyway on the west-side of Town Hall with string lights, a unique pavement treatment, and other amenities.", imagePath: "/images/project10.jpg" },
  { id: 11, name: "Historic Downtown Building Renovation", location: "90 Main Street", cost: 950000, totalCost: 1500000, description: "This project will reactive a historic downtown building as a downtown anchor with unique commercial and residential options. NY Forward funding will be used to completely restore the first floor, including creating restaurant, retail, and community spaces, and creating outdoor seating areas. Funding from other sources will be used to convert the upper floors into apartments.", imagePath: "/images/project11.jpg" },
  { id: 12, name: "92-98 Main Street Upgrades", location: "92-98 Main Street", cost: 250000, totalCost: 300000, description: "This project will transform vacant commercial space at 92-98 Main Street into rentable commercial space. The project will also upgrade the apartments and other commercial spaces in the building. All units will be equipped with new HVAC and electrical systems, the commercial units will get new doors, and foundation work will be completed in the basement.", imagePath: "/images/project12.jpg" },
  { id: 13, name: "Creekside Event Venue", location: "2-10 Flint Street", cost: 100000, totalCost: 180000, description: "This project will make structural improvements to stabilize the building at 2-10 Flint Street. The facade of the building will also be enhanced with paint and carpentry work. The future vision for the building is to transform the upper floors into a unique event venue for functions like performances, concerts, and weddings.", imagePath: "/images/project13.jpg" },
  { id: 14, name: "114 Main Street Enhancements", location: "114 Main Street", cost: 150000, totalCost: 206000, description: "As part of this project, local businesses will receive new bay windows, ADA-accessible front entries, and new awnings. Plumbing and electrical systems will be installed to support expanded programming opportunities. Currently vacant upper floors will be out-fit with electric, water, and egress to support the conversion of these spaces into studio apartments. The building facade will also be enhanced with fresh paint and brick restoration.", imagePath: "/images/project14.jpg" },
  { id: 15, name: "Local Business Enhancement Project", location: "3 Church Street", cost: 150000, totalCost: 225000, description: "This project will enhance local business spaces with new amenities, including outdoor seating areas, improved accessibility, and enhanced facades. The project will also support the creation of unique gathering spaces that serve both residents and visitors. The front facade of participating buildings will be restored to their historic appearance, with new paint, awnings, brick work, and business signage.", imagePath: "/images/project15.jpg" },
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
    const totalCost = selectedProjects.reduce((sum, id) => sum + projects.find(p => p.id === id).cost, 0);
    setRemainingBudget(4500000 - totalCost);
  }, [selectedProjects]);

  const handleProjectToggle = (projectId) => {
    setSelectedProjects(prev =>
      prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
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
    if (userEmail.includes('@') && sunyAffiliation) {
      setShowInstructions(false);
      setEmailError('');
      scrollToTop();
    } else {
      if (!userEmail.includes('@')) {
        setEmailError('Please enter a valid email address.');
      } else if (!sunyAffiliation) {
        setEmailError('Please select your SUNY Brockport affiliation.');
      }
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
      const surveyData = {
        userName,
        userEmail,
        sunyAffiliation,
        selectedProjects,
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
      alert(`Error submitting survey: ${error.message}. Please contact BrockportNYForward@gmail.com for assistance.`);
    }
  };

  const cancelSubmit = () => {
    setShowConfirmModal(false);
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
          <p><strong>Coming Up:</strong> Please join us for the next meeting of the Local Planning Committee on Wednesday, September 24th at 6:00 PM at the Village Offices Meeting Room. This meeting is open to the public, with time reserved at the end for comments. For more information, please visit: <a href="https://villageofbrockport.org/brockport-forward" target="_blank" rel="noopener noreferrer">https://villageofbrockport.org/brockport-forward</a>.</p>
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
                <h1>Brockport NY Forward Project Funding Survey</h1>
                <h3>Instructions</h3>
                <p>The Village of Brockport was awarded $4,500,000 from New York State through the NY Forward program to revitalize downtown. Several projects have been proposed for potential funding. <strong>This survey gives you the opportunity to provide feedback on which projects you think would most benefit downtown Brockport.</strong></p> 
                <p>In this survey, you will get a budget of $4,500,000 to "spend" on the proposed projects. You can choose which projects you would fund by clicking the checkbox next to each project. A progress bar at the top of the screen will automatically sum how much money you have spent, and will indicate how much money you have remaining in your budget. You will not be able to submit the survey if you spend more than $4,500,000. You can also leave comments about the proposed projects in the box provided.</p>

                <div className="callout-box">
                  <strong className="important-text">Important:</strong> Please complete this survey in one sitting. It should take approximately 15 minutes to complete. Your progress will NOT be saved if you close or refresh this window before submitting the survey.
                </div>

                <h3>How We Will Use This Data</h3>
                <p>Your responses will be shared anonymously with the Local Planning Committee, which is the group that will decide which of the proposed projects to recommend to New York State for potential funding. The next meeting of the Local Planning Committee is Wednesday, September 24th at 6:00 PM at the Village Offices Meeting Room. This meeting is open to the public, with time reserved at the end for comments. For more information, please visit: <a href="https://villageofbrockport.org/brockport-forward" target="_blank" rel="noopener noreferrer">https://villageofbrockport.org/brockport-forward</a>.</p>

                <h3>Due Date</h3>
                <p>This survey will close on Wednesday, September 17th at 11:59 PM.</p>

                <div className="user-input">
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                  />

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

                <p className="anonymous-note">Your responses will be anonymous. Your email will not be saved. We only ask for this information to prevent duplicate responses. Thank you for your participation.</p>

                <button
                  className="next-button"
                  onClick={handleNextPage}
                  disabled={!userName || !userEmail || !sunyAffiliation}
                >
                  Next Page
                </button>
                {emailError && <p className="email-error">{emailError}</p>}
              </div>
            ) : (
              <div className="projects-list">
                {projects.map((project, index) => (
                  <div key={project.id} className={`project-card ${selectedProjects.includes(project.id) ? 'selected' : ''}`}>
                    <div className="project-image">
                      <img src={project.imagePath} alt={project.name} />
                    </div>
                    <div className="project-content">
                      <p className="project-number">Project {index + 1} of 15</p>
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
                ))}
                <button className="previous-button" onClick={handlePreviousPage}>Previous Page</button>
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