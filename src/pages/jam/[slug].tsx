import Head from "next/head";
import { api } from "~/utils/api";
import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

const ProfilePage = () => {
  const { data: songs, isLoading: songsLoading } = api.song.getAll.useQuery();

  const { user } = useUser();
  const [genreFilter, setGenreFilter] = useState("");
  const [artistFilter, setArtistFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSongs, setSelectedSongs] = useState<
    {
      song: {
        id: number;
        title: string;
        artist: string;
        key: string;
        genre: string;
        createdAt: Date;
        updatedAt: Date;
      };
    }[]
  >([]);

  const songsPerPage = 10;

  useEffect(() => {
    if (!songs || songsLoading) {
      return;
    }
    setSelectedSongs(songs);
  }, [songs, songsLoading]);

  useEffect(() => {
    if (!songs || songsLoading) {
      return;
    }
    let filteredSongs = songs;
    if (genreFilter) {
      filteredSongs = songs.filter((song) => song.song.genre === genreFilter);
    } else if (artistFilter) {
      filteredSongs = songs.filter((song) => song.song.artist === artistFilter);
    }
    setSelectedSongs(filteredSongs);
  }, [songs, songsLoading, genreFilter, artistFilter]);

  const totalPages = Math.ceil((selectedSongs?.length ?? 0) / songsPerPage);
  const displayedSongs = selectedSongs?.slice(
    (currentPage - 1) * songsPerPage,
    currentPage * songsPerPage,
  );

  const genres = [...new Set(songs?.map((song) => song.song.genre))];
  const artists = [...new Set(songs?.map((song) => song.song.artist))];

  return (
    <>
      <Head>
        <title>Jam</title>
        <meta name="description" content="User Profile" />
        <link
          rel="icon"
          href="https://m.media-amazon.com/images/I/41yr3UuyZhL.__AC_SX300_SY300_QL70_FMwebp_.jpg"
        />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <label>Genre</label>
        <input
          list="genres"
          onBlur={(e) => {
            if (genres.includes(e.target.value)) {
              setGenreFilter(e.target.value);
            }
          }}
        />
        <datalist id="genres">
          {genres.map((genre, index) => (
            <option key={index} value={genre} />
          ))}
        </datalist>
        <label>Artist</label>
        <input
          list="artists"
          onBlur={(e) => {
            if (artists.includes(e.target.value)) {
              setArtistFilter(e.target.value);
            }
          }}
        />
        <datalist id="artists">
          {artists.map((artist, index) => (
            <option key={index} value={artist} />
          ))}
        </datalist>
        <Link href={`/jam/${user?.fullName}/session`}>
          <button
            onClick={() =>
              localStorage.setItem(
                "displayedSongs",
                JSON.stringify(displayedSongs),
              )
            }
          >
            Start Session
          </button>
        </Link>
        {displayedSongs?.map((song) => (
          <div
            key={song.song.id}
            className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
          >
            <h2>{song.song.title}</h2>
            <p>{song.song.artist}</p>
            <p>{song.song.genre}</p>
          </div>
        ))}
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </button>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </main>
    </>
  );
};

export default ProfilePage;
