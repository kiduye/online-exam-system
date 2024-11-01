import React, { useState } from 'react';
import TextEditor from './textEditor';

const Toolbar = ({ onAddQuestion, onAddChoice }) => {
  const [editorContent, setEditorContent] = useState('');

  const handleAddQuestion = () => {
    if (editorContent.trim()) {
      onAddQuestion(editorContent);
      setEditorContent(''); // Clear editor after adding
    }
  };

  const handleAddChoice = () => {
    if (editorContent.trim()) {
      onAddChoice(editorContent);
      setEditorContent(''); // Clear editor after adding
    }
  };

  return (
    <div className="toolbar p-4 border-b mb-4">
      <TextEditor value={editorContent} onChange={setEditorContent} />
      <div className="mt-2">
        <button onClick={handleAddQuestion} className="btn btn-primary mr-2">Add Question</button>
        <button onClick={handleAddChoice} className="btn btn-secondary">Add Choice</button>
      </div>
    </div>
  );
};

export default Toolbar;
