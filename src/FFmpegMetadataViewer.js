// import { useEffect } from 'react';

// function FFmpegMetadataViewer() {
//   useEffect(() => {
//     //const socket = new WebSocket('wss://rtsp1.onrender.com/ws/metadata/');
//     const socket = new WebSocket('ws://127.0.0.1:8000/ws/metadata/');

//     socket.onmessage = (event) => {
//       const data = JSON.parse(event.data);
//       console.log("FFmpeg Metadata:", data);
//       // You can update state here to display metadata in UI
//     };

//     socket.onerror = (err) => {
//       console.error("WebSocket error:", err);
//     };

//     return () => socket.close();
//   }, []);

//   return <div>Listening for FFmpeg metadata...</div>;
// }

// export default FFmpegMetadataViewer;
//just adi
// import React, { useEffect, useState } from 'react';

// function FFmpegMetadataViewer() {
//   const [ffmpegData, setFfmpegData] = useState({});
//   const [faces, setFaces] = useState([]);

//   //just 
//   // useEffect(() => {
//   //   const socket = new WebSocket('ws://127.0.0.1:8000/ws/metadata/');

//   //   socket.onmessage = (event) => {
//   //     const data = JSON.parse(event.data);

//   //     if (data.type === 'ffmpeg') {
//   //       console.log("FFmpeg Metadata:", data.data);
//   //       setFfmpegData(data.data);
//   //     } else if (data.type === 'faces') {
//   //       console.log("Detected Faces:", data.data);
//   //       setFaces(data.data);
//   //     }
//   //   };

//   //   socket.onerror = (err) => {
//   //     console.error("WebSocket error:", err);
//   //   };

//   //   return () => socket.close();
//   // }, []);
  

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

//just adi 2
// import React, { useEffect, useState } from 'react';

// function FFmpegMetadataViewer() {
//   const [ffmpegData, setFfmpegData] = useState({});
//   const [faces, setFaces] = useState([]);
//   const [streamId, setStreamId] = useState(null);
//    const [rtspUrl, setRtspUrl] = useState('');

//   // Step 1: Start the stream and get streamId
//   useEffect(() => {
//     fetch('http://127.0.0.1:8000/stream/', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         rtsp_url: rtspUrl // replace with your RTSP
//       })
//     })
//       .then(res => res.json())
//       .then(data => {
//         console.log("Stream started, streamId:", data.stream_id);
//         setStreamId(data.stream_id);
//       })
//       .catch(error => {
//         console.error("Error starting stream:", error);
//       });
//   }, []);

//   // Step 2: Set up WebSocket connections once streamId is available
//   useEffect(() => {
//     if (!streamId) return;

//     const ffmpegSocket = new WebSocket('ws://127.0.0.1:8000/ws/metadata/');
//     const faceSocket = new WebSocket(`ws://127.0.0.1:8000/ws/faces/${streamId}/`);

//     ffmpegSocket.onmessage = (event) => {
//       const data = JSON.parse(event.data);
//       setFfmpegData(data);
//     };

//     faceSocket.onmessage = (event) => {
//       const data = JSON.parse(event.data);
//       if (data.type === 'faces') {
//         setFaces(data.data);
//       }
//     };

//     ffmpegSocket.onerror = (e) => console.error("FFmpeg WebSocket error:", e);
//     faceSocket.onerror = (e) => console.error("Face WebSocket error:", e);

//     return () => {
//       if (ffmpegSocket.readyState === WebSocket.OPEN) ffmpegSocket.close();
//       if (faceSocket.readyState === WebSocket.OPEN) faceSocket.close();
//     };
//   }, [streamId]);

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
  const [hlsUrl, setHlsUrl] = useState('');
  const [started, setStarted] = useState(false);

  const startStreaming = () => {
    fetch('http://127.0.0.1:8000/stream/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rtsp_url: rtspUrl })
    })
      .then(res => res.json())
      .then(data => {
        console.log("Stream started:", data);
        setStreamId(data.stream_id);
        setHlsUrl(data.hls_url);
        setStarted(true);
      })
      .catch(error => {
        console.error("Error starting stream:", error);
      });
  };

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

    return () => {
      if (ffmpegSocket.readyState === WebSocket.OPEN) ffmpegSocket.close();
      if (faceSocket.readyState === WebSocket.OPEN) faceSocket.close();
    };
  }, [streamId]);

  return (
    <div style={{ padding: '1rem' }}>
      {!started && (
        <div>
          <h3>Start New Stream</h3>
          <input
            type="text"
            value={rtspUrl}
            onChange={(e) => setRtspUrl(e.target.value)}
            placeholder="Enter RTSP URL"
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
          <button onClick={startStreaming}>Start Streaming</button>
        </div>
      )}

      {hlsUrl && (
        <div>
          <h3>📺 Live Stream</h3>
          <video src={hlsUrl} controls autoPlay style={{ width: '100%' }} />
        </div>
      )}

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
