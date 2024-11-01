import React, { useState } from 'react';
import './Announcement.css'; // Import the CSS file

const Announcement = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const announcementData = {
      title,
      description,
      image,
    };
    console.log(announcementData);
  };

  return (
    <div className="announcement-container">
      <h1 className="announcement-title">Post Announcement</h1>

      <form onSubmit={handleSubmit} className="announcement-form">
        <div className="form-group">
          <label>Announcement Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Enter the title"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="Enter the description"
            rows="4"
            className="form-input"
          ></textarea>
        </div>

        <div className="form-group">
          <label>Image</label>
          <input
            type="file"
            onChange={handleImageChange}
            className="file-input"
          />
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" className="preview-img" />
            </div>
          )}
        </div>

        <div className="form-group text-center">
          <button type="submit" className="submit-btn">Post Announcement</button>
        </div>
      </form>
    </div>
  );
};

export default Announcement;
