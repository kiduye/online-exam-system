const Exam = require('../models/examModel');
const Student = require('../models/users/studentModel');

// Get performance data for a student, including performance summary and exam trends
const getStudentPerformance = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Fetch the student along with their exam history and performance summary
    const student = await Student.findById(studentId)
      .populate({
        path: 'exams',
        populate: { path: 'examId', select: 'title description' }, // Populate exam details
      });

    if (!student) {
      return res.status(404).json({ msg: 'Student not found' });
    }

    // Calculate performance trends
    const performanceTrends = student.performanceSummary.improvementTrends.map(trend => ({
      examId: trend.examId,
      score: trend.score,
      date: trend.date,
    }));

    // Return student's performance summary and exam trends
    res.json({
      averageScore: student.performanceSummary.averageScore,
      lastImprovement: student.performanceSummary.lastImprovement,
      improvementTrends: performanceTrends,
      exams: student.exams.map(exam => ({
        examTitle: exam.examId.title,
        score: exam.score,
        date: exam.createdAt,
      })),
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get improvement data for a student based on recent exams
const getStudentImprovement = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Fetch the student and their exam history
    const student = await Student.findById(studentId)
      .populate('exams')
      .select('performanceSummary exams');

    if (!student) {
      return res.status(404).json({ msg: 'Student not found' });
    }

    const exams = student.exams.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)); // Ensure exams are sorted by date

    if (exams.length < 2) {
      return res.status(400).json({ msg: 'Not enough exam data to calculate improvement' });
    }

    // Compare the latest two exams for improvement
    const latestExam = exams[exams.length - 1];
    const previousExam = exams[exams.length - 2];

    const improvement = ((latestExam.score - previousExam.score) / previousExam.score) * 100;

    // Optionally update the performance summary with the latest improvement
    student.performanceSummary.lastImprovement = improvement;
    await student.save();

    res.json({
      latestExam: {
        examTitle: latestExam.examId.title,
        score: latestExam.score,
        date: latestExam.createdAt,
      },
      previousExam: {
        examTitle: previousExam.examId.title,
        score: previousExam.score,
        date: previousExam.createdAt,
      },
      improvement: improvement.toFixed(2) + '%',
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

module.exports = {
  getStudentPerformance,
  getStudentImprovement,
};
