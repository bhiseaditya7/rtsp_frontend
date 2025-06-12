import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Snackbar,
  Alert,
} from '@mui/material';

function VideoPlayer({ src, websocketUrl }) {
  const videoRef = useRef();
  const canvasRef = useRef();
  const hasAlerted = useRef(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [videoSize, setVideoSize] = useState({ width: 0, height: 0 });
  const [faces, setFaces] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Load HLS stream
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
      setVideoSize({
        width: video.videoWidth,
        height: video.videoHeight,
      });
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      if (hls) hls.destroy();
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [src]);

  // WebSocket connection
  useEffect(() => {
    const socket = new WebSocket(websocketUrl);
    console.log("socket url is",socket);
    console.log("socket2 is ", websocketUrl);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("data", data);

      if (data?.data?.[0]?.confidence > 0.8 && !hasAlerted.current) {
        hasAlerted.current = true;
        setSnackbarMessage(`High confidence face detected! Confidence: ${data.data[0].confidence.toFixed(2)}`);
        setSnackbarOpen(true);
      }

      if (data.type === 'face_boxes' && Array.isArray(data.faces)) {
        setFaces(data.faces);
        setVideoSize({
          width: data.frame_width,
          height: data.frame_height,
        });
      }
    };

    socket.onerror = (err) => console.error("WebSocket error:", err);

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [websocketUrl]);

  // Canvas drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const video = videoRef.current;

    const draw = () => {
      if (!video || !ctx || !videoSize.width || !videoSize.height) return;

      canvas.width = video.clientWidth;
      canvas.height = video.clientHeight;

      const scaleX = canvas.width / videoSize.width;
      const scaleY = canvas.height / videoSize.height;

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
  }, [faces, videoSize]);

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Card sx={{ bgcolor: '#1e1e1e', color: '#fff', borderRadius: 2, boxShadow: 3, mt: 2, position: 'relative' }}>
        <CardContent>
          <div style={{ position: 'relative', width: '100%' }}>
            <video
              ref={videoRef}
              controls
              autoPlay
              muted
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
            Resolution: {videoSize.width}×{videoSize.height}
          </Typography>
        </CardContent>
        <CardActions>
          <Button variant="contained" color="primary" onClick={handlePlayPause}>
            {isPlaying ? 'Pause' : 'Play'}
          </Button>
        </CardActions>
      </Card>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

export default VideoPlayer;
