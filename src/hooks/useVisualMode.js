import React, { useState } from 'react';

export default function useVisualMode(initial) {
  const [mode,setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);
  const transition = (newMode, replace = false) => { 
    if (replace) {
      history.pop()
    }
    history.push(newMode)
    return setMode(newMode) 
  };
 
  const back = () => { 
    history.pop();
    return history.length >= 1?
    setMode(history[history.length -1])
      :
    setMode(mode) 
  };
  return { mode, transition, back };
}
