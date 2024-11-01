const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');

require('dotenv').config();

// Import your route files
const authRoutes = require('./routes/users/authRoutes');
const adminRoutes = require('./routes/users/adminRoute');
const studentRoutes = require('./routes/users/studentRoute');
const instructorRoutes = require('./routes/users/instructorRoute');
const superAdminRoutes = require('./routes/users/superAdminRoute');
const departmentBoardRoutes = require('./routes/users/departmentBoardRoute');
const questionRoutes = require('./routes/questionRoute');
const notificationRoutes = require('./routes/notificationRoute');
const performanceRoutes = require('./routes/performanceRoute');
const uploadMaterialRoutes = require('./routes/materialRoute');
const courseNameRoutes = require('./routes/addCourseNameRoute');
const departmentRoutes = require('./routes/manageDepartmentRoute'); 
const examRoutes = require('./routes/examRoute');
const profileRoutes = require('./routes/profileRoute');
const enrollmentTypeRoutes = require('./routes/enrollmentTypeRoute');
const scheduledExamRoutes = require('./routes/scheduleRoute');
const examResponseRoutes = require('./routes/examResponseRoute');
const examResultRoutes = require('./routes/examResultRoute');
const courseModuleRoutes = require('./routes/moduleRoute');
const courseStudentModuleRoutes = require('./routes/studentGetModuleRoute')
const app = express();
const PORT = process.env.PORT || 5000;

// Define allowed origins for CORS
const allowedOrigins = [
  'http://localhost:5173', // React app
  'http://127.0.0.1:5173'
  // 'http://localhost:59431', // Flutter web app or any other front-end
  // 'http://192.168.137.13:61531'
  // Add any additional origins you want to allow
];


app.use(cors({
  origin: function (origin, callback) {
    console.log(`CORS Request from: ${origin}`); // Log the incoming origin
    // Allow requests with no origin (like mobile apps)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true); // Allow the request
    } else {
      console.error(`CORS error: Origin ${origin} not allowed`); // Log the error
      callback(new Error('Not allowed by CORS')); // Reject the request
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  credentials: true // Allow credentials (cookies, authorization headers)
}));


// Middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/uploads', express.static('uploads')); // Serve uploaded files

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/instructors', instructorRoutes);
app.use('/api/superAdmin', superAdminRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/departmentboards', departmentBoardRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/notifications', notificationRoutes); 
app.use('/api/performance', performanceRoutes);
app.use('/api/materials', uploadMaterialRoutes);
app.use('/api/courses', courseNameRoutes); // Course routes
app.use('/api/exams', examRoutes);
app.use('/api/exam-responses', examResponseRoutes)
app.use('/api', profileRoutes);
app.use('/api/enrollment-types', enrollmentTypeRoutes);
app.use('/api/scheduledExams', scheduledExamRoutes);
app.use('/api', examResultRoutes);// Connect to MongoDB
app.use('/api/module', courseModuleRoutes);
app.use('/api/courseModule', courseStudentModuleRoutes);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((error) => console.error('MongoDB connection error:', error));

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
