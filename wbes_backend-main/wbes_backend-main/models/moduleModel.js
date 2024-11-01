// models/CourseModule.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Curriculum Schema with optional image in the titles array
const TitleSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String } // Optional image URL or file path
});

const SubTopicSchema = new Schema({
  subTopic: { type: String, required: true },
  titles: [TitleSchema] // Array of titles under the subtopic
});

const CurriculumSchema = new Schema({
  mainTopic: {
    type: String,
    required: true,
  },
  subTopics: [SubTopicSchema] // Array of subtopics under the main topic
});

// CourseModule Schema
const CourseModuleSchema = new Schema({
  courseName: {
    type: Schema.Types.ObjectId,
    ref: 'Course', // Assuming a course model is present
    required: true,
  },
  image: {
    type: String,
    required: true, // Image for the course module
  },
  description: {
    type: String,
    required: true,
  },
  overview: {
    type: String,
    required: true,
  },
  instructor: {
    type: Schema.Types.ObjectId,
    ref: 'Instructor',
    required: true,
  },
  curriculum: [CurriculumSchema], // Array of curriculum structures
}, { timestamps: true });

module.exports = mongoose.model('CourseModule', CourseModuleSchema);
