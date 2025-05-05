import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { authClient } from "~/lib/auth-client";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Button } from "~/components/Button";
import { Input } from "~/components/Input";
import css from './index.module.scss'

export const Route = createFileRoute("/(auth)/signup")({
  component: SignupForm,
});

function SignupForm() {
  const queryClient = new QueryClient();
  const redirectUrl = '/';
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) {
      return;
    }

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirm_password") as string;

    if (!name || !email || !password || !confirmPassword) return;

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    authClient.signUp.email(
      {
        name,
        email,
        password,
        callbackURL: redirectUrl,
      },
      {
        onError: (ctx) => {
          setErrorMessage(ctx.error.message);
          setIsLoading(false);
        },
        onSuccess: async () => {
          await queryClient.invalidateQueries({ queryKey: ["user"] });
          navigate({ to: redirectUrl });
        },
      },
    );
  };

  return (
    <div className={css.signup_form}>
      <form onSubmit={handleSubmit} className="flex">
        <div className={css.field}>
          <label htmlFor="name" className={css.label}>Name</label>
          <input id="name" name="name" type="text" placeholder="John Doe" readOnly={isLoading} required className={css.input} />
        </div>

        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="hello@example.com"
          readOnly={isLoading}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Password"
          readOnly={isLoading}
          required
        />

        <div className="grid gap-2">
          <label htmlFor="confirm_password">Confirm Password</label>
          <input
            id="confirm_password"
            name="confirm_password"
            type="password"
            placeholder="Confirm Password"
            readOnly={isLoading}
            required
          />

          <Button type="submit" disabled={isLoading}>
            {/* {isLoading && <Loader className="animate-spin" />} */}
            {isLoading ? "Signing up..." : "Sign up"}
          </Button>

          {errorMessage && (
            <span className="text-destructive text-center text-sm">
              {errorMessage}
            </span>
          )}
        </div>
      </form>

      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link to="/login" className="underline underline-offset-4">
          Login
        </Link>
      </div>
    </div>
  );
}
