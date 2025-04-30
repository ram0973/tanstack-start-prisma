import { auth } from "@/lib/auth";
import { createAPIFileRoute } from '@tanstack/react-start/api';

const signIn = async () => {
  await auth.api.signInEmail({
    body: {
      email: "user@email.com",
      password: "password",
    },
  });
};

export const APIRoute = createAPIFileRoute('/api/auth/signInEmail')({
  GET: ({ request }) => {
    return auth.handler(request);
  },
});