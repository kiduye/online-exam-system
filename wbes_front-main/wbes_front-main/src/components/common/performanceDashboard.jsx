import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LineChart from './lineCharts'; // Ensure this path is correct

const PerformanceDashboard = ({ studentId }) => {
    const [performanceData, setPerformanceData] = useState(null);
    const [improvementData, setImprovementData] = useState(null);

    useEffect(() => {
        if (studentId) {
            const fetchPerformanceData = async () => {
                try {
                    const { data } = await axios.get(`http://localhost:5000/api/performance/student/${studentId}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    });
                    setPerformanceData(data);
                } catch (error) {
                    console.error('Error fetching performance data', error);
                }
            };

            const fetchImprovementData = async () => {
                try {
                    const { data } = await axios.get(`http://localhost:5000/api/performance/student/${studentId}/improvement`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    });
                    setImprovementData(data);
                } catch (error) {
                    console.error('Error fetching improvement data', error);
                }
            };

            fetchPerformanceData();
            fetchImprovementData();
        }
    }, [studentId]);

    if (!performanceData || !improvementData) return <p>Loading...</p>;

    const { exams, performanceTrends } = performanceData;
    const { latestExam, previousExam, improvement } = improvementData;

    return (
        <div>
            <h1>Performance Dashboard</h1>
            <div>
                <h3>Overall Performance</h3>
                <p>Average Score: {exams.reduce((sum, exam) => sum + exam.score, 0) / exams.length}</p>
                <p>Improvement: {improvement}%</p>
            </div>
            <LineChart data={performanceTrends} xKey="date" yKey="score" />
            <div>
                <h3>Exam Results</h3>
                <ul>
                    {exams.map((exam) => (
                        <li key={exam._id}>
                            {exam.examName}: {exam.score} (Date: {new Date(exam.date).toLocaleDateString()})
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default PerformanceDashboard;
