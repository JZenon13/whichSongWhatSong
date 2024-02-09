import Head from "next/head";
import React, { useState, useEffect } from "react";

export default function Session() {
  const [currentSong, setCurrentSong] = useState<{
    song: {
      id: number;
      title: string;
      artist: string;
      key: string;
      genre: string;
      createdAt: Date;
      updatedAt: Date;
    } | null;
  } | null>(null);

  const [nextSong, setNextSong] = useState<{
    song: {
      id: number;
      title: string;
      artist: string;
      key: string;
      genre: string;
      createdAt: Date;
      updatedAt: Date;
    } | null;
  } | null>(null);
  const [selectedSongs, setSelectedSongs] = useState<
    {
      id: number;
      title: string;
      artist: string;
      key: string;
      genre: string;
      createdAt: Date;
      updatedAt: Date;
    }[]
  >([]);
  const TIMER_SETTINGS = {
    SLOW: 60000, // 1 minute
    NORMAL: 45000, // 45 seconds
    FAST: 15000, // 15 seconds
  };
  const [timerSetting, setTimerSetting] = useState(TIMER_SETTINGS.NORMAL);
  useEffect(() => {
    const storedSongs = localStorage.getItem("displayedSongs");
    if (storedSongs) {
      const songs = JSON.parse(storedSongs) as {
        id: number;
        title: string;
        artist: string;
        key: string;
        genre: string;
        createdAt: Date;
        updatedAt: Date;
      }[];
      setSelectedSongs(songs);
      if (songs.length > 0) {
        setCurrentSong({ song: songs[0] ?? null });
        setNextSong(songs[1] ? { song: songs[1] } : null);
      }
    }
  }, []);
  const getNextSong = () => {
    const remainingSongs: {
      id: number;
      title: string;
      artist: string;
      key: string;
      genre: string;
      createdAt: Date;
      updatedAt: Date;
    }[] = selectedSongs.filter((song) => song.id !== currentSong?.song?.id);

    if (remainingSongs.length > 0) {
      const randomIndex = Math.floor(Math.random() * remainingSongs.length);
      const nextSong = remainingSongs[randomIndex];
      setCurrentSong({ song: nextSong ?? null });
    } else {
      setCurrentSong({ song: null });
      setNextSong({ song: null });
    }
  };
  useEffect(() => {
    const timer = setInterval(getNextSong, timerSetting);
    return () => clearInterval(timer);
  }, [currentSong, nextSong, selectedSongs, timerSetting]);

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
          <button onClick={() => setTimerSetting(TIMER_SETTINGS.SLOW)}>
            Slow
          </button>
          <button onClick={() => setTimerSetting(TIMER_SETTINGS.NORMAL)}>
            Normal
          </button>
          <button onClick={() => setTimerSetting(TIMER_SETTINGS.FAST)}>
            Fast
          </button>
        </div>
        <div>Session</div>
        {currentSong && (
          <div>
            Now Playing: {currentSong.song?.title} by {currentSong.song?.artist}
          </div>
        )}
        {nextSong && (
          <div>
            Up Next: {nextSong.song?.title} by {nextSong.song?.artist}
          </div>
        )}
        <button onClick={() => getNextSong()}>Next Song</button>
      </main>
    </>
  );
}
