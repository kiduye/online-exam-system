import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ duration, onTimeUp }) => {
    const [timeLeft, setTimeLeft] = useState(duration);

    useEffect(() => {
        if (timeLeft === 0) {
            onTimeUp(); // Call the callback function when time is up
            return;
        }

        const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000); // Decrease time every second

        return () => clearTimeout(timerId); // Clean up the timer on component unmount
    }, [timeLeft, onTimeUp]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    return (
        <div>
            <h2>Time Remaining: {formatTime(timeLeft)}</h2>
        </div>
    );
};

export default CountdownTimer;
