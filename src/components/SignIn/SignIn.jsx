// src/components/SignIn.js
import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
//import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import StreamForm from '../../StreamForm';
import VideoPlayer from '../../VideoPlayer';
import FFmpegMetadataViewer from '../../FFmpegMetadataViewer1';

export default function SignIn() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state
  const [streams, setStreams] = useState([]); 

  const handleStreamStarted = (newStream) => {
    setStreams((prevStreams) => [...prevStreams, newStream]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/signin/', {
      //const response = await fetch('https://rtsp1.onrender.com/api/signin/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
        username: data.get('username'),
        password1: data.get('password1'),
      }),
      });

      if (response.ok) {
        alert("Login Successfull!");
        const result = await response.json();
        localStorage.setItem('access', result.access);
        setIsLoggedIn(true); // Switch to StreamForm
      } else {
        alert('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  if (isLoggedIn) {
    return (
      <Box sx={{ padding: 4 }}>
        <StreamForm onStreamStarted={handleStreamStarted} />

        <div className="stream-grid" style={{ marginTop: '2rem' }}>
          {streams.map((stream, index) => (
            <div key={index} className="stream-card" style={{ marginBottom: '1.5rem' }}>
              <h4>{stream.rtspUrl}</h4>
              <FFmpegMetadataViewer />
              <VideoPlayer src={stream.hlsUrl} websocketUrl={`ws://127.0.0.1:8000/ws/faces/`}/>
            </div>
          ))}
        </div>
      </Box>
    );
  }




  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField margin="normal" required fullWidth id="email" label="Username" name="username" autoComplete="email" autoFocus />
          <TextField margin="normal" required fullWidth name="password1" label="Password" type="password" id="password" autoComplete="current-password" />
          <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me" />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Sign In
          </Button>
          <Grid container>
            {/* <Grid item xs>
              <Link href="#" variant="body2">Forgot password?</Link>
            </Grid> */}
            {/* <Grid item>
              <Link href="#" variant="body2">{"Don't have an account? Sign Up"}</Link>
            </Grid> */}
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
