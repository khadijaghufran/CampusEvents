import mongoose from 'mongoose';

/**
 * Connect to MongoDB and verify connection status
 */
export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/campusevents_db';
    console.log(`⏳ Connecting to MongoDB at ${mongoUri}...`);

    const conn = await mongoose.connect(mongoUri);

    console.log('====================================================');
    console.log(`✅ SUCCESS: MongoDB Database Connected!`);
    console.log(`📌 Host: ${conn.connection.host}`);
    console.log(`📌 Port: ${conn.connection.port}`);
    console.log(`📌 Database Name: ${conn.connection.name}`);
    console.log('====================================================');
    return conn;
  } catch (error) {
    console.error('====================================================');
    console.error(`❌ FAILED: MongoDB se connect nahi ho saka!`);
    console.error(`Error details: ${error.message}`);
    console.error('👉 Make sure MongoDB service is running (Run: net start MongoDB)');
    console.error('====================================================');
    process.exit(1);
  }
};
