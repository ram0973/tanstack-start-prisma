import type { User } from '@prisma/client';
import { atom } from 'nanostores'

export const $users = atom<User[]>([])

export function addUser(user: User) {
  $users.set([...$users.get(), user]);
}