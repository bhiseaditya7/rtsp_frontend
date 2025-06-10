// import { useEffect, useRef, useState } from 'react';
// import Hls from 'hls.js';
// import { Card, CardContent, CardActions, Button, Typography } from '@mui/material';

// function VideoPlayer({ src }) {
//   const videoRef = useRef();
//   const [isPlaying, setIsPlaying] = useState(true);
//   const [metadata, setMetadata] = useState({ width: 0, height: 0, duration: 0 });

//   useEffect(() => {
//     let hls;

//     if (Hls.isSupported()) {
//       hls = new Hls();
//       hls.loadSource(src);
//       hls.attachMedia(videoRef.current);
//       hls.on(Hls.Events.MANIFEST_PARSED, () => {
//         videoRef.current.play();
//       });
//     } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
//       videoRef.current.src = src;
//     }

//     const video = videoRef.current;
//     const handleLoadedMetadata = () => {
//       setMetadata({
//         width: video.videoWidth,
//         height: video.videoHeight,
//         duration: video.duration.toFixed(2),
//       });
//     };

//     video.addEventListener('loadedmetadata', handleLoadedMetadata);

//     return () => {
//       if (hls) hls.destroy();
//       video.removeEventListener('loadedmetadata', handleLoadedMetadata);
//     };
//   }, [src]);

//   const handlePlayPause = () => {
//     const video = videoRef.current;
//     if (isPlaying) {
//       video.pause();
//     } else {
//       video.play();
//     }
//     setIsPlaying(!isPlaying);
//   };

//   return (
//     <Card sx={{ bgcolor: '#1e1e1e', color: '#fff', borderRadius: 2, boxShadow: 3, mt: 2 }}>
//       <CardContent>
//         <video ref={videoRef} controls autoPlay width="100%" height="auto" style={{ borderRadius: '10px' }} />
//         <Typography variant="body2" sx={{ mt: 1 }}>
//           Resolution: {metadata.width}×{metadata.height} | Duration: {metadata.duration}s
//         </Typography>
//       </CardContent>
//       <CardActions>
//         <Button variant="contained" color="primary" onClick={handlePlayPause}>
//           {isPlaying ? 'Pause' : 'Play'}
//         </Button>
//       </CardActions>
//     </Card>
//   );
// }

// export default VideoPlayer;

// //just
// import { useEffect, useRef, useState } from 'react';
// import Hls from 'hls.js';
// import { Card, CardContent, CardActions, Button, Typography } from '@mui/material';

// function VideoPlayer({ src, websocketUrl }) {
//   const videoRef = useRef();
//   const canvasRef = useRef();
//   const [isPlaying, setIsPlaying] = useState(true);
//   const [metadata, setMetadata] = useState({ width: 0, height: 0, duration: 0 });
//   const [faces, setFaces] = useState([]);

//   useEffect(() => {
//     let hls;

//     if (Hls.isSupported()) {
//       hls = new Hls();
//       hls.loadSource(src);
//       hls.attachMedia(videoRef.current);
//       hls.on(Hls.Events.MANIFEST_PARSED, () => {
//         videoRef.current.play();
//       });
//     } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
//       videoRef.current.src = src;
//     }

//     const video = videoRef.current;
//     const handleLoadedMetadata = () => {
//       setMetadata({
//         width: video.videoWidth,
//         height: video.videoHeight,
//         duration: video.duration.toFixed(2),
//       });
//     };

//     video.addEventListener('loadedmetadata', handleLoadedMetadata);

//     return () => {
//       if (hls) hls.destroy();
//       video.removeEventListener('loadedmetadata', handleLoadedMetadata);
//     };
//   }, [src]);

//   // 🔁 WebSocket for face metadata
//   useEffect(() => {
//     const socket = new WebSocket(websocketUrl);

//     socket.onmessage = (event) => {
//       const data = JSON.parse(event.data);
//       if (data.type === 'faces') {
//         setFaces(data.data);
//       }
//     };

//     socket.onerror = (err) => console.error("WebSocket error:", err);
//     //return () => socket.close();
//     return() => {
//       if (socket.readyState === WebSocket.OPEN){
//         socket.close()
//       }
//     }
//   }, [websocketUrl]);

//   // 🎯 Draw bounding boxes
//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext('2d');
//     const video = videoRef.current;

//     const draw = () => {
//       if (!video || !ctx) return;
//       canvas.width = video.clientWidth;
//       canvas.height = video.clientHeight;
//       ctx.clearRect(0, 0, canvas.width, canvas.height);

//       faces.forEach(face => {
//         const [x, y, w, h] = face.box;
//         const scaleX = canvas.width / metadata.width;
//         const scaleY = canvas.height / metadata.height;

//         ctx.strokeStyle = 'lime';
//         ctx.lineWidth = 2;
//         ctx.strokeRect(x * scaleX, y * scaleY, w * scaleX, h * scaleY);

//         ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
//         ctx.fillRect(x * scaleX, y * scaleY, w * scaleX, h * scaleY);

//         ctx.font = '14px sans-serif';
//         ctx.fillStyle = 'lime';
//         ctx.fillText(`Conf: ${face.confidence}`, x * scaleX, (y - 5) * scaleY);
//       });

//       requestAnimationFrame(draw);
//     };

//     requestAnimationFrame(draw);
//   }, [faces, metadata]);

//   const handlePlayPause = () => {
//     const video = videoRef.current;
//     if (isPlaying) {
//       video.pause();
//     } else {
//       video.play();
//     }
//     setIsPlaying(!isPlaying);
//   };

//   return (
//     <Card sx={{ bgcolor: '#1e1e1e', color: '#fff', borderRadius: 2, boxShadow: 3, mt: 2, position: 'relative' }}>
//       <CardContent>
//         <div style={{ position: 'relative', width: '100%' }}>
//           <video
//             ref={videoRef}
//             controls
//             autoPlay
//             style={{ width: '100%', borderRadius: '10px', display: 'block' }}
//           />
//           <canvas
//             ref={canvasRef}
//             style={{
//               position: 'absolute',
//               top: 0,
//               left: 0,
//               zIndex: 10,
//               pointerEvents: 'none',
//             }}
//           />
//         </div>
//         <Typography variant="body2" sx={{ mt: 1 }}>
//           Resolution isss: {metadata.width}×{metadata.height} | Duration: {metadata.duration}s
//         </Typography>
//       </CardContent>
//       <CardActions>
//         <Button variant="contained" color="primary" onClick={handlePlayPause}>
//           {isPlaying ? 'Pause' : 'Play'}
//         </Button>
//       </CardActions>
//     </Card>
//   );
// }

// export default VideoPlayer;

import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { Card, CardContent, CardActions, Button, Typography } from '@mui/material';

function VideoPlayer({ src, websocketUrl }) {
  const videoRef = useRef();
  const canvasRef = useRef();
  const [isPlaying, setIsPlaying] = useState(true);
  const [metadata, setMetadata] = useState({ width: 0, height: 0, duration: 0 });
  const [faces, setFaces] = useState([]);

  // 🛰 Load HLS Stream
  useEffect(() => {
    let hls;

    if (Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(videoRef.current);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        videoRef.current.play();
      });
    } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
      videoRef.current.src = src;
    }

    const video = videoRef.current;
    const handleLoadedMetadata = () => {
      setMetadata({
        width: video.videoWidth,
        height: video.videoHeight,
        duration: video.duration.toFixed(2),
      });
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      if (hls) hls.destroy();
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [src]);

  // 🔌 WebSocket: Listen for face metadata
  useEffect(() => {
    const socket = new WebSocket(websocketUrl);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("websocket for ",websocketUrl);
      console.log(data);
      console.log("data type is",data.type);
      console.log("event type ", event.type)
      if (data.type === 'faces') {
        console.log("Received face data:", data.data);
        setFaces(data.data);
      }
      else {
        console.log("other data", data.JSON);
      }
    };

    socket.onerror = (err) => console.error("WebSocket error:", err);

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [websocketUrl]);

  // 🧠 Draw face boxes over video
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const video = videoRef.current;

    const draw = () => {
      if (!video || !ctx || !metadata.width || !metadata.height) return;

      canvas.width = video.clientWidth;
      canvas.height = video.clientHeight;

      const scaleX = canvas.width / metadata.width;
      const scaleY = canvas.height / metadata.height;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      faces.forEach((face) => {
        const [x, y, w, h] = face.box;

        const xScaled = x * scaleX;
        const yScaled = y * scaleY;
        const wScaled = w * scaleX;
        const hScaled = h * scaleY;

        ctx.strokeStyle = 'lime';
        ctx.lineWidth = 2;
        ctx.strokeRect(xScaled, yScaled, wScaled, hScaled);

        ctx.fillStyle = 'rgba(0, 255, 0, 0.25)';
        ctx.fillRect(xScaled, yScaled, wScaled, hScaled);

        ctx.font = '14px monospace';
        ctx.fillStyle = 'lime';
        ctx.fillText(`Conf: ${face.confidence.toFixed(2)}`, xScaled + 4, yScaled - 6);
      });

      requestAnimationFrame(draw);
    };

    const animationFrame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animationFrame);
  }, [faces, metadata]);

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <Card sx={{ bgcolor: '#1e1e1e', color: '#fff', borderRadius: 2, boxShadow: 3, mt: 2, position: 'relative' }}>
      <CardContent>
        <div style={{ position: 'relative', width: '100%' }}>
          <video
            ref={videoRef}
            controls
            autoPlay
            style={{ width: '100%', borderRadius: '10px', display: 'block' }}
          />
          <canvas
            ref={canvasRef}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              zIndex: 10,
              pointerEvents: 'none',
              width: '100%',
              height: '100%',
            }}
          />
        </div>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Resolution: {metadata.width}×{metadata.height} | Duration: {metadata.duration}s
        </Typography>
      </CardContent>
      <CardActions>
        <Button variant="contained" color="primary" onClick={handlePlayPause}>
          {isPlaying ? 'Pause' : 'Play'}
        </Button>
      </CardActions>
    </Card>
  );
}

export default VideoPlayer;
