import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authClient } from '@/lib/auth-client';
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router';
import { LoaderCircle } from 'lucide-react';
import { useState } from 'react';
import z from 'zod';
import css from './login.module.css';

export const Route = createFileRoute('/(auth)/login/')({
  component: LoginForm,
});

const loginFormSchema = z.object({
  email: z.string().min(1, { message: 'Title is required' }),
});

function LoginForm() {
  const { redirectUrl, queryClient } = Route.useRouteContext();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) {
      return;
    }

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) return;

    setIsLoading(true);
    setErrorMessage('');

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
          await queryClient.invalidateQueries({ queryKey: ['user'] });
          navigate({ to: redirectUrl });
        },
      },
    );
  };

  return (
    // <div className={css.login_form_container}>
    <form onSubmit={handleSubmit} className={css.form}>
      <div className={'text-center'}>
        <div className={css.logo} />
        <h1>Welcome back to Acme Inc.</h1>
      </div>

      <div className={css.field}>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="hello@example.com"
          readOnly={isLoading}
          required
        />
      </div>

      <div className={css.field}>
        <Label htmlFor="password">Password</Label>
        <Input
          className={css.input}
          id="password"
          name="password"
          type="password"
          placeholder="Enter password here"
          readOnly={isLoading}
          required
        />
      </div>

      <div className={css.field}>
        <Button variant="default" type="submit" disabled={isLoading}>
          {isLoading && <LoaderCircle className="animate-spin" />}
          {isLoading ? 'Login...' : 'Login'}
        </Button>
      </div>

      {errorMessage && <span className="css.error_message">{errorMessage}</span>}

      <div className={'text-center'}>
        Don't have an account?{' '}
        <Link to="/signup" className="underline underline-offset-4">
          Sign up
        </Link>
      </div>
    </form>
    // </div>
  );
}
