import React, { useState } from 'react';
import OnGoLive from '../YouTubeStream';
import { useNavigate } from 'react-router-dom';

const Home = ({}) => {
  const [rtmpUrl, setRtmpUrl] = useState('');
  const [streamKey, setStreamKey] = useState('');
  const navigate = useNavigate();

  const handleGoLive = () => {
    // Trigger the event with the provided RTMP URL and stream key
    navigate("/stream", {
      state: { rtmpUrl, streamKey }
    });
    // OnGoLive({ rtmpUrl, streamKey });
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-purple-100">
      {/* Welcome Text */}
      <h1 className="text-purple-200 text-5xl font-extrabold mb-6 text-center shadow-lg">
        Welcome to Stream Symphony!
      </h1>

      {/* Form Container */}
      <div className="p-8 bg-white rounded-lg shadow-lg w-3/4 max-w-md transform transition-all duration-300 ease-in-out hover:shadow-xl">
        <h2 className="text-purple-700 text-2xl font-semibold mb-6 text-center">
          YouTube Stream
        </h2>

        <div className="mb-4">
          <label htmlFor="rtmpUrl" className="block text-purple-700 mb-2">
            RTMP URL:
          </label>
          <input
            type="text"
            id="rtmpUrl"
            value={rtmpUrl}
            onChange={(e) => setRtmpUrl(e.target.value)}
            className="block w-full px-3 py-2 border border-purple-300 rounded focus:outline-none focus:border-purple-500 focus:shadow-outline-purple"
            placeholder="Enter RTMP URL"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="streamKey" className="block text-purple-700 mb-2">
            Stream Key:
          </label>
          <input
            type="text"
            id="streamKey"
            value={streamKey}
            onChange={(e) => setStreamKey(e.target.value)}
            className="block w-full px-3 py-2 border border-purple-300 rounded focus:outline-none focus:border-purple-500 focus:shadow-outline-purple"
            placeholder="Enter Stream Key"
          />
        </div>

        <button
          className="btn-red"
          onClick={handleGoLive}
        >
          Go Live
        </button>
      </div>
    </div>
  );
};

export default Home;
