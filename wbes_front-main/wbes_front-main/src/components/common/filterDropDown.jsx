import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const FilterGroup = ({ title, options, selectedValue, onSelect }) => {
    const [isOpen, setIsOpen] = useState(true);

    const toggleOpen = () => setIsOpen(!isOpen);
 
    return (
        <div className="mb-4 dark:bg-gray-800 ">
            <div className="flex items-center justify-between dark:bg-gray-800 cursor-pointer p-2 bg-white bg-opacity-90 rounded-md" onClick={toggleOpen}>
                <span className="font-semibold">{title}</span>
                {isOpen ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            {isOpen && (
                <div className="mt-2">
                    {options.map((option) => (
                        <div key={option.value} className="flex items-center p-2 cursor-pointer hover:bg-gray-300 dark:bg-gray-800  dark:text-white rounded-md">
                            <input
                                type="radio"
                                id={option.value}
                                name={title}
                                value={option.value}
                                checked={selectedValue === option.value}
                                onChange={() => onSelect(option.value)}
                                className="mr-2"
                            />
                            <label htmlFor={option.value}>{option.label}</label>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const FilterDropdown = ({ filter = {}, onFilterChange }) => {
    const handleSelect = (type, value) => {
        onFilterChange(type, value);
    };

    return (
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
            <FilterGroup
                title="Course"
                options={[
                    { value: 'all', label: 'All Courses' },
                    { value: 'Course 1', label: 'Course 1' },
                    { value: 'Course 2', label: 'Course 2' },
                ]}
                selectedValue={filter.course || 'all'}
                onSelect={(value) => handleSelect('course', value)}
            />
            <FilterGroup
                title="Instructor"
                options={[
                    { value: 'all', label: 'All Instructors' },
                    { value: 'Instructor A', label: 'Instructor A' },
                    { value: 'Instructor B', label: 'Instructor B' },
                ]}
                selectedValue={filter.instructor || 'all'}
                onSelect={(value) => handleSelect('instructor', value)}
            />
            <FilterGroup
                title="Difficulty"
                options={[
                    { value: 'all', label: 'All Difficulties' },
                    { value: 'easy', label: 'Easy' },
                    { value: 'medium', label: 'Medium' },
                    { value: 'hard', label: 'Hard' },
                ]}
                selectedValue={filter.difficulty || 'all'}
                onSelect={(value) => handleSelect('difficulty', value)}
            />
            <FilterGroup
                title="Type"
                options={[
                    { value: 'all', label: 'All Types' },
                    { value: 'multipleChoice', label: 'Multiple Choice' },
                    { value: 'trueFalse', label: 'True/False' },
                ]}
                selectedValue={filter.type || 'all'}
                onSelect={(value) => handleSelect('type', value)}
            />
            <div className="mt-4">
                <input
                    type="checkbox"
                    id="previouslySelected"
                    checked={filter.previouslySelected || false}
                    onChange={(e) => handleSelect('previouslySelected', e.target.checked)}
                    className="mr-2"
                />
                <label htmlFor="previouslySelected">Previously Selected</label>
            </div>
        </div>
    );
};

FilterDropdown.propTypes = {
    filter: PropTypes.shape({
        course: PropTypes.string,
        instructor: PropTypes.string,
        difficulty: PropTypes.string,
        type: PropTypes.string,
        previouslySelected: PropTypes.bool,
    }),
    onFilterChange: PropTypes.func.isRequired,
};

export default FilterDropdown;
