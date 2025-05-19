
import React, { useState } from 'react';
import './App.css';
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
  return (
    <ThemeProvider theme={darkBackgroundTheme}>
      <div className="App">
          
        <SignIn />
      </div>    
    </ThemeProvider>
  );
};

export default App;