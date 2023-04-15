import type { User } from "@clerk/nextjs/dist/api";
import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import filterUsersForClient from "~/server/helpers/filterUserForClient";

export const profileRouter = createTRPCRouter({
 getUserByUsername: publicProcedure.input(z.object({username: z.string()})).query(async ({ ctx, input }) => {
    
    const [user] = await clerkClient.users.getUserList({
       username: [input.username]
    });
    
    if(!user) {
        throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'User not found',
        });
    }
        return filterUsersForClient(user);
})});
