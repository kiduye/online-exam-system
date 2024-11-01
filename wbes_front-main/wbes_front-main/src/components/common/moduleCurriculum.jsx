import React, { useState } from "react";
import { useParams } from "react-router-dom";

const CurriculumPage = () => {
  const { id } = useParams(); // Get the course module id from route params
  const [activeTab, setActiveTab] = useState("overview");
  const [curriculumData, setCurriculumData] = useState([
    {
      mainTopic: "React Basics",
      subtopics: [
        {
          title: "Components",
          content: "Learn about functional and class components.",
        },
        {
          title: "State & Props",
          content: "Understand state and props in React.",
        },
      ],
    },
  ]);

  const [expandedMainTopic, setExpandedMainTopic] = useState(null);
  const [expandedSubtopic, setExpandedSubtopic] = useState(null);

  return (
    <div className="p-8">
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 rounded ${
            activeTab === "overview" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("curriculum")}
          className={`px-4 py-2 rounded ${
            activeTab === "curriculum" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Curriculum
        </button>
      </div>

      {/* Overview Content */}
      {activeTab === "overview" && (
        <div>
          <h2 className="text-2xl font-semibold">Course Overview</h2>
          <p>This course covers the following topics in React development...</p>
        </div>
      )}

      {/* Curriculum Content */}
      {activeTab === "curriculum" && (
        <div>
          <h2 className="text-2xl font-semibold">Curriculum</h2>
          {curriculumData.map((main, mainIndex) => (
            <div key={mainIndex} className="mt-4">
              {/* Main Topic */}
              <div
                className="cursor-pointer bg-gray-200 p-3 rounded"
                onClick={() =>
                  setExpandedMainTopic(
                    expandedMainTopic === mainIndex ? null : mainIndex
                  )
                }
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">{main.mainTopic}</h3>
                  <span>
                    {expandedMainTopic === mainIndex ? "Collapse" : "Expand"}
                  </span>
                </div>
              </div>

              {/* Subtopics */}
              {expandedMainTopic === mainIndex &&
                main.subtopics.map((sub, subIndex) => (
                  <div key={subIndex} className="ml-6 mt-2">
                    <div
                      className="cursor-pointer bg-gray-100 p-2 rounded"
                      onClick={() =>
                        setExpandedSubtopic(
                          expandedSubtopic === subIndex ? null : subIndex
                        )
                      }
                    >
                      <div className="flex justify-between items-center">
                        <h4 className="text-md font-semibold">{sub.title}</h4>
                        <span>
                          {expandedSubtopic === subIndex ? "Collapse" : "Expand"}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    {expandedSubtopic === subIndex && (
                      <div className="ml-6 mt-2 bg-gray-50 p-2 rounded">
                        <p>{sub.content}</p>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CurriculumPage;
