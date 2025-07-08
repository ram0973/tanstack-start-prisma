import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import type { CreatePost } from '@/types/posts/CreatePost'
import type { UpdatePost } from '@/types/posts/UpdatePost'
import { createServerFn } from '@tanstack/react-start'
import { getWebRequest } from '@tanstack/react-start/server'
import type z from 'zod'
import { ServerBlockNoteEditor } from "@blocknote/server-util"

const POSTS_ON_HOME = 10

export const createPost = createServerFn({ method: 'POST' })
  .validator((data: z.infer<typeof CreatePost>) => data)
  .handler(async (ctx) => {
    const existedPost = await prisma.post.findFirst({
      where: {
        slug: ctx.data.slug,
      },
    })
    if (existedPost) {
      throw Error('Post with this slug already exists')
    }
    const request = getWebRequest()
    const session = await auth.api.getSession({
      query: {
        disableCookieCache: true,
      },
      headers: request.headers, //getHeaders(), // pass the headers
    })
    if (!session?.user) {
      throw new Error('Not authenticated')
    }
    const userId = session.user.id
    return await prisma.post.create({
      data: { ...ctx.data, authorId: userId },
    })
  })

export const getPost = createServerFn({ method: 'GET' })
  .validator((data: string) => data)
  .handler(async (ctx) => {
    return prisma.post.findFirst({ where: { id: ctx.data } })
  })

export const getPostBySlug = createServerFn({ method: 'GET' })
  .validator((data: string) => data)
  .handler(async (ctx) => {
    return prisma.post.findFirst({ where: { slug: ctx.data } })
  })

export const getHomePosts = createServerFn({ method: 'GET' }).handler(async () => {
  return prisma.post.findMany({
    select: {
      slug: true,
      title: true,
      excerpt: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: POSTS_ON_HOME,
  })
})

export const getAllPosts = createServerFn({ method: 'GET' }).handler(async () => {
  return prisma.post.findMany({})
})

export const updatePost = createServerFn({ method: 'POST' })
  .validator((data: z.infer<typeof UpdatePost>) => data)
  .handler(async (ctx) => {
    const post = await prisma.post.findFirst({
      where: {
        id: ctx.data.id,
      },
    })
    if (!post) {
      throw Error('Post with this id not found')
    }
    if (post.slug !== ctx.data.slug) {
      const existedPost = await prisma.post.findFirst({
        where: {
          slug: ctx.data.slug,
        },
      })
      if (existedPost) {
        throw new Error('Post with this slug already exists')
      }
    }
		//values.contentJson = JSON.stringify(editor.document)
				//values.content = await editor.blocksToHTMLLossy(editor.document)
		//const editor = ServerBlockNoteEditor.create();
		//const html = await editor.blocksToFullHTML(blocks)
    await prisma.post.update({
      where: {
        id: ctx.data.id,
      },
      data: ctx.data,
    })
    return true
  })

export const deletePost = createServerFn({ method: 'POST' })
  .validator((data: string) => data)
  .handler(async (ctx) => {
    const existedPost = await prisma.post.findFirst({
      where: {
        id: ctx.data,
      },
    })
    if (!existedPost) {
      throw new Error('Post with this id not found')
    }
    await prisma.post.delete({
      where: {
        id: ctx.data,
      },
    })
    return true
  })
