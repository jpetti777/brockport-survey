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
  selectedProjects: [Number],
  comments: Object,
  submittedAt: { type: Date, default: Date.now },
  location: { type: String, default: 'Phelps' }
});

const Survey = mongoose.models.PhelpsSurvey || mongoose.model('PhelpsSurvey', surveySchema);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();

    const totalSurveys = await Survey.countDocuments({ location: 'Phelps' });
    const projectSelections = {};

    const surveys = await Survey.find({ location: 'Phelps' });

    surveys.forEach(survey => {
      survey.selectedProjects.forEach(projectId => {
        if (projectSelections[projectId]) {
          projectSelections[projectId]++;
        } else {
          projectSelections[projectId] = 1;
        }
      });
    });

    res.json({
      totalSurveys,
      projectSelections
    });
  } catch (error) {
    console.error('Error getting survey stats:', error);
    res.status(500).json({ 
      message: 'Error getting survey stats', 
      error: error.message 
    });
  }
}