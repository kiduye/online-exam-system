// src/components/KpiCards.jsx

import React from 'react';
import './KpiCards.css';
import { FaUsers, FaChalkboardTeacher, FaBuilding, FaBookOpen, FaCalendarAlt } from 'react-icons/fa';

const kpiData = [
  {
    id: 1,
    icon: <FaUsers />,
    label: 'Students Registered',
    value: 1200, // Replace with dynamic data
  },
  {
    id: 2,
    icon: <FaChalkboardTeacher />,
    label: 'Teachers',
    value: 150, // Replace with dynamic data
  },
  {
    id: 3,
    icon: <FaBuilding />,
    label: 'Department Boards',
    value: 5, // Replace with dynamic data
  },
  {
    id: 4,
    icon: <FaBookOpen />,
    label: 'Course Modules Created',
    value: 75, // Replace with dynamic data
  },
  {
    id: 5,
    icon: <FaCalendarAlt />,
    label: 'Exams Scheduled',
    value: 20, // Replace with dynamic data
  },
];

const KpiCards = () => {
  return (
    <div className="kpi-cards-container">
      {kpiData.map((kpi) => (
        <div key={kpi.id} className="kpi-card">
          <div className="kpi-icon">
            {kpi.icon}
          </div>
          <div className="kpi-info">
            <h3 className="kpi-label">{kpi.label}</h3>
            <p className="kpi-value">{kpi.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default KpiCards;
