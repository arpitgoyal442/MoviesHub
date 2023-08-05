import mongoose from "mongoose"

const connectDB = async () => {

  let mongo_url=process.env.NEXT_PUBLIC_MONGODB_URL

  try {
    await mongoose.connect(mongo_url);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
    
  }
};

export default connectDB