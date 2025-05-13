import prisma from '~/lib/prisma';
import type { User } from '@prisma/client';
import { createFileRoute, useRouter } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { authClient } from '~/lib/auth-client';

export const Route = createFileRoute('/')({
  component: Home,
  loader: ({ context }) => {
    return { user: context.user };
  },
});

function Home() {
  const { queryClient } = Route.useRouteContext();
  const { user } = Route.useLoaderData();
  const router = useRouter();

  return (
    <div>
      <h1 className="text-3xl font-bold underline text-red-600">
        Hello world!
      </h1>
      
      {JSON.stringify(user)}

      <button onClick={async () => {
              await authClient.signOut();
              await queryClient.invalidateQueries({ queryKey: ["user"] });
              await router.invalidate();
            }}
            type="button"
          >
            Sign out
          </button>
    </div>
    
  );
}
