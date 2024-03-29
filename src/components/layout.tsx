import type { PropsWithChildren } from "react";

export const PageLayout = (props: PropsWithChildren) => {
  return (
    <main className="flex h-screen justify-center">
      <div className="md:max-w-2x1 h-full w-full border-x border-slate-400">
        {props.children}
      </div>
    </main>
  );
};
