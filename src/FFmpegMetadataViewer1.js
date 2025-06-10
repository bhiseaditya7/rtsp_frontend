// import React, { useEffect, useState } from 'react';

// function FFmpegMetadataViewer() {
//   const [ffmpegData, setFfmpegData] = useState({});
//   const [faces, setFaces] = useState([]);

//   useEffect(() => {
//   const ffmpegSocket = new WebSocket('ws://127.0.0.1:8000/ws/metadata/');
//   const faceSocket = new WebSocket(`ws://127.0.0.1:8000/ws/faces/${streamId}/`);

//   ffmpegSocket.onmessage = (event) => {
//     const data = JSON.parse(event.data);
//     setFfmpegData(data);
//   };

//   faceSocket.onmessage = (event) => {
//     const data = JSON.parse(event.data);
//     if (data.type === 'faces') {
//       setFaces(data.data);
//     }
//   };

//   // return () => {
//   //   ffmpegSocket.close();
//   //   faceSocket.close();
//   // };
//   return() =>{
//     if (ffmpegSocket.readyState === WebSocket.OPEN ){
//       ffmpegSocket.close();
//     }
//     if (faceSocket.readyState === WebSocket.OPEN) {
//       faceSocket.close();
//     }
//   };
// }, []);

//   return (
//     <div style={{ padding: '1rem' }}>
//       <h2>📊 FFmpeg Metadata</h2>
//       <ul>
//         {Object.entries(ffmpegData).map(([key, value]) => (
//           <li key={key}><strong>{key}:</strong> {value}</li>
//         ))}
//       </ul>

//       <h2>🧠 Face Detection</h2>
//       <p><strong>Total Faces Detected:</strong> {faces.length}</p>
//       <ul>
//         {faces.map((face, index) => (
//           <li key={index}>
//             <strong>Box:</strong> [{face.box.join(', ')}], 
//             <strong> Confidence:</strong> {face.confidence}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default FFmpegMetadataViewer;

import React, { useEffect, useState } from 'react';

function FFmpegMetadataViewer() {
  const [ffmpegData, setFfmpegData] = useState({});
  const [faces, setFaces] = useState([]);
  const [streamId, setStreamId] = useState(null);
  const [rtspUrl, setRtspUrl] = useState('');

  // Step 1: Start the stream and get streamId
  useEffect(() => {
    fetch('http://127.0.0.1:8000/stream/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        rtsp_url: rtspUrl // replace with your RTSP
      })
    })
      .then(res => res.json())
      .then(data => {
        console.log("Stream started, streamId:", data.stream_id);
        setStreamId(data.stream_id);
      })
      .catch(error => {
        console.error("Error starting stream:", error);
      });
  }, []);

  // Step 2: Set up WebSocket connections once streamId is available
  useEffect(() => {
    if (!streamId) return;

    const ffmpegSocket = new WebSocket('ws://127.0.0.1:8000/ws/metadata/');
    const faceSocket = new WebSocket(`ws://127.0.0.1:8000/ws/faces/${streamId}/`);

    ffmpegSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setFfmpegData(data);
    };

    faceSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'faces') {
        setFaces(data.data);
      }
    };

    ffmpegSocket.onerror = (e) => console.error("FFmpeg WebSocket error:", e);
    faceSocket.onerror = (e) => console.error("Face WebSocket error:", e);

    return () => {
      if (ffmpegSocket.readyState === WebSocket.OPEN) ffmpegSocket.close();
      if (faceSocket.readyState === WebSocket.OPEN) faceSocket.close();
    };
  }, [streamId]);

  return (
    <div style={{ padding: '1rem' }}>
      <h2>📊 FFmpeg Metadata</h2>
      <ul>
        {Object.entries(ffmpegData).map(([key, value]) => (
          <li key={key}><strong>{key}:</strong> {value}</li>
        ))}
      </ul>

      <h2>🧠 Face Detection</h2>
      <p><strong>Total Faces Detected:</strong> {faces.length}</p>
      <ul>
        {faces.map((face, index) => (
          <li key={index}>
            <strong>Box:</strong> [{face.box.join(', ')}], 
            <strong> Confidence:</strong> {face.confidence}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FFmpegMetadataViewer;