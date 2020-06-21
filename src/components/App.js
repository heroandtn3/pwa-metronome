import { Metronome } from 'musical-metronome';
import React, { useEffect, useRef, useState } from 'react';
import styles from './App.module.css';
import Control from './Control';

function App() {
  const [playing, setPlaying] = useState(false);
  const [tempo, setTempo] = useState(120);
  const metronomeRef = useRef();
  const [initialized, setInitialized] = useState(false);
  const intervalIdRef = useRef();

  useEffect(() => {
    metronomeRef.current = new Metronome({
      tempo: 120,
    });

    return () => clearInterval(intervalIdRef.current);
  }, []);

  useEffect(() => {
    metronomeRef.current.setTempo(tempo);
  }, [tempo]);

  useEffect(() => {
    if (!initialized) {
      return;
    }

    if (playing) {
      intervalIdRef.current = setInterval(() => metronomeRef.current.tick(), 25);
      metronomeRef.current.start();
    } else {
      clearInterval(intervalIdRef.current);
      metronomeRef.current.stop();
    }
  }, [playing, initialized]);

  useEffect(() => {
    const handleClick = () => {
      metronomeRef.current.init();
      document.removeEventListener('click', handleClick);
      setInitialized(true);
    };
    document.addEventListener('click', handleClick);

    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.logo}>Metronome</span>
      </div>
      <Control
        playing={playing}
        tempo={tempo}
        onPlayingChange={setPlaying}
        onTempoChange={setTempo}
      />
    </div>
  );
}

export default App;
