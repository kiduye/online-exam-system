import React, { useState } from 'react';
import Api from '../../api/axiosInstance'; // Adjust the import based on your folder structure

const UploadMaterial = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [previewType, setPreviewType] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const fileType = selectedFile.type;

      if (fileType === 'application/pdf') {
        const pdfUrl = URL.createObjectURL(selectedFile);
        setPreview(pdfUrl);
        setPreviewType('pdf');
      } else if (
        fileType === 'application/vnd.ms-powerpoint' ||
        fileType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
      ) {
        const pptUrl = URL.createObjectURL(selectedFile);
        setPreview(pptUrl);
        setPreviewType('ppt');
      } else if (
        fileType === 'application/msword' ||
        fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ) {
        const docUrl = URL.createObjectURL(selectedFile);
        setPreview(docUrl);
        setPreviewType('doc');
      } else if (fileType.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
          setPreviewType('image');
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setPreview(null);
        setPreviewType('');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('file', file);

    try {
      const response = await Api.post('/materials', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Upload response:', response.data);
      alert('File uploaded successfully');
      // Reset form fields after success
      setTitle('');
      setDescription('');
      setFile(null);
      setPreview(null);
      setPreviewType('');
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file');
    }
  };

  return (
    <div className="relative max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Upload Course Material</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter the title"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter the description"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="file">
            Upload File
          </label>
          <input
            type="file"
            id="file"
            onChange={handleFileChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        {preview && (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Preview</label>
            {previewType === 'pdf' ? (
              <iframe
                src={preview}
                title="PDF Preview"
                className="w-full h-64 border border-gray-300 rounded"
              ></iframe>
            ) : previewType === 'image' ? (
              <img
                src={preview}
                alt="Preview"
                className="rounded border border-gray-300 max-w-full h-auto"
              />
            ) : previewType === 'ppt' || previewType === 'doc' ? (
              <div>
                <a href={preview} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                  View {previewType === 'ppt' ? 'PowerPoint' : 'Document'}
                </a>
              </div>
            ) : null}
          </div>
        )}

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Upload
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadMaterial;
