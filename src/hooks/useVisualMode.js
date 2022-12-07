import { useState } from 'react';

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);
  const transition = (newMode, replace = false) => {
    replace ?
      setHistory((prev) => {
        return [...prev.slice(0, -1), newMode] //delete last mode and add newMode in the end
      })
      :
      setHistory((prev) => [...prev, newMode]) //way to omit "return" and write code in one line
    return setMode(newMode);
  };

  const back = () => {
    setHistory((prev) => {
        prev.pop();
        return [...prev];
      }
    )
    return history.length >= 1 ? setMode(history[history.length - 2]) : setMode(mode);
  };
  return { mode, transition, back };
}
