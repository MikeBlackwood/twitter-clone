import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useState } from "react";
import { api } from "~/utils/api";

const CreatePostWizard = () => {
  const user = useUser();
  const [input, setInput] = useState("");
  const ctx = api.useContext();
  const { mutate, isLoading: isPosting } = api.post.create.useMutation({
    onSuccess: () => {
      setInput("");
      void ctx.post.getAll.invalidate();
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
        <button onClick={() => mutate({ content: input })}>Post</button>
      </div>
    );
  }

  return <div>not signed in</div>;
};
export default CreatePostWizard;
