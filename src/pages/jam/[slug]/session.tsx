import Head from "next/head";
import React, { useState, useEffect } from "react";

export default function Session() {
  type Song = {
    title: string;
    artist: string;
  };
  interface StoredSong {
    song: Song;
  }
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [nextSong, setNextSong] = useState<Song | null>(null);
  const [selectedSongs, setSelectedSongs] = useState<Song[]>([]);
  const TIMER_SETTINGS = {
    SLOW: 60000, // 1 minute
    NORMAL: 45000, // 45 seconds
    FAST: 15000, // 15 seconds
  };
  const [timerSetting, setTimerSetting] = useState(TIMER_SETTINGS.NORMAL);
  const [sessionComplete, setSessionComplete] = useState(false);

  useEffect(() => {
    const storedSongs = localStorage.getItem("displayedSongs");

    if (storedSongs) {
      const parsedData = JSON.parse(storedSongs) as StoredSong[];

      if (parsedData) {
        const songs = parsedData.map((item: StoredSong) => item.song);
        setSelectedSongs(songs);
        if (songs.length > 1) {
          setCurrentSong(songs[0] ? songs[0] : null);
          setNextSong(songs[1] ? songs[1] : null);
        }
      }
    }
  }, []);

  let currentSongIndex = 0;

  const getNextSong = () => {
    if (selectedSongs.length > 0) {
      setCurrentSong(selectedSongs[currentSongIndex] ?? null);
      currentSongIndex = (currentSongIndex + 1) % selectedSongs.length;
      setNextSong(selectedSongs[currentSongIndex] ?? null);
    } else {
      setCurrentSong(null);
      setNextSong(null);
    }
  };
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (!sessionComplete) {
      timer = setInterval(getNextSong, timerSetting);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [currentSong, nextSong, selectedSongs, timerSetting, sessionComplete]);

  return (
    <>
      <Head>
        <title>Session</title>
        <meta name="description" content="Session" />
        <link
          rel="icon"
          href="https://m.media-amazon.com/images/I/41yr3UuyZhL.__AC_SX300_SY300_QL70_FMwebp_.jpg"
        />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div title="SpeedButtons">
          <button
            className={
              timerSetting === TIMER_SETTINGS.SLOW
                ? "ml-4 mr-4 text-red-500"
                : "ml-4 mr-4 "
            }
            onClick={() => setTimerSetting(TIMER_SETTINGS.SLOW)}
          >
            Slow
          </button>
          <button
            className={
              timerSetting === TIMER_SETTINGS.NORMAL
                ? "ml-4 mr-4 text-red-500"
                : "ml-4 mr-4 "
            }
            onClick={() => setTimerSetting(TIMER_SETTINGS.NORMAL)}
          >
            Normal
          </button>
          <button
            className={
              timerSetting === TIMER_SETTINGS.FAST
                ? "ml-4 mr-4 text-red-500"
                : "ml-4 mr-4 "
            }
            onClick={() => setTimerSetting(TIMER_SETTINGS.FAST)}
          >
            Fast
          </button>
        </div>
        <div>Session</div>
        {sessionComplete && <div>Session Complete</div>}
        {!sessionComplete && currentSong && (
          <div>
            Now Playing: {currentSong.title} by {currentSong.artist}
          </div>
        )}
        {!sessionComplete && nextSong && (
          <div>
            Up Next: {nextSong.title} by {nextSong.artist}
          </div>
        )}
        {!sessionComplete && (
          <button onClick={() => getNextSong()}>Next Song</button>
        )}
        {!sessionComplete && (
          <button onClick={() => setSessionComplete(true)}>
            Complete Session
          </button>
        )}
      </main>
    </>
  );
}
