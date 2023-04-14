import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import { api } from "~/utils/api";
import LoadingSpinner from "./LoadingSpinner";

const CreatePostWizard = () => {
  const user = useUser();
  const [input, setInput] = useState("");
  const ctx = api.useContext();
  const { mutate, isLoading: isPosting } = api.post.create.useMutation({
    onSuccess: () => {
      setInput("");
      void ctx.post.getAll.invalidate();
    },
    onError: (err) => {
      const errorMessage = err.data?.zodError?.fieldErrors.content;
      if (errorMessage && errorMessage[0]) {
        toast.error(errorMessage[0]);
      } else {
        toast.error("Something went wrong");
      }
    },
  });

  if (!user || !user.isLoaded) {
    return <div>loading</div>;
  }
  if (user) {
    return (
      <div className="flex gap-3 border-b border-slate-400 p-4">
        <Image
          className="h-10 w-10 rounded-full"
          src={user.user!.profileImageUrl}
          width={56}
          height={56}
          alt=""
        />

        <input
          className=" grow bg-transparent outline-none "
          placeholder="Type something"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isPosting}
        />
        {input !== "" && !isPosting && (
          <button
            onClick={() => mutate({ content: input })}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (input !== "") {
                  mutate({ content: input });
                }
              }
            }}
            disabled={isPosting}
          >
            Post
          </button>
        )}
        {input !== "" && isPosting && (
          <div className="flex items-center justify-center">
            <LoadingSpinner size={10} />
          </div>
        )}
      </div>
    );
  }

  return <div>not signed in</div>;
};
export default CreatePostWizard;
