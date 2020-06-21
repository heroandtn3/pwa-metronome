import React, { useCallback, useEffect, useRef, useState } from 'react';
import { IS_MOBILE } from '../common/browser';
import classNames from '../common/classNames';
import { ReactComponent as PauseIcon } from '../icons/pause.svg';
import { ReactComponent as PlayIcon } from '../icons/play.svg';
import styles from './Control.module.css';

export default function Control({ playing: _playing, onPlayingChange, tempo: _tempo, onTempoChange }) {
  const [playing, setPlaying] = useState(false);
  const [touched, setTouched] = useState(false);
  const [tempo, setTempo] = useState(120);
  const intervalIdRef = useRef();
  const timeoutIdRef = useRef();

  const handleMouseDown = useCallback((event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    let x = event.clientX - rect.left; // x position within the element.

    if (IS_MOBILE && !event.touches) {
      return;
    }

    if (event.touches && event.touches.length) {
      x = event.touches[0].clientX - rect.left;
    }

    if (x < rect.width * 1 / 4) {
      setTouched('left');
    } else if (x > rect.width * 3 / 4) {
      setTouched('right');
    } else {
      setTouched('center');
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    setTouched(false);
  }, []);

  useEffect(() => {
    switch (touched) {
      case 'left':
        setTempo(old => old - 1);
        timeoutIdRef.current = setTimeout(() => {
          intervalIdRef.current = setInterval(() => setTempo(old => old - 1), 100);
        }, 300);

        break;
      case 'right':
        setTempo(old => old + 1);
        timeoutIdRef.current = setTimeout(() => {
          intervalIdRef.current = setInterval(() => setTempo(old => old + 1), 100);
        }, 300);
        break;
      case 'center':
        setPlaying(old => !old);
        clearInterval(intervalIdRef.current);
        clearTimeout(timeoutIdRef.current);
        break;
      default:
        clearInterval(intervalIdRef.current);
        clearTimeout(timeoutIdRef.current);
        break;
    }
  }, [touched]);

  useEffect(() => onPlayingChange(playing), [onPlayingChange, playing]);
  useEffect(() => onTempoChange(tempo), [onTempoChange, tempo]);
  useEffect(() => setPlaying(_playing), [_playing]);
  useEffect(() => setTempo(_tempo), [_tempo]);

  return (
    <div className={styles.control}>
        <span className={styles.tempo}>{tempo}</span>
        <div
          className={classNames(styles.circle, touched === 'right' && styles.circleRight, touched === 'left' && styles.circleLeft)}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchEnd={handleMouseUp}
        >
          {playing ? (
            <PauseIcon className={styles.icon} />
          ) : (
              <PlayIcon className={styles.icon} />
            )}
        </div>

      </div>
  );
}
