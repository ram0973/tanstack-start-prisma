import { prisma } from '@/lib/prisma'
import type { CreateUser } from '@/types/users/CreateUser'
import { createServerFn } from '@tanstack/react-start'
import type z from 'zod'
import { UpdateUser } from '@/types/users/UpdateUser'

export const createUser = createServerFn({ method: 'POST' })
  .validator((data: z.infer<typeof CreateUser>) => data)
  .handler(async (ctx) => {
    const existedUser = await prisma.user.findFirst({
      where: {
        id: ctx.data.email,
      },
    })
    if (existedUser) {
      throw Error('User with this email already exists')
    }
    await prisma.user.create({
      data: ctx.data,
    })
    return true
  })

export const getUser = createServerFn({ method: 'GET' })
  .validator((data: string) => data)
  .handler(async (ctx) => {
    return prisma.user.findFirst({ where: { id: ctx.data } })
  })

export const getUsers = createServerFn({ method: 'GET' }).handler(async () => {
  return prisma.user.findMany({})
})

export const getAllUsers = createServerFn({ method: 'GET' }).handler(async () => {
  return prisma.user.findMany({})
})

export const updateUser = createServerFn({ method: 'POST' })
  .validator((data: z.infer<typeof UpdateUser>) => data)
  .handler(async (ctx) => {
    const user = await prisma.user.findFirst({
      where: {
        id: ctx.data.id,
      },
    })
    if (!user) {
      throw Error('User with this id not found')
    }
    if (user.email !== ctx.data.email) {
      const existedUser = await prisma.user.findFirst({
        where: {
          email: ctx.data.email,
        },
      })
      if (existedUser) {
        throw new Error('User with this email already exists')
      }
    }
    await prisma.user.update({
      where: {
        id: ctx.data.id,
      },
      data: ctx.data,
    })
    return true
  })

export const deleteUser = createServerFn({ method: 'POST' })
  .validator((data: string) => data)
  .handler(async (ctx) => {
    const existedUser = await prisma.user.findFirst({
      where: {
        id: ctx.data,
      },
    })
    if (!existedUser) {
      throw new Error('User with this id not found')
    }
    await prisma.user.delete({
      where: {
        id: ctx.data,
      },
    })
    return true
  })
