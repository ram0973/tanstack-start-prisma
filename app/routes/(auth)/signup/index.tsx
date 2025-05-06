import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { authClient } from "~/lib/auth-client";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Button } from "~/components/Button";
import { Loader } from "~/components/Loader";
import css from './index.module.scss';
import cn from "classnames";

export const Route = createFileRoute("/(auth)/signup/")({
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
    <div className={css.signup_form_container}>
      <form onSubmit={handleSubmit} className={css.signup_form}>
        <div className={css.centered}>
          <div className={css.logo}/>
          <h1>Sign up for Acme Inc.</h1>
        </div>

        <div className={css.field}>
          <label htmlFor="name" className={css.label}>Name</label>
          <input id="name" name="name" type="text" placeholder="John Doe" readOnly={isLoading} required className={css.input} />
        </div>

        <div className={css.field}>
          <label htmlFor="email" className={css.label}>Email</label>
          <input className={css.input}
            id="email"
            name="email"
            type="email"
            placeholder="hello@example.com"
            readOnly={isLoading}
            required
          />
        </div>

        <div className={css.field}>
          <label htmlFor="password" className={css.label}>Password</label>
          <input className={css.input}
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            readOnly={isLoading}
            required
          />
        </div>

        <div className={css.field}>
          <label htmlFor="confirm_password" className={css.label}>Confirm Password</label>
          <input className={css.input}
            id="confirm_password"
            name="confirm_password"
            type="password"
            placeholder="Confirm Password"
            readOnly={isLoading}
            required
          />
        </div>  

        <div className={cn(css.field, css.centered)}>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader className="animate-spin" />}
            {isLoading ? "Signing up..." : "Sign up"}
          </Button>
        </div>  

        {errorMessage && (
          <span className="text-destructive text-center text-sm">
            {errorMessage}
          </span>
        )}

        <div className={css.centered}>
          Already have an account?{" "}
          <Link to="/login" className="underline underline-offset-4">
            Login
          </Link>
        </div>  
      </form>
    </div>
  );
}
