import React, { useEffect, useState } from 'react';
import Api from '../../api/axiosInstance'; // Adjust the import path if necessary

const ExamResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await Api.get('/exam-results'); // Adjust the endpoint as necessary
        console.log(response.data);
        setResults(response.data);
      } catch (err) {
        setError('Failed to fetch exam results');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-red-500 text-center py-4">{error}</div>;

  return (
    <div className="container mx-auto p-4 w-full"> {/* Full width container */}
      <h1 className="text-2xl font-bold mb-4">Your Exam Results</h1>
      {results.length === 0 ? (
        <div className="text-center text-gray-500">No exam results found for this user.</div>
      ) : (
        <div className="overflow-x-auto w-full"> {/* Ensure overflow and full width */}
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-4 border-b text-left">Exam ID</th>
                <th className="py-2 px-4 border-b text-left">Score</th>
                <th className="py-2 px-4 border-b text-left">Date</th>
                <th className="py-2 px-4 border-b text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result) => (
                <tr key={result._id} className="hover:bg-gray-100">
                  <td className="py-2 px-4 border-b">{result.examName}</td>
                  <td className="py-2 px-4 border-b">{result.score}</td>
                  <td className="py-2 px-4 border-b">{new Date(result.date).toLocaleDateString()}</td>
                  <td className="py-2 px-4 border-b">{result.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ExamResults;
