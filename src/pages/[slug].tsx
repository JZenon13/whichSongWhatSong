import Head from "next/head";
import { api } from "~/utils/api";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { db } from "~/server/db";
import { appRouter } from "~/server/api/root";
import superjson from "superjson";
import type { GetStaticProps, NextPage } from "next";

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  const { data } = api.profile.getUserByUserName.useQuery({ username });

  if (!data) {
    return <div>404</div>;
  }

  return (
    <>
      <Head>
        <title>{data?.username}</title>
        <meta name="description" content="User Profile" />
        <link
          rel="icon"
          href="https://m.media-amazon.com/images/I/41yr3UuyZhL.__AC_SX300_SY300_QL70_FMwebp_.jpg"
        />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div>{data?.username}</div>
        testing
      </main>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = createServerSideHelpers({
    router: appRouter,
    ctx: { db, userId: null },
    transformer: superjson,
  });

  const slug = context.params?.slug;

  if (typeof slug !== "string") {
    throw new Error("slug is not a string");
  }

  const username = slug.replace("@", "");

  await ssg.profile.getUserByUserName.prefetch({ username });
  return {
    props: {
      trpcState: ssg.dehydrate(),
      username,
    },
  };
};
export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export default ProfilePage;
