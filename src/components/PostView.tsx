import { type RouterOutputs } from "~/utils/api"
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Image from "next/image";
type PostWithUser = RouterOutputs['post']['getAll'][number];
dayjs.extend(relativeTime)
const PostView = (props: PostWithUser) => {
    const {post, author} = props;
    return <div className="p-4 border-b border-slate-400 flex gap-3" key={post.id}>
        
        <Image className="h-10 w-10 rounded-full" src={author.profileImageUrl} width={56}
          height={56}
          alt=""/>
        <div className="flex flex-col">
        <div className="flex">
        <span className=" font-bold text-slate-200">{`@${author.username}`}</span> 
        <span className="font-thin">{` • ${dayjs(post.createdAt).fromNow()}`}</span>
        </div>
        <span className="text-slate-200">{post.content}</span>
        </div>
        </div>   
}
export default PostView;