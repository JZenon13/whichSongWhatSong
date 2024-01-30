import Head from "next/head";
import React from "react";

export default function SingleSong() {
  return (
    <>
      <Head>
        <title>SingleSong</title>
        <meta name="description" content="Song" />
        <link
          rel="icon"
          href="https://m.media-amazon.com/images/I/41yr3UuyZhL.__AC_SX300_SY300_QL70_FMwebp_.jpg"
        />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div>Song</div>
      </main>
    </>
  );
}
