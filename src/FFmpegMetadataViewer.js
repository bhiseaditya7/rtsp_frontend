import { useEffect } from 'react';

function FFmpegMetadataViewer() {
  useEffect(() => {
    const socket = new WebSocket('wss://rtsp1.onrender.com/ws/metadata/');

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("FFmpeg Metadata:", data);
      // You can update state here to display metadata in UI
    };

    socket.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    return () => socket.close();
  }, []);

  return <div>Listening for FFmpeg metadata...</div>;
}

export default FFmpegMetadataViewer;
