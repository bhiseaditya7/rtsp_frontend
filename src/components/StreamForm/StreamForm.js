import { useState } from 'react';
import axios from 'axios';
import './StreamForm.css'; // Import the CSS

function StreamForm({ onStreamStarted }) {
  const [streams, setStreams] = useState([{ rtspUrl: '' }]);

  const handleInputChange = (index, value) => {
    const updated = [...streams];
    updated[index].rtspUrl = value;
    setStreams(updated);
  };

  const handleAddStream = () => {
    setStreams([...streams, { rtspUrl: '' }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    for (const stream of streams) {
      if (!stream.rtspUrl.trim()) continue;

      try {
        const res = await axios.post('http://127.0.0.1:8000/stream/', {
          rtsp_url: stream.rtspUrl,
        });

        onStreamStarted({
          streamId: res.data.stream_id,
          hlsUrl: res.data.hls_url,
          rtspUrl: stream.rtspUrl,
        })
        console.log("Stream id is",res.data.stream_id);
        console.log("hls url is ",res.data.hls_url)
        console.log("rtsp url is",stream.rtspUrl)
        ;
      } catch (error) {
        console.error('Error starting stream:', error);
      }
    }

    setStreams([{ rtspUrl: '' }]);
  };

  return (
    <div className="stream-container">
      <form onSubmit={handleSubmit} className="stream-form">
        <h2 className="form-title">Start RTSP Stream</h2>
        {streams.map((stream, index) => (
          <div key={index} className="input-group">
            <input
              type="text"
              value={stream.rtspUrl}
              onChange={(e) => handleInputChange(index, e.target.value)}
              placeholder={`RTSP Stream URL #${index + 1}`}
              className="input-field"
            />
          </div>
        ))}

        <div className="form-actions">
          <button type="button" onClick={handleAddStream} className="add-button">
            +
          </button>
          <button type="submit" className="submit-button">
            Start Stream(s)
          </button>
        </div>
      </form>
    </div>
  );
}

export default StreamForm;
