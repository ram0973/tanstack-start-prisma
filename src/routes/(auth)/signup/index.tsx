import { Link, createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authClient } from '@/lib/auth-client';
import css from './signup.module.css';

export const Route = createFileRoute('/(auth)/signup/')({
  component: SignupForm,
});

function SignupForm() {
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
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirm_password') as string;

    if (!name || !email || !password || !confirmPassword) return;

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

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
          await queryClient.invalidateQueries({ queryKey: ['user'] });
          navigate({ to: redirectUrl });
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} className={css.form}>
      <div className={'text-center'}>
        <div className={css.logo} />
        <h1>Sign up for Acme Inc.</h1>
      </div>

      <div className={css.field}>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="John Doe"
          readOnly={isLoading}
          required
          className={css.input}
        />
      </div>

      <div className={css.field}>
        <Label htmlFor="email">Email</Label>
        <Input
          className={css.input}
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
          placeholder="Password"
          readOnly={isLoading}
          required
        />
      </div>

      <div className={css.field}>
        <Label htmlFor="confirm_password">Confirm Password</Label>
        <Input
          className={css.input}
          id="confirm_password"
          name="confirm_password"
          type="password"
          placeholder="Confirm Password"
          readOnly={isLoading}
          required
        />
      </div>

      <div className={css.field}>
        <Button variant="default" type="submit" disabled={isLoading}>
          {isLoading ? 'Signing up...' : 'Sign up'}
        </Button>
      </div>

      {errorMessage && <span className="error_message">{errorMessage}</span>}

      <div className={'text-center'}>
        Already have an account?{' '}
        <Link to="/login" className="underline underline-offset-4">
          Login
        </Link>
      </div>
    </form>
  );
}
