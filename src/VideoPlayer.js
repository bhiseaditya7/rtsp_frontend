import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { Card, CardContent, CardActions, Button, Typography } from '@mui/material';

function VideoPlayer({ src }) {
  const videoRef = useRef();
  const [isPlaying, setIsPlaying] = useState(true);
  const [metadata, setMetadata] = useState({ width: 0, height: 0, duration: 0 });

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
    <Card sx={{ bgcolor: '#1e1e1e', color: '#fff', borderRadius: 2, boxShadow: 3, mt: 2 }}>
      <CardContent>
        <video ref={videoRef} controls autoPlay width="100%" height="auto" style={{ borderRadius: '10px' }} />
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
