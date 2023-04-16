import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Link from "next/link";
import CreatePostWizard from "~/components/CreatePostWizard";
import PageLayout from "~/components/Layout";
import LoadingSpinner from "~/components/LoadingSpinner";
import PostView from "~/components/PostView";

import { api } from "~/utils/api";

const Feed = () => {
  const { isLoading, data: posts, error } = api.post.getAll.useQuery();
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center align-middle">
        <LoadingSpinner />
      </div>
    );
  }
  if (error) {
    return <div>error</div>;
  }
  return (
    <div className="flex flex-col">
      {posts?.map((fullPost) => {
        return <PostView key={fullPost.post.id} {...fullPost} />;
      })}
    </div>
  );
};
const Home: NextPage = () => {
  const { user, isLoaded: userLoaded, isSignedIn } = useUser();
  // Prefetching
  api.post.getAll.useQuery();
  if (!userLoaded) {
    return (
      <div className="flex h-screen w-full items-center justify-center align-middle">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <PageLayout>
      <div className="flex justify-end border-b border-slate-400">
        <div className="flex h-10 pr-2">
          {!isSignedIn && <SignInButton />}
          {isSignedIn && <SignOutButton />}
        </div>
      </div>
      <div>{isSignedIn && <CreatePostWizard />}</div>
      <Feed />
    </PageLayout>
  );
};

export default Home;
