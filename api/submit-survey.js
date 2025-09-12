import mongoose from 'mongoose';

// MongoDB connection
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

// Survey Schema
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
  // Enable CORS for this endpoint if needed (though not necessary on Vercel)
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();
    console.log('Received survey submission:', req.body);

    const surveyData = {
      ...req.body,
      location: 'Brockport'
    };

    const newSurvey = new Survey(surveyData);
    await newSurvey.save();

    console.log('Survey saved successfully:', newSurvey);
    res.status(201).json({ message: 'Survey submitted successfully', survey: newSurvey });
  } catch (error) {
    console.error('Error submitting survey:', error);
    res.status(400).json({ 
      message: 'Error submitting survey', 
      error: error.message 
    });
  }
}