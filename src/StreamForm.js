import React, { useState } from 'react';
import axios from 'axios';

function StreamForm({ onStreamStarted }) {
  const [rtspUrl, setRtspUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      //const res = await axios.post('https://rtsp1.onrender.com/stream/', {
      const res = await axios.post('https://rtsp1.onrender.com/stream/', {
        rtsp_url: rtspUrl,
      });

      onStreamStarted({
        streamId: res.data.stream_id,
        hlsUrl: res.data.hls_url,
        rtspUrl: rtspUrl,
      });

      setRtspUrl('');
    } catch (error) {
      console.error('Error starting stream:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={rtspUrl}
        onChange={(e) => setRtspUrl(e.target.value)}
        placeholder="Enter RTSP stream URL"
      />
      <button type="submit">Start Stream</button>
    </form>
  );
}

export default StreamForm;