import {SignInButton, SignOutButton, useUser } from "@clerk/nextjs";

import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import CreatePostWizard from "~/components/CreatePostWizard";
import LoadingSpinner from "~/components/LoadingSpinner";
import PostView from "~/components/PostView";

import { api } from "~/utils/api";

const Home: NextPage = () => {
  const user = useUser();
  const {isLoading, data: posts, error} = api.post.getAll.useQuery();
  
  if(isLoading )
  {
    return (
    <div className="flex w-full h-screen justify-center align-middle items-center">
    <LoadingSpinner/>
    </div>)
  }
  if(error)
  {
    return <div>error</div>
  }
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col items-center justify-center ">
        <div className="container w-full md:max-w-2xl border-x border-slate-400 h-screen">
        
          <div className="border-b border-slate-400 flex justify-end">
            <div className="pr-2 flex h-10">
            {!user.isSignedIn && <SignInButton/>}
            {!!user.isLoaded && <SignOutButton/>}
            </div>
          </div>
          <div>
            {user.isSignedIn && <CreatePostWizard/>}
          
          
          </div>
          <div className="flex flex-col"> 
          {posts?.map((fullPost) => {
            return <PostView key={fullPost.post.id} {...fullPost} />
          })}
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
