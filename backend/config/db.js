// // import mongoose from 'mongoose';

// // const connectDB = async () => {
// //   try {
// //     const connection = await mongoose.connect(process.env.MONGO_URI);
// //     // console.log(
// //     //   `MongoDB connected successfully on host: ${connection.connection.host}, database: ${connection.connection.db.databaseName}`
// //     // );
// //     return connection;
// //   } catch (error) {
// //     console.error(`MongoDB connection error: ${error.message}`);
// //     process.exit(1);
// //   }
// // };

// // export default connectDB;
// import mongoose from 'mongoose';
// import dotenv from 'dotenv';

// dotenv.config();  // Load environment variables from .env file

// const connectDB = async () => {
//   try {
//     const connection = await mongoose.connect(process.env.MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log(`MongoDB connected: ${connection.connection.host}`);
//   } catch (error) {
//     console.error(`MongoDB connection error: ${error.message}`);
//     process.exit(1);
//   }
// };

// export default connectDB;
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();  // Load environment variables from .env file

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);  // No need for deprecated options
    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
