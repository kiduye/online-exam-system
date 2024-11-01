// SearchBar.jsx
import React from 'react';

const SearchBar = ({ onSearch }) => {
    return (
        <input
            type="text"
            placeholder="Search questions..."
            className="p-2 border rounded-md"
            onChange={onSearch}
        />
    );
};

export default SearchBar;
