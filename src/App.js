
//working
import React, { useState } from 'react';
import './App.css';
//import StreamForm from './StreamForm';
import VideoPlayer from './VideoPlayer';
import FFmpegMetadataViewer from './FFmpegMetadataViewer';
import SignIn from './components/SignIn/SignIn';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const darkBackgroundTheme = createTheme({
  palette: {
    mode: 'dark', // switch to dark mode
    background: {
      default: '#121212',
    },
    text: {
      primary: '#ffffff',
    },
  },
});


const App = () => {
  const [streams, setStreams] = useState([]);

  // const handleStreamStarted = (newStream) => {
  //   setStreams((prevStreams) => [...prevStreams, newStream]);
  // };

  return (
    <ThemeProvider theme={darkBackgroundTheme}>
      <div className="App">
          
        <SignIn />
        {/* <h2>RTSP Stream Dashboard</h2>
          <StreamForm onStreamStarted={handleStreamStarted} /> 

        <div className="stream-grid">
          {streams.map((stream, index) => (
            <div key={index} className="stream-card">
              <h4>{stream.rtspUrl}</h4>
              <FFmpegMetadataViewer />
              <VideoPlayer src={stream.hlsUrl} />
            </div>
          ))}
        </div>*/}
      </div>    
    </ThemeProvider>
  );
};

export default App;