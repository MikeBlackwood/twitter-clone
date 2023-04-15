import { type RouterOutputs } from "~/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import Link from "next/link";
type PostWithUser = RouterOutputs["post"]["getAll"][number];
dayjs.extend(relativeTime);

const PostView = (props: PostWithUser) => {
  const { post, author } = props;
  return (
    <div className="flex gap-3 border-b border-slate-400 p-4" key={post.id}>
      <Image
        className="h-10 w-10 rounded-full"
        src={author.profileImageUrl}
        width={56}
        height={56}
        alt=""
      />
      <div className="flex flex-col">
        <div className="flex">
          <Link href={`/@${author.username}`}>
            <span className=" font-bold text-slate-200">{`@${author.username}`}</span>
          </Link>
          <Link href={`/post/${post.id}`}>
            <span className="font-thin">
              {" "}
              &nbsp;{`• ${dayjs(post.createdAt).fromNow()}`}
            </span>
          </Link>
        </div>
        <span className="text-xl text-slate-200">{post.content}</span>
      </div>
    </div>
  );
};
export default PostView;
