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

// Survey Schema (same as submit-survey.js)
const surveySchema = new mongoose.Schema({
  userName: String,
  userEmail: String,
  sunyAffiliation: String,
  selectedProjects: [Number],
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
    const sunyAffiliationStats = {};

    const surveys = await Survey.find({ location: 'Brockport' });

    surveys.forEach(survey => {
      // Count project selections
      survey.selectedProjects.forEach(projectId => {
        if (projectSelections[projectId]) {
          projectSelections[projectId]++;
        } else {
          projectSelections[projectId] = 1;
        }
      });

      // Count SUNY affiliation stats
      if (survey.sunyAffiliation) {
        if (sunyAffiliationStats[survey.sunyAffiliation]) {
          sunyAffiliationStats[survey.sunyAffiliation]++;
        } else {
          sunyAffiliationStats[survey.sunyAffiliation] = 1;
        }
      }
    });

    res.json({
      totalSurveys,
      projectSelections,
      sunyAffiliationStats
    });
  } catch (error) {
    console.error('Error getting survey stats:', error);
    res.status(500).json({ 
      message: 'Error getting survey stats', 
      error: error.message 
    });
  }
}