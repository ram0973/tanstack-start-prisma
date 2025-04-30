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
  return (
    <div>
      <h1>Posts</h1>
    </div>
  );
}
