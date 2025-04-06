const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
// const fileUpload = require("express-fileupload");
const reportRoutes = require("./routes/reportRoutes");
// const audioRoutes = require("./multer/voiceMulter")
require("dotenv").config();

const cookieParser = require('cookie-parser');


const multer = require('multer');
const cloudinary = require('cloudinary').v2;
// const { CloudinaryStorage } = require('multer-storage-cloudinary');



const { checkForAuthenticatioCookie } = require('./middlewares/auth');
const adminRouter = require("./routes/adminRoutes");
const notificationRoute = require("./routes/notificationRoutes");
const userRoutes = require('./routes/userRoutes')

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(checkForAuthenticatioCookie("token"));
app.use(cookieParser());


app.use("/report", reportRoutes);
app.use('/admin', adminRouter)
app.use("/notifications", notificationRoute);
app.use("/user", userRoutes);
// app.use("/audio", audioRoutes);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Connection Error:", err));



// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Temporary storage for debugging purposes
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  }
});

// Route for audio upload
app.post('/api/upload-audio', upload.single('audio'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No audio file uploaded' });
    }

    console.log('File received:', {
      fieldname: req.file.fieldname,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    });

    // Upload to Cloudinary using the buffer
    cloudinary.uploader.upload_stream(
      {
        resource_type: 'auto',
        folder: 'recorded_audio',
        public_id: `audio_${Date.now()}`,
        format: 'webm'
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary error:', error);
          return res.status(500).json({
            message: 'Error uploading to Cloudinary',
            error: error
          });
        }

        return res.status(200).json({
          message: 'Audio uploaded successfully',
          audioData: {
            path: result.secure_url,
            format: result.format,
            size: result.bytes,
            resource_type: result.resource_type
          }
        });
      }
    ).end(req.file.buffer);

  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({
      message: 'Error processing audio upload',
      error: error.message
    });
  }
});


// // Route for image upload
// app.post('/api/upload-image', upload.single('image'), (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: 'No image file uploaded' });
//     }

//     // Upload to Cloudinary
//     cloudinary.uploader.upload_stream(
//       {
//         resource_type: 'image',
//         folder: 'incident_images',
//         public_id: `image_${Date.now()}`
//       },
//       (error, result) => {
//         if (error) {
//           console.error('Cloudinary error:', error);
//           return res.status(500).json({
//             message: 'Error uploading image to Cloudinary',
//             error
//           });
//         }

//         return res.status(200).json({
//           message: 'Image uploaded successfully',
//           imageData: {
//             url: result.secure_url,
//             format: result.format,
//             width: result.width,
//             height: result.height,
//             resource_type: result.resource_type
//           }
//         });
//       }
//     ).end(req.file.buffer);

//   } catch (error) {
//     console.error('Upload error:', error);
//     return res.status(500).json({
//       message: 'Error processing image upload',
//       error: error.message
//     });
//   }
// });

app.post('/api/upload-images', upload.array('images', 5), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No image files uploaded' });
    }

    const uploadPromises = req.files.map(file => {
      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: 'image',
            folder: 'incident_images',
            public_id: `image_${Date.now()}_${Math.floor(Math.random() * 1000)}`
          },
          (error, result) => {
            if (error) {
              console.error('Cloudinary error:', error);
              reject(error);
            } else {
              resolve({
                url: result.secure_url,
                format: result.format,
                width: result.width,
                height: result.height,
                resource_type: result.resource_type
              });
            }
          }
        ).end(file.buffer);
      });
    });

    Promise.all(uploadPromises)
      .then(imageDataArray => {
        return res.status(200).json({
          message: 'Images uploaded successfully',
          imageData: imageDataArray
        });
      })
      .catch(error => {
        console.error('Error uploading images:', error);
        return res.status(500).json({
          message: 'Error uploading images to Cloudinary',
          error
        });
      });

  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({
      message: 'Error processing image uploads',
      error: error.message
    });
  }
});



// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'Server is running' });
});



app.listen(PORT, () => console.log(`Server running on port ${PORT}`));




