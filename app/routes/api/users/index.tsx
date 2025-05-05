import prisma from '~/lib/prisma';
import type { User } from '@prisma/client';
import { createFileRoute } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';

const getUsers = createServerFn({ method: "GET" }).handler(async () => {
  const users: User[] = await prisma.user.findMany();
  console.info(users);
  return users;
});

export const Route = createFileRoute('/users/')({
  component: Home,
  loader: () => {
    return getUsers();
  },
});

function Home() {
  const users = Route.useLoaderData();

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map((user: User) => (
          <li key={user.id}>
            <h3>{user.name}</h3>
            <p>{user.email}</p>
            <p>{user.emailVerified.toString()}</p>
            <p>{user.createdAt.toString()}</p>
            <p>{user.updatedAt.toString()}</p>
          </li>
        ))}
      </ul>
      {JSON.stringify(users)}
    </div>
    
  );
}
