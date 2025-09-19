import mongoose from 'mongoose';

// MongoDB connection (same as submit-survey.js)
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };
    cached.promise = mongoose.connect(process.env.MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
  return cached.conn;
}

// Updated Survey Schema (same as updated submit-survey.js)
const surveySchema = new mongoose.Schema({
  userName: String,
  userEmail: String,
  sunyAffiliation: String,
  selectedProjects: [{
    projectId: Number,
    cost: Number,
    option: { type: Number, required: false }, // For Project 3 options (1 or 2)
    optionName: { type: String, required: false } // For Project 3 option names
  }],
  rawSelectedProjects: [mongoose.Schema.Types.Mixed], // Backup of original format
  comments: Object,
  submittedAt: { type: Date, default: Date.now },
  location: { type: String, default: 'Brockport' }
});

const Survey = mongoose.models.BrockportSurvey || mongoose.model('BrockportSurvey', surveySchema);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();

    const totalSurveys = await Survey.countDocuments({ location: 'Brockport' });
    const projectSelections = {};
    const project3OptionStats = { option1: 0, option2: 0, neither: 0 };
    const sunyAffiliationStats = {};
    const projectSelectionsByAffiliation = {};
    const project3OptionsByAffiliation = {};

    const surveys = await Survey.find({ location: 'Brockport' });

    surveys.forEach(survey => {
      let hasProject3Selection = false;
      const affiliation = survey.sunyAffiliation || 'Unknown';

      // Initialize affiliation tracking if not exists
      if (!projectSelectionsByAffiliation[affiliation]) {
        projectSelectionsByAffiliation[affiliation] = {};
      }
      if (!project3OptionsByAffiliation[affiliation]) {
        project3OptionsByAffiliation[affiliation] = { option1: 0, option2: 0, neither: 0 };
      }

      // Count project selections from enhanced data structure
      if (survey.selectedProjects && Array.isArray(survey.selectedProjects)) {
        survey.selectedProjects.forEach(project => {
          const projectId = project.projectId;

          // Regular project counting
          if (projectSelections[projectId]) {
            projectSelections[projectId]++;
          } else {
            projectSelections[projectId] = 1;
          }

          // Count by affiliation
          if (projectSelectionsByAffiliation[affiliation][projectId]) {
            projectSelectionsByAffiliation[affiliation][projectId]++;
          } else {
            projectSelectionsByAffiliation[affiliation][projectId] = 1;
          }

          // Special handling for Project 3 options
          if (projectId === 3) {
            hasProject3Selection = true;
            if (project.option === 1) {
              project3OptionStats.option1++;
              project3OptionsByAffiliation[affiliation].option1++;
            } else if (project.option === 2) {
              project3OptionStats.option2++;
              project3OptionsByAffiliation[affiliation].option2++;
            }
          }
        });
      }

      // Fallback: if new structure doesn't exist, try to process rawSelectedProjects
      else if (survey.rawSelectedProjects && Array.isArray(survey.rawSelectedProjects)) {
        survey.rawSelectedProjects.forEach(projectId => {
          if (typeof projectId === 'number') {
            // Regular project
            if (projectSelections[projectId]) {
              projectSelections[projectId]++;
            } else {
              projectSelections[projectId] = 1;
            }

            // Count by affiliation
            if (projectSelectionsByAffiliation[affiliation][projectId]) {
              projectSelectionsByAffiliation[affiliation][projectId]++;
            } else {
              projectSelectionsByAffiliation[affiliation][projectId] = 1;
            }
          } else if (projectId === '3a') {
            hasProject3Selection = true;
            if (projectSelections[3]) {
              projectSelections[3]++;
            } else {
              projectSelections[3] = 1;
            }
            if (projectSelectionsByAffiliation[affiliation][3]) {
              projectSelectionsByAffiliation[affiliation][3]++;
            } else {
              projectSelectionsByAffiliation[affiliation][3] = 1;
            }
            project3OptionStats.option1++;
            project3OptionsByAffiliation[affiliation].option1++;
          } else if (projectId === '3b') {
            hasProject3Selection = true;
            if (projectSelections[3]) {
              projectSelections[3]++;
            } else {
              projectSelections[3] = 1;
            }
            if (projectSelectionsByAffiliation[affiliation][3]) {
              projectSelectionsByAffiliation[affiliation][3]++;
            } else {
              projectSelectionsByAffiliation[affiliation][3] = 1;
            }
            project3OptionStats.option2++;
            project3OptionsByAffiliation[affiliation].option2++;
          }
        });
      }

      // Count surveys that didn't select any Project 3 option
      if (!hasProject3Selection) {
        project3OptionStats.neither++;
        project3OptionsByAffiliation[affiliation].neither++;
      }

      // Count SUNY affiliation stats
      if (survey.sunyAffiliation) {
        if (sunyAffiliationStats[survey.sunyAffiliation]) {
          sunyAffiliationStats[survey.sunyAffiliation]++;
        } else {
          sunyAffiliationStats[survey.sunyAffiliation] = 1;
        }
      }
    });

    // Calculate percentages for each project
    const projectSelectionPercentages = {};
    Object.keys(projectSelections).forEach(projectId => {
      projectSelectionPercentages[projectId] = totalSurveys > 0 
        ? Math.round((projectSelections[projectId] / totalSurveys) * 100)
        : 0;
    });

    // Calculate Project 3 option percentages
    const project3OptionPercentages = {
      option1: totalSurveys > 0 ? Math.round((project3OptionStats.option1 / totalSurveys) * 100) : 0,
      option2: totalSurveys > 0 ? Math.round((project3OptionStats.option2 / totalSurveys) * 100) : 0,
      neither: totalSurveys > 0 ? Math.round((project3OptionStats.neither / totalSurveys) * 100) : 0
    };

    // Calculate percentages by affiliation
    const projectSelectionPercentagesByAffiliation = {};
    const project3OptionPercentagesByAffiliation = {};

    Object.keys(sunyAffiliationStats).forEach(affiliation => {
      const affiliationTotal = sunyAffiliationStats[affiliation];

      // Calculate project percentages for this affiliation
      projectSelectionPercentagesByAffiliation[affiliation] = {};
      if (projectSelectionsByAffiliation[affiliation]) {
        Object.keys(projectSelectionsByAffiliation[affiliation]).forEach(projectId => {
          const count = projectSelectionsByAffiliation[affiliation][projectId];
          projectSelectionPercentagesByAffiliation[affiliation][projectId] = 
            Math.round((count / affiliationTotal) * 100);
        });
      }

      // Calculate Project 3 option percentages for this affiliation
      if (project3OptionsByAffiliation[affiliation]) {
        project3OptionPercentagesByAffiliation[affiliation] = {
          option1: Math.round((project3OptionsByAffiliation[affiliation].option1 / affiliationTotal) * 100),
          option2: Math.round((project3OptionsByAffiliation[affiliation].option2 / affiliationTotal) * 100),
          neither: Math.round((project3OptionsByAffiliation[affiliation].neither / affiliationTotal) * 100)
        };
      }
    });

    res.json({
      totalSurveys,
      projectSelections,
      projectSelectionPercentages,
      project3OptionStats,
      project3OptionPercentages,
      sunyAffiliationStats,
      projectSelectionsByAffiliation,
      projectSelectionPercentagesByAffiliation,
      project3OptionsByAffiliation,
      project3OptionPercentagesByAffiliation
    });

  } catch (error) {
    console.error('Error getting survey stats:', error);
    res.status(500).json({ 
      message: 'Error getting survey stats', 
      error: error.message 
    });
  }
}