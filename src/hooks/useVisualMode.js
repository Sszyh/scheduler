import React, { useState } from 'react';

export default function useVisualMode(initial) {
  const [mode,setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);
  const transition = (newMode) => { 
    setMode(newMode) 
    history.push(newMode);
  };
 
  const back = () => { 
    history.pop();
    history.length >= 1?
    setMode(history[history.length -1])
      :
    setMode(mode) 
  };
  return { mode, transition, back };
}
