const CourseModule = require('../models/moduleModel');
const Instructor = require('../models/users/instructorModel'); // Import the Instructor model
const multer = require('multer');
const path = require('path');

// Multer setup for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory where images will be stored
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Generate unique file name
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // Limit to 5MB files
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);
    
    if (extname && mimeType) {
      return cb(null, true);
    } else {
      cb(new Error('Only .jpeg, .jpg, and .png files are allowed'));
    }
  },
});

// Export the multer upload middleware
exports.upload = upload.single('image'); // Single file upload for image field

// Create a new course module (Instructor only)
exports.createCourseModule = async (req, res) => {
  try {
    const instructorId = req.user._id; // The instructor's ID from the JWT
    const { courseId, description, overview, curriculum } = req.body;

    if (!instructorId) {
      return res.status(400).json({ message: 'Instructor ID is not provided' });
    }

    // Find the instructor and populate their courses
    const instructor = await Instructor.findById(instructorId).populate('courses');

    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found' });
    }

    // Check if the courseId exists in the instructor's courses array
    const course = instructor.courses.find(course => course._id.toString() === courseId);

    if (!course) {
      return res.status(400).json({
        message: `Instructor does not have this course assigned. Available courses: ${instructor.courses.map(c => c._id).join(', ')}`,
      });
    }

    // Create the course module with the uploaded image
    const courseModule = new CourseModule({
      courseName: course._id,  // Assign the course ID here
      image: req.file ? req.file.path : null, // Multer will handle the file path
      description,
      overview,
      instructor: instructorId,
      curriculum,
    });

    // Save the course module
    await courseModule.save();

    res.status(201).json({ message: 'Course Module created successfully', courseModule });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create Course Module', error: error.message });
  }
};



// Get all course modules for a specific instructor
// Get all course modules for a specific instructor
exports.getCourseModules = async (req, res) => {
  try {
    const instructorId = req.user._id;

    // Fetch course modules created by the instructor and populate the courseName field
    const courseModules = await CourseModule.find({ instructor: instructorId })
      .populate('courseName'); // Assuming courseName is an ObjectId referencing the Course model

    // Check if any course modules were found
    if (!courseModules.length) {
      return res.status(404).json({ message: 'No course modules found for this instructor.' });
    }

    res.status(200).json(courseModules);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch Course Modules', error: error.message });
  }
};

// Get a specific course module by ID
exports.getCourseModuleById = async (req, res) => {
  try {
    const { id } = req.params;
    const courseModule = await CourseModule.findById(id).populate('courseName');

    if (!courseModule) {
      return res.status(404).json({ message: 'Course Module not found' });
    }

    res.status(200).json(courseModule);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch Course Module', error: error.message });
  }
};

// Update a course module
exports.updateCourseModule = async (req, res) => {
  try {
    const instructorId = req.user._id; // The instructor's ID from the JWT
    const { moduleId, courseId, image, description, overview, curriculum } = req.body;

    // Validate instructorId
    if (!instructorId) {
      return res.status(400).json({ message: 'Instructor ID is not provided' });
    }

    // Log the incoming request body for debugging
    console.log("Incoming request body:", req.body);

    // Find the course module by moduleId
    const courseModule = await CourseModule.findById(moduleId);

    // Check if course module exists
    if (!courseModule) {
      return res.status(404).json({ message: 'Course Module not found' });
    }

    // Log the instructor ID for comparison
    console.log('Instructor ID from token:', instructorId);
    console.log('Instructor ID in course module:', courseModule.instructor.toString());

    // Check if the instructor is the one who created the course module
    if (courseModule.instructor.toString() !== instructorId.toString()) {
      return res.status(403).json({ message: 'You are not authorized to update this course module' });
    }

    // Optional: If courseId is provided, check if the courseId is valid
    if (courseId) {
      const instructor = await Instructor.findById(instructorId).populate('courses');
      const course = instructor.courses.find(course => course._id.toString() === courseId);

      if (!course) {
        return res.status(400).json({
          message: `Instructor does not have this course assigned. Available courses: ${instructor.courses.map(c => c._id).join(', ')}`,
        });
      }
      courseModule.courseName = course._id; // Update courseName with the new course ID
    }

    // Update other fields if provided
    if (image) courseModule.image = image;
    if (description) courseModule.description = description;
    if (overview) courseModule.overview = overview;
    if (curriculum) courseModule.curriculum = curriculum;

    // Save the updated course module
    await courseModule.save();

    res.status(200).json({ message: 'Course Module updated successfully', courseModule });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update Course Module', error: error.message });
  }
};


// Delete a course module
exports.deleteCourseModule = async (req, res) => {
  try {
    const { id } = req.params;
    const instructorId = req.user._id;

    const courseModule = await CourseModule.findById(id);

    if (!courseModule) {
      return res.status(404).json({ message: 'Course Module not found' });
    }

    // Check if the instructor is the owner of the course module
    if (courseModule.instructor.toString() !== instructorId.toString()) {
      return res.status(403).json({ message: 'You are not authorized to delete this Course Module' });
    }

    await courseModule.remove();
    res.status(200).json({ message: 'Course Module deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete Course Module', error: error.message });
  }
};

// Add a main topic to a course module
exports.addMainTopic = async (req, res) => {
  try {
    const { id } = req.params;
    const { mainTopic } = req.body;

    const courseModule = await CourseModule.findById(id);

    if (!courseModule) {
      return res.status(404).json({ message: 'Course Module not found' });
    }

    courseModule.curriculum.push({ mainTopic, subTopics: [] }); // Add main topic with empty subTopics
    await courseModule.save();

    res.status(200).json({ message: 'Main topic added successfully', courseModule });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add main topic', error: error.message });
  }
};

// Add a subtopic to a specific main topic in a course module
exports.addSubTopic = async (req, res) => {
  try {
    const { id, mainTopicId } = req.params;
    const { subTopic } = req.body;

    const courseModule = await CourseModule.findById(id);

    if (!courseModule) {
      return res.status(404).json({ message: 'Course Module not found' });
    }

    const mainTopic = courseModule.curriculum.id(mainTopicId);
    if (!mainTopic) {
      return res.status(404).json({ message: 'Main topic not found' });
    }

    mainTopic.subTopics.push({ subTopic, titles: [] }); // Add subtopic with empty titles
    await courseModule.save();

    res.status(200).json({ message: 'Subtopic added successfully', courseModule });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add subtopic', error: error.message });
  }
};

// Add a title to a specific subtopic in a course module
exports.addTitle = async (req, res) => {
  try {
    const { id, mainTopicId, subTopicId } = req.params;
    const { title, content, image } = req.body;

    const courseModule = await CourseModule.findById(id);

    if (!courseModule) {
      return res.status(404).json({ message: 'Course Module not found' });
    }

    const mainTopic = courseModule.curriculum.id(mainTopicId);
    if (!mainTopic) {
      return res.status(404).json({ message: 'Main topic not found' });
    }

    const subTopic = mainTopic.subTopics.id(subTopicId);
    if (!subTopic) {
      return res.status(404).json({ message: 'Subtopic not found' });
    }

    subTopic.titles.push({ title, content, image }); // Add title to the subtopic
    await courseModule.save();

    res.status(200).json({ message: 'Title added successfully', courseModule });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add title', error: error.message });
  }
};

// Update a main topic
exports.updateMainTopic = async (req, res) => {
  try {
    const { id, mainTopicId } = req.params;
    const { mainTopic } = req.body;

    const courseModule = await CourseModule.findById(id);

    if (!courseModule) {
      return res.status(404).json({ message: 'Course Module not found' });
    }

    const mainTopicItem = courseModule.curriculum.id(mainTopicId);
    if (!mainTopicItem) {
      return res.status(404).json({ message: 'Main topic not found' });
    }

    mainTopicItem.mainTopic = mainTopic; // Update main topic name
    await courseModule.save();

    res.status(200).json({ message: 'Main topic updated successfully', courseModule });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update main topic', error: error.message });
  }
};

// Update a subtopic
exports.updateSubTopic = async (req, res) => {
  try {
    const { id, mainTopicId, subTopicId } = req.params;
    const { subTopic } = req.body;

    const courseModule = await CourseModule.findById(id);

    if (!courseModule) {
      return res.status(404).json({ message: 'Course Module not found' });
    }

    const mainTopicItem = courseModule.curriculum.id(mainTopicId);
    if (!mainTopicItem) {
      return res.status(404).json({ message: 'Main topic not found' });
    }

    const subTopicItem = mainTopicItem.subTopics.id(subTopicId);
    if (!subTopicItem) {
      return res.status(404).json({ message: 'Subtopic not found' });
    }

    subTopicItem.subTopic = subTopic; // Update subtopic name
    await courseModule.save();

    res.status(200).json({ message: 'Subtopic updated successfully', courseModule });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update subtopic', error: error.message });
  }
};

// Update a title
exports.updateTitle = async (req, res) => {
  try {
    const { id, mainTopicId, subTopicId, titleId } = req.params;
    const { title, content, image } = req.body;

    const courseModule = await CourseModule.findById(id);

    if (!courseModule) {
      return res.status(404).json({ message: 'Course Module not found' });
    }

    const mainTopicItem = courseModule.curriculum.id(mainTopicId);
    if (!mainTopicItem) {
      return res.status(404).json({ message: 'Main topic not found' });
    }

    const subTopicItem = mainTopicItem.subTopics.id(subTopicId);
    if (!subTopicItem) {
      return res.status(404).json({ message: 'Subtopic not found' });
    }

    const titleItem = subTopicItem.titles.id(titleId);
    if (!titleItem) {
      return res.status(404).json({ message: 'Title not found' });
    }

    titleItem.title = title;
    titleItem.content = content;
    titleItem.image = image; // Update title details
    await courseModule.save();

    res.status(200).json({ message: 'Title updated successfully', courseModule });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update title', error: error.message });
  }
};

// Update a content in a title
exports.updateContent = async (req, res) => {
  try {
    const { id, mainTopicId, subTopicId, titleId } = req.params;
    const { content } = req.body; // Assuming content is sent in the body

    const courseModule = await CourseModule.findById(id);
    if (!courseModule) {
      return res.status(404).json({ message: 'Course Module not found' });
    }

    const mainTopicItem = courseModule.curriculum.id(mainTopicId);
    if (!mainTopicItem) {
      return res.status(404).json({ message: 'Main topic not found' });
    }

    const subTopicItem = mainTopicItem.subTopics.id(subTopicId);
    if (!subTopicItem) {
      return res.status(404).json({ message: 'Subtopic not found' });
    }

    const titleItem = subTopicItem.titles.id(titleId);
    if (!titleItem) {
      return res.status(404).json({ message: 'Title not found' });
    }

    titleItem.content = content; // Update content
    await courseModule.save();

    res.status(200).json({ message: 'Content updated successfully', courseModule });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update content', error: error.message });
  }
};

// Delete a content in a title
exports.deleteContent = async (req, res) => {
  try {
    const { id, mainTopicId, subTopicId, titleId } = req.params;

    const courseModule = await CourseModule.findById(id);
    if (!courseModule) {
      return res.status(404).json({ message: 'Course Module not found' });
    }

    const mainTopicItem = courseModule.curriculum.id(mainTopicId);
    if (!mainTopicItem) {
      return res.status(404).json({ message: 'Main topic not found' });
    }

    const subTopicItem = mainTopicItem.subTopics.id(subTopicId);
    if (!subTopicItem) {
      return res.status(404).json({ message: 'Subtopic not found' });
    }

    const titleItem = subTopicItem.titles.id(titleId);
    if (!titleItem) {
      return res.status(404).json({ message: 'Title not found' });
    }

    titleItem.contents.remove(); // Remove the content
    await courseModule.save();

    res.status(200).json({ message: 'Content deleted successfully', courseModule });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete content', error: error.message });
  }
};


// Delete a main topic
exports.deleteMainTopic = async (req, res) => {
  try {
    const { id, mainTopicId } = req.params;

    const courseModule = await CourseModule.findById(id);

    if (!courseModule) {
      return res.status(404).json({ message: 'Course Module not found' });
    }

    const mainTopicItem = courseModule.curriculum.id(mainTopicId);
    if (!mainTopicItem) {
      return res.status(404).json({ message: 'Main topic not found' });
    }

    mainTopicItem.remove(); // Remove the main topic
    await courseModule.save();

    res.status(200).json({ message: 'Main topic deleted successfully', courseModule });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete main topic', error: error.message });
  }
};

// Delete a subtopic
exports.deleteSubTopic = async (req, res) => {
  try {
    const { id, mainTopicId, subTopicId } = req.params;

    const courseModule = await CourseModule.findById(id);

    if (!courseModule) {
      return res.status(404).json({ message: 'Course Module not found' });
    }

    const mainTopicItem = courseModule.curriculum.id(mainTopicId);
    if (!mainTopicItem) {
      return res.status(404).json({ message: 'Main topic not found' });
    }

    const subTopicItem = mainTopicItem.subTopics.id(subTopicId);
    if (!subTopicItem) {
      return res.status(404).json({ message: 'Subtopic not found' });
    }

    subTopicItem.remove(); // Remove the subtopic
    await courseModule.save();

    res.status(200).json({ message: 'Subtopic deleted successfully', courseModule });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete subtopic', error: error.message });
  }
};

// Delete a title
exports.deleteTitle = async (req, res) => {
  try {
    const { id, mainTopicId, subTopicId, titleId } = req.params;

    const courseModule = await CourseModule.findById(id);

    if (!courseModule) {
      return res.status(404).json({ message: 'Course Module not found' });
    }

    const mainTopicItem = courseModule.curriculum.id(mainTopicId);
    if (!mainTopicItem) {
      return res.status(404).json({ message: 'Main topic not found' });
    }

    const subTopicItem = mainTopicItem.subTopics.id(subTopicId);
    if (!subTopicItem) {
      return res.status(404).json({ message: 'Subtopic not found' });
    }

    const titleItem = subTopicItem.titles.id(titleId);
    if (!titleItem) {
      return res.status(404).json({ message: 'Title not found' });
    }

    titleItem.remove(); // Remove the title
    await courseModule.save();

    res.status(200).json({ message: 'Title deleted successfully', courseModule });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete title', error: error.message });
  }
};


// Get all course modules without authentication
exports.getAllCourseModules = async (req, res) => {
  try {
    const courseModules = await CourseModule.find()
      .populate('courseName') // Populate course details if needed
      .populate('instructor') // Populate instructor details
      .exec();
    res.status(200).json(courseModules);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching course modules', error });
  }
};

// Public: Get a specific course module by ID
exports.getCourseModuleStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const courseModule = await CourseModule.findById(id).populate('courseName');

    if (!courseModule) {
      return res.status(404).json({ message: 'Course Module not found' });
    }

    res.status(200).json(courseModule);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch Course Module', error: error.message });
  }
};
