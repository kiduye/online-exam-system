// import React, { useState, useEffect, useMemo } from 'react';
// import HeaderSection from './headerSection';
// import QuestionCard from './questionCard';
// import QuestionDetailModal from './questionDetailModal';
// import FilterDropdown from './filterDropDown';
// import Api from '../../api/axiosInstance'; // Import the axios instance

// const QuestionListPage = () => {
//     const [filter, setFilter] = useState({
//         course: 'all',
//         instructor: 'all',
//         previouslySelected: false,
//     });
//     const [searchTerm, setSearchTerm] = useState('');
//     const [selectedCount, setSelectedCount] = useState(0);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [selectedQuestion, setSelectedQuestion] = useState(null);
//     const [sortOption, setSortOption] = useState('none');
//     const [questions, setQuestions] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     // Fetch questions for the department board
//     useEffect(() => {
//         const fetchQuestions = async () => {
//             try {
//                 const response = await Api.get('/questions/department'); // Use the Api instance
//                 setQuestions(response.data);
//                 setLoading(false);
//             } catch (error) {
//                 console.error('Error fetching questions:', error);
//                 setError('Failed to load questions.');
//                 setLoading(false);
//             }
//         };

//         fetchQuestions();
//     }, []);

//     const handleFilterChange = (type, value) => {
//         setFilter({ ...filter, [type]: value });
//     };

//     const handleSearch = (e) => setSearchTerm(e.target.value);

//     const handleCardClick = (question) => {
//         setSelectedQuestion(question);
//         setIsModalOpen(true);
//     };

//     const handleCloseModal = () => setIsModalOpen(false);

//     const handleSelectQuestion = (id) => {
//         setQuestions((prevQuestions) => {
//             const updatedQuestions = prevQuestions.map((q) => {
//                 if (q._id === id) {
//                     const updatedIsSelected = !q.isSelected;
//                     return { ...q, isSelected: updatedIsSelected };
//                 }
//                 return q;
//             });

//             const newSelectedCount = updatedQuestions.reduce((count, q) => {
//                 return q.isSelected ? count + 1 : count;
//             }, 0);

//             setSelectedCount(newSelectedCount);

//             return updatedQuestions;
//         });
//     };

//     const handleSortChange = (e) => {
//         setSortOption(e.target.value);
//     };

//     // Group questions by course ID
//     const groupedQuestions = useMemo(() => {
//         return questions.reduce((acc, q) => {
//             const courseId = q.course._id;
//             if (!acc[courseId]) {
//                 acc[courseId] = {
//                     courseName: q.course.name,
//                     instructorName: q.instructor.name,
//                     count: 0,
//                 };
//             }
//             acc[courseId].count += 1;
//             return acc;
//         }, {});
//     }, [questions]);

//     // Convert grouped questions to an array for rendering
//     const questionGroups = useMemo(() => {
//         return Object.keys(groupedQuestions).map((courseId) => ({
//             courseName: groupedQuestions[courseId].courseName,
//             instructorName: groupedQuestions[courseId].instructorName,
//             totalQuestions: groupedQuestions[courseId].count,
//         }));
//     }, [groupedQuestions]);

//     const filteredQuestions = useMemo(() => {
//         return questionGroups.filter((q) => {
//             const matchesCourse = filter.course === 'all' || q.courseName === filter.course;
//             const matchesInstructor = filter.instructor === 'all' || q.instructorName === filter.instructor;
//             const matchesPreviouslySelected =
                // !filter.previouslySelected || (filter.previouslySelected && q.status);

//             const matchesSearch = q.courseName.toLowerCase().includes(searchTerm.toLowerCase());

//             return (
//                 matchesCourse &&
//                 matchesInstructor &&
//                 matchesPreviouslySelected &&
//                 matchesSearch
//             );
//         });
//     }, [filter, searchTerm, questionGroups]);

//     const sortedQuestions = useMemo(() => {
//         switch (sortOption) {
//             case 'course':
//                 return [...filteredQuestions].sort((a, b) => a.courseName.localeCompare(b.courseName));
//             default:
//                 return filteredQuestions;
//         }
//     }, [filteredQuestions, sortOption]);

//     if (loading) {
//         return <p>Loading questions...</p>;
//     }

//     if (error) {
//         return <p>{error}</p>;
//     }

//     return (
//         <div className="flex flex-col lg:flex-row">
//             <div className="w-full lg:w-1/4 p-4 lg:border-r border-gray-300 lg:h-screen lg:overflow-y-auto">
//                 <FilterDropdown filter={filter} onFilterChange={handleFilterChange} />
//             </div>

//             <div className="w-full lg:w-3/4 p-4">
//                 <HeaderSection
//                     onSearch={handleSearch}
//                     selectedCount={selectedCount}
//                 />
                
//                 <div className="mb-4">
//                     <label htmlFor="sortOptions" className="mr-2">Sort By:</label>
//                     <select
//                         id="sortOptions"
//                         value={sortOption}
//                         onChange={handleSortChange}
//                         className="p-2 border rounded-md"
//                     >
//                         <option value="none">None</option>
//                         <option value="course">Course Name</option>
//                     </select>
//                 </div>

//                 <div className="overflow-y-auto max-h-96 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                     {sortedQuestions.map((q, index) => (
//                         <QuestionCard
//                             key={index} // Use index as the key here since course IDs might not be unique
//                             courseName={q.courseName}
//                             instructorName={q.instructorName}
//                             totalQuestions={q.totalQuestions}
//                             onClick={() => handleCardClick(q)}
//                         />
//                     ))}
//                 </div>
//             </div>

//             {selectedQuestion && (
//                 <QuestionDetailModal
//                     isOpen={isModalOpen}
//                     onClose={handleCloseModal}
//                     questionNumber={selectedQuestion._id}
//                     questionText={selectedQuestion.questionText}
//                     options={selectedQuestion.options}
//                     answer={selectedQuestion.answer}
//                     isSelected={selectedQuestion.isSelected}
//                     onSelect={() => handleSelectQuestion(selectedQuestion._id)}
//                     status={selectedQuestion.status}
//                 />
//             )}
//         </div>
//     );
// };

// export default QuestionListPage;
import React, { useState, useEffect, useMemo } from 'react';
import HeaderSection from './headerSection';
import QuestionCard from './questionCard';
import QuestionDetailModal from './questionDetailModal';
import FilterDropdown from './filterDropDown';
import Api from '../../api/axiosInstance';

const QuestionListPage = () => {
    const [filter, setFilter] = useState({
        course: 'all',
        instructor: 'all',
        previouslySelected: false,
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCount, setSelectedCount] = useState(0);
    const [modalState, setModalState] = useState({
        isOpen: false,
        courseId: null,
        questions: [],
    });
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortOption, setSortOption] = useState('none');

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await Api.get('/questions/department/{departmentId}');
                setQuestions(response.data);
            } catch (error) {
                console.error('Error fetching questions:', error.response ? error.response.data : error.message);
                setError(error.response ? error.response.data.error || 'Failed to load questions.' : 'Failed to load questions.');
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, []);

    const handleFilterChange = (type, value) => {
        setFilter((prevFilter) => ({ ...prevFilter, [type]: value }));
    };

    const handleSearch = (e) => setSearchTerm(e.target.value);

    const handleCardClick = async (courseId) => {
        try {
            setLoading(true);
            const response = await Api.get(`/questions/course/${courseId}`);
            setModalState({
                isOpen: true,
                courseId,
                questions: response.data,
            });
        } catch (error) {
            console.error('Error fetching course questions:', error);
            setError('Failed to load course questions.');
        } finally {
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        setModalState({ isOpen: false, courseId: null, questions: [] });
    };

    const handleSelectQuestion = (id) => {
        setQuestions((prevQuestions) => {
            const updatedQuestions = prevQuestions.map((q) => {
                if (q._id === id) {
                    const updatedIsSelected = !q.isSelected;
                    return { ...q, isSelected: updatedIsSelected };
                }
                return q;
            });

            const newSelectedCount = updatedQuestions.reduce((count, q) => (q.isSelected ? count + 1 : count), 0);
            setSelectedCount(newSelectedCount);
            return updatedQuestions;
        });
    };

    const handleSortChange = (e) => {
        setSortOption(e.target.value);
    };

    const groupedQuestions = useMemo(() => {
        return questions.reduce((acc, q) => {
            const courseId = q.course?._id;
            const courseName = q.course?.name || 'Unknown Course';
            const instructorName = q.instructor?.name || 'Unknown Instructor';

            if (!courseId) return acc;

            if (!acc[courseId]) {
                acc[courseId] = { courseName, instructorName, count: 0 };
            }
            acc[courseId].count += 1;
            return acc;
        }, {});
    }, [questions]);

    const questionGroups = useMemo(() => {
        return Object.keys(groupedQuestions).map((courseId) => ({
            courseId,
            courseName: groupedQuestions[courseId].courseName,
            instructorName: groupedQuestions[courseId].instructorName,
            totalQuestions: groupedQuestions[courseId].count,
        }));
    }, [groupedQuestions]);

    const filteredQuestions = useMemo(() => {
        return questionGroups.filter((q) => {
            const matchesCourse = filter.course === 'all' || q.courseName === filter.course;
            const matchesInstructor = filter.instructor === 'all' || q.instructorName === filter.instructor;
            const matchesPreviouslySelected = !filter.previouslySelected || (filter.previouslySelected && q.status);
            const matchesSearch = q.courseName.toLowerCase().includes(searchTerm.toLowerCase());

            return matchesCourse && matchesInstructor && matchesPreviouslySelected && matchesSearch;
        });
    }, [filter, searchTerm, questionGroups]);

    const sortedQuestions = useMemo(() => {
        switch (sortOption) {
            case 'course':
                return [...filteredQuestions].sort((a, b) => a.courseName.localeCompare(b.courseName));
            default:
                return filteredQuestions;
        }
    }, [filteredQuestions, sortOption]);

    if (loading) {
        return <p>Loading questions...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="flex flex-col lg:flex-row">
            <div className="w-full lg:w-1/4 p-4 lg:border-r border-gray-300 lg:h-screen lg:overflow-y-auto">
                <FilterDropdown filter={filter} onFilterChange={handleFilterChange} />
            </div>

            <div className="w-full lg:w-3/4 p-4">
                <HeaderSection onSearch={handleSearch} selectedCount={selectedCount} />

                <div className="mb-4">
                    <label htmlFor="sortOptions" className="mr-2">Sort By:</label>
                    <select
                        id="sortOptions"
                        value={sortOption}
                        onChange={handleSortChange}
                        className="p-2 border rounded-md"
                        aria-label="Sort questions"
                    >
                        <option value="none">None</option>
                        <option value="course">Course Name</option>
                    </select>
                </div>

                <div className="overflow-y-auto max-h-96 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sortedQuestions.map((q, index) => (
                        <QuestionCard
                            key={index}
                            courseName={q.courseName}
                            instructorName={q.instructorName}
                            totalQuestions={q.totalQuestions}
                            onClick={() => handleCardClick(q.courseId)}
                        />
                    ))}
                </div>
            </div>

            {modalState.isOpen && modalState.courseId && (
                <QuestionDetailModal
                    isOpen={modalState.isOpen}
                    onClose={handleCloseModal}
                    questions={modalState.questions}
                    onSelectQuestion={handleSelectQuestion}
                />
            )}
        </div>
    );
};

export default QuestionListPage;



