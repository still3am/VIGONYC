import React, { useEffect, useState } from 'react';

const timezones = {
    EST: -4,
    CST: -5,
    MST: -6,
    PST: -7,
    GMT: 0,
    CET: 1,
    IST: 5.5,
    JST: 9,
    AEST: 10
};

const DigitalClock = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className='min-h-screen bg-gradient-to-r from-cyan-500 to-purple-600 flex flex-col justify-center items-center'>
            <h1 className='text-white text-4xl mb-5'>Digital Clocks</h1>
            {Object.keys(timezones).map((zone) => {
                const offset = timezones[zone];
                const localTime = new Date(time.getTime() + offset * 3600 * 1000);
                return (
                    <div key={zone} className='text-white text-2xl'>
                        {zone}: {localTime.toUTCString().slice(5, 25)}
                    </div>
                );
            })}
            <div className='text-white text-lg mt-5'>Current Local Time: {time.toUTCString().slice(5, 25)}</div>
        </div>
    );
};

export default DigitalClock;