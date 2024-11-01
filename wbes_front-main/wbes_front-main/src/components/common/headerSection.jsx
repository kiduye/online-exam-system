import React, { useState } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import SelectedQuestionsCounter from './selectedQuestionCounter';
import SearchBar from './searchBar';

const HeaderSection = ({ onSearch, selectedCount }) => {
    const [isSearchVisible, setIsSearchVisible] = useState(false);

    const toggleSearchVisibility = () => {
        setIsSearchVisible(!isSearchVisible);
    };

    return (
        <div className="flex flex-col lg:flex-row justify-between items-center p-4 border-b">
            {/* Search icon and close icon */}
            <div className="flex items-center space-x-4">
                <button
                    onClick={toggleSearchVisibility}
                    className="p-2 text-gray-600 hover:text-gray-900"
                >
                    {isSearchVisible ? <FaTimes size={20} /> : <FaSearch size={20} />}
                </button>

                {/* Search bar with transition */}
                <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out transform ${
                        isSearchVisible ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                    } w-full lg:w-auto mt-2 lg:mt-0`}
                >
                    <SearchBar onSearch={onSearch} />
                </div>
            </div>

            {/* FilterDropdown and SelectedQuestionsCounter */}
            <div className="flex items-center space-x-4 mt-2 lg:mt-0">
                
                <SelectedQuestionsCounter count={selectedCount} />
            </div>
        </div>
    );
};

export default HeaderSection;
