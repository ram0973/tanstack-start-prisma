import prisma from '@/lib/prisma';
import { createFileRoute } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';

const getUsers = createServerFn({ method: "GET" }).handler(async () => {
  return prisma.user.findMany();
});

export const Route = createFileRoute('/')({
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
        {users.map((user) => (
          <li key={user.id}>
            <h3>{user.name}</h3>
            <p>{user.email}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
