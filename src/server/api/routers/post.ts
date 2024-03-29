import { clerkClient } from "@clerk/nextjs/server";
import { type Post } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { z } from "zod";

import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";
import filterUsersForClient from "~/server/helpers/filterUserForClient";



const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "1 m"),
  analytics: true,
  prefix: "@upstash/ratelimit",
});

const addUserDataToPosts = async (posts: Post[]) => {
  const users = (await clerkClient.users.getUserList(
    {
      userId: posts.map((post) => post.authorId),
      limit: 100,
    }
  )).map(filterUsersForClient);
  return posts.map((post) => {
    const author = users.find((user) => user.id === post.authorId)
    if(!author || !author.username) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Could not find author for post'})
    }
    return {
      post,
      author: {
        ...author,
        username: author.username,
      }
    };
  })
}

export const postRouter = createTRPCRouter({
  getById: publicProcedure.input(z.object({id: z.string()})).query(async ({ ctx, input }) => {
    const post = await ctx.prisma.post.findUnique({where:{id: input.id}});
    if(!post)
    {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Could not find post'
      })
    }
    return (await addUserDataToPosts([post]))[0];
  }),
  getAll: publicProcedure.query( async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany(
      {
        take: 100,
        orderBy:[ {
          createdAt: 'desc',
        }],
      }
    );
    return addUserDataToPosts(posts)
  }),
  create: privateProcedure.input(z.object({
    content: z.string().min(1).max(255),
  })).mutation(async ({ ctx, input }) => {
    const authorId = ctx.userId; 
    const {success} = await ratelimit.limit(authorId);
    if (!success) {
      throw new TRPCError({
        code: 'TOO_MANY_REQUESTS',
        message: 'Rate limit exceeded',
      });
    }

    const post = await ctx.prisma.post.create({
      data: {
        authorId,
        content: input.content,
      }
   });
  return post;
  }),
  getPostsByUserId: publicProcedure.input(z.object({userId: z.string()})).
  query(async ({ ctx, input }) => {
     const {userId}  = input;
      const posts = await ctx.prisma.post.findMany({
        where: {
          authorId: userId,
        }, take: 100,
        orderBy:[ {
          createdAt: 'desc',
        }],
      });
        return addUserDataToPosts(posts);
  })
});
