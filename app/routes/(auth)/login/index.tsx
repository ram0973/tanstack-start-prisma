import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { authClient } from "~/lib/auth-client";
import { QueryClient } from '@tanstack/react-query'
import { Button } from "~/components/Button";
import css from './login.module.css';
import cn from "classnames";

export const Route = createFileRoute("/(auth)/login/")({
  component: LoginForm,
});

function LoginForm() {
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
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) return;

    setIsLoading(true);
    setErrorMessage("");

    authClient.signIn.email(
      {
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
    <div className={css.login_form_container}>
      <form onSubmit={handleSubmit} className={css.login_form}>
        <div className={css.centered}>
          <div className={css.logo}/>
          <h1>Welcome back to Acme Inc.</h1>
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

        <div className={cn(css.field, css.centered)}>
          <Button type="submit" disabled={isLoading}>
            {/* {isLoading && <Loader className="animate-spin" />} */}
            {isLoading ? "Login..." : "Login"}
          </Button>
        </div>  

        {errorMessage && (
          <span className="text-destructive text-center text-sm">
            {errorMessage}
          </span>
        )}

        <div className={css.centered}>
          Don't have an account? <Link to="/signup" className=""> Sign up</Link>
        </div>  
      </form>
    </div>
  );
}
