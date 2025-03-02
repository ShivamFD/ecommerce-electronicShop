// // import express from 'express';import { body, check } from 'express-validator';
// // import multer from 'multer';
// // import validateRequest from '../middleware/validator.js';

// // const router = express.Router();

// // const storage = multer.diskStorage({
// //   destination: (req, file, cb) => {
// //     cb(null, 'uploads');
// //   },
// //   filename: (req, file, cb) => {
// //     cb(null, `${file.fieldname}-${file.originalname}`);
// //   }
// // });

// // const fileFilter = (req, file, cb) => {
// //     if (
// //     file.mimetype === 'image/png' ||
// //     file.mimetype === 'image/jpg' ||
// //     file.mimetype === 'image/jpeg'
// //   ) {
// //     // To accept the file pass `true`, like so:
// //     cb(null, true);
// //   } else {
// //         // To reject this file pass `false`, like so:
// //     cb('Images only!');
// //   }
// // };

// // const upload = multer({ storage, fileFilter }).single('image');

// // router.post('/', upload, (req, res) => {
// //   if (!req.file)
// //     throw res.status(400).json({error: 'No file uploaded'});

// //   res.send({
// //     message: 'Image uploaded',
// //     imageUrl: `/${req.file.path}`
// //   });
// // });

// // export default router;

// import express from 'express';
// import multer from 'multer';
// import path from 'path';
// import fs from 'fs';

// // Use import.meta.url to simulate __dirname
// const __dirname = path.dirname(new URL(import.meta.url).pathname);

// // Ensure the 'uploads' folder exists in the root directory
// // const uploadDir = path.join(__dirname, '..', 'uploads');
// // if (!fs.existsSync(uploadDir)) {
// //   fs.mkdirSync(uploadDir, { recursive: true });
// // }

// const uploadDir = path.join(__dirname, '../uploads');
// if (!fs.existsSync(uploadDir)) {
//     fs.mkdirSync(uploadDir, { recursive: true });
// }

// const router = express.Router();

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadDir);  // Saving in the 'uploads' folder in the root
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${file.fieldname}-${Date.now()}-${file.originalname}`);
//   }
// });

// const fileFilter = (req, file, cb) => {
//   if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
//     cb(null, true);
//   } else {
//     cb(new Error('Images only!'), false);  // Rejecting non-image files
//   }
// };

// const upload = multer({ storage, fileFilter }).single('image');

// router.post('/', upload, (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ error: 'No file uploaded' });
//   }

//   res.send({
//     message: 'Image uploaded',
//     imageUrl: `/uploads/${req.file.filename}`  // Sending the correct path to the uploaded file
//   });
// });

// export default router;


import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Ensure the 'uploads' directory exists
const uploadDir = path.join(process.cwd(), 'backend', 'uploads'); 

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Debugging: Check the actual path being used
console.log("Uploads directory:", uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);  // Saving in the 'uploads' folder in the backend
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}-${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
    cb(null, true);
  } else {
    cb(new Error('Only PNG, JPG, and JPEG files are allowed!'), false);
  }
};

const upload = multer({ storage, fileFilter }).single('image');

router.post('/', upload, (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  res.send({
    message: 'Image uploaded successfully!',
    imageUrl: `/uploads/${req.file.filename}`  // Correct file path
  });
});

export default router;


// import express from "express";
// import multer from "multer";
// import fs from "fs";
// import path from "path";

// const router = express.Router();

// // Ensure correct path resolution
// const uploadDir = path.resolve(__dirname, "../uploads");

// // Check if the directory exists, if not, create it
// if (!fs.existsSync(uploadDir)) {
//   try {
//     fs.mkdirSync(uploadDir, { recursive: true });
//     console.log("Uploads directory created successfully.");
//   } catch (error) {
//     console.error("Error creating uploads directory:", error);
//   }
// }

// // Multer Storage Configuration
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadDir); // Save files in 'uploads' folder
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${file.fieldname}-${Date.now()}-${file.originalname}`);
//   }
// });

// // File Filter for Images Only
// const fileFilter = (req, file, cb) => {
//   if (["image/png", "image/jpg", "image/jpeg"].includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only image files are allowed!"), false);
//   }
// };

// // Multer Middleware
// const upload = multer({ storage, fileFilter }).single("image");

// // Upload Route
// router.post("/", (req, res) => {
//   upload(req, res, (err) => {
//     if (err) {
//       return res.status(400).json({ error: err.message });
//     }
//     if (!req.file) {
//       return res.status(400).json({ error: "No file uploaded" });
//     }
//     res.json({
//       message: "Image uploaded successfully",
//       imageUrl: `/uploads/${req.file.filename}` // Correct file path
//     });
//   });
// });

// export default router;
