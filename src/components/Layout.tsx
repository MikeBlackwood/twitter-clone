import type { PropsWithChildren } from "react";

const PageLayout = (props: PropsWithChildren) => {
  return (
    <main className="flex h-screen justify-center ">
      <div className="container h-screen w-full overflow-y-scroll  border-x border-slate-400 md:max-w-2xl">
        {props.children}
      </div>
    </main>
  );
};

export default PageLayout;
