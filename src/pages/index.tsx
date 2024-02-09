import Link from "next/link";
import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { LoadingPage, LoadingSpinner } from "../components/loading";
import { RouterOutputs, api } from "~/utils/api";
import React, { useState } from "react";
import toast from "react-hot-toast";

const CreateSongWizard = () => {
  const { user } = useUser();
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [key, setKey] = useState("C");
  const [mode, setMode] = useState("Major");
  const [genre, setGenre] = useState("");

  if (!user) {
    return null;
  }

  const ctx = api.useUtils();
  const { mutate, isLoading: isPosting } = api.song.create.useMutation({
    onSuccess: () => {
      setTitle("");
      setArtist("");
      setKey("");
      setGenre("");
      void ctx.song.getAll.invalidate();
    },
    onError: () => {
      toast.error("Failed to create song");
    },
  });

  return (
    <div className="flex w-full gap-3">
      <img
        src={user.imageUrl}
        alt={`${user.fullName} pic`}
        className="h-14 w-14 rounded-full"
      />
      <input
        type="text"
        placeholder="Song Title"
        className="bg-transparent outline-none"
        onChange={(e) => setTitle(e.target.value)}
        value={title}
        disabled={isPosting}
      />
      <input
        type="text"
        placeholder="Artist Name"
        className="bg-transparent outline-none"
        onChange={(e) => setArtist(e.target.value)}
        value={artist}
        disabled={isPosting}
      />
      <input
        list="genres"
        placeholder="Genre"
        className="bg-transparent outline-none"
        onChange={(e) => setGenre(e.target.value.toLocaleLowerCase())}
        value={genre}
        disabled={isPosting}
      />
      <datalist id="genres">
        <option value="rock" />
        <option value="pop" />
        <option value="jazz" />
        <option value="electronic" />
        <option value="Classical" />
        <option value="hip-hop" />
      </datalist>
      <label>Choose a Key:</label>
      <select
        id="Song Key"
        onChange={(e) => setKey(e.target.value + " " + mode)}
      >
        <option value="C">C</option>
        <option value="C#">C#</option>
        <option value="Db">Db</option>
        <option value="D">D</option>
        <option value="D#">D#</option>
        <option value="Eb">Eb</option>
        <option value="E">E</option>
        <option value="F">F</option>
        <option value="F#">F#</option>
        <option value="Gb">Gb</option>
        <option value="G">G</option>
        <option value="G#">G#</option>
        <option value="Ab">Ab</option>
        <option value="A">A</option>
        <option value="A#">A#</option>
        <option value="Bb">Bb</option>
        <option value="B">B</option>
      </select>
      <input
        type="radio"
        name="Mode"
        value="Major"
        checked={mode === "Major"}
        onChange={(e) => setMode(e.target.value)}
      />
      <label>Major</label>
      <br />
      <input
        type="radio"
        name="Mode"
        checked={mode === "Minor"}
        value="Minor"
        onChange={(e) => setMode(e.target.value)}
      />
      <label>Minor</label>
      <br />

      {title && artist && key !== "" && !isPosting && (
        <button
          onClick={() =>
            mutate({
              title: title,
              artist: artist,
              key: key,
              genre: genre,
            })
          }
          disabled={isPosting}
        >
          Post
        </button>
      )}
      {isPosting && (
        <div>
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
};

const Feed = () => {
  const { data, isLoading: songsLoading } = api.song.getAll.useQuery();

  if (songsLoading) {
    return <LoadingPage />;
  }

  if (!data) {
    return <div>Something went wrong</div>;
  }

  return (
    <div>
      {data?.map((fullPost) => (
        <SongView {...fullPost} key={fullPost?.song.id} />
      ))}
    </div>
  );
};

type SongWithUser = RouterOutputs["song"]["getAll"][number];
const SongView = (props: SongWithUser) => {
  const { song } = props;

  return (
    <div key={song.id}>
      <Link
        className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
        href={`/song/${song.id}`}
      >
        <h3 className="text-2xl font-bold">Play-Along →</h3>
        <div className="text-lg">{song.title}</div>
        <div className="text-lg">{song.artist}</div>
      </Link>
    </div>
  );
};
export default function Home() {
  const { isLoaded: userLoaded, isSignedIn, user } = useUser();

  api.song.getAll.useQuery();
  if (!userLoaded) return <div />;
  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div>
          {!isSignedIn && (
            <div className="flex justify-center">
              <SignInButton />
            </div>
          )}
          {isSignedIn && (
            <div className="flex justify-center">
              <CreateSongWizard />
              <SignOutButton />
            </div>
          )}
        </div>
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Time To
            <Link href={`/jam/${user?.fullName}`}>
              <span className="text-[hsl(280,100%,70%)]"> Jam</span>
            </Link>
          </h1>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
            <div>
              <Feed />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
