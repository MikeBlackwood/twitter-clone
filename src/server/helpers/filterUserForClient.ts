import { type User } from "@clerk/nextjs/dist/api";


const filterUsersForClient = (user: User) => {
    return {
        id: user.id,
        username: user.username,
        profileImageUrl: user.profileImageUrl,
    }
}


export default filterUsersForClient;