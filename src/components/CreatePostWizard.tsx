import { useUser } from "@clerk/nextjs";
import Image from "next/image";

const CreatePostWizard = () => {
  const user = useUser();

  if (!user || !user.isLoaded) {
    return <div>loading</div>;
  }
  if (user) {
    return (
      <div className="flex gap-3 p-4">
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
        />
      </div>
    );
  }
  
  return <div>not signed in</div>;
};
export default CreatePostWizard;
