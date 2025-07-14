import { authClient } from "@/lib/auth-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import type { ErrorContext } from "better-auth/react";
import { toast } from "sonner";

const authQueryKeys = {
	session: ["session"],
};

export const useSession = () => {
	const session = authClient.useSession();
	return session;
};

export const useSignIn = () => {
	const router = useRouter();
	const signInWithCredentials = useMutation({
		mutationFn: async ({
			email,
			password,
			rememberMe,
		}: { email: string; password: string; rememberMe: boolean }) => {
			const result = await authClient.signIn.email({
				email,
				password,
				rememberMe,
			}, {
				onSuccess: () => { },
				onError: (ctx: ErrorContext) => {
					throw Error(ctx.error.message)
				},
			}
			)
			if (result.error) {
				throw new Error(result.error.message || "Authentication failed");
			}
			return result;
		},
		onSuccess(response) {
			if (response.data?.user.id) {
				router.navigate({ to: "/" });
			}
		},
		// onError(error: any) {
		//   console.error("Login error:", error);
		// },
	});

	return {
		signInWithCredentials,
	};
};

export const useLogout = () => {
	const queryClient = useQueryClient();
	const router = useRouter();
	return useMutation({
		mutationFn: async () => await authClient.signOut(),
		onSettled: async () => {
			queryClient.removeQueries({ queryKey: authQueryKeys.session });
			await router.navigate({ to: "/" });
		},
	});
};

export const useSignUp = () => {
	return useMutation({
		mutationFn: async ({ name, email, password }: { name: string; email: string; password: string }) =>
			await authClient.signUp.email(
				{ email, password, name, callbackURL: '/verify-email-result' },
				{
					onSuccess: () => {
						toast("A verification email has sent to your email")
					},
					onError: (ctx: ErrorContext) => {
						toast(ctx.error.message)
						if (ctx.error.code === 'USER_ALREADY_EXISTS') {
							authClient.sendVerificationEmail({ email: email, callbackURL: '/verify-email-result' })
							toast("A verification email has sent to your email")
						}
					},
				}
			),
	})
}

export const useSendVerificationEmail = () => {
	return useMutation({
		mutationFn: async ({ email }: { email: string }) =>
			await authClient.sendVerificationEmail({ email, callbackURL: "/verify-email-result" }),
	})
}

export const useSendPasswordResetEmail = () => {
	return useMutation({
		mutationFn: async ({ email }: { email: string }) =>
			await authClient.requestPasswordReset({ email, redirectTo: "/reset-password" }),
	})
}

export const useForgotPassword = () => {
	return useMutation({
		mutationFn: async ({ email }: { email: string }) =>
			await authClient.forgetPassword({ email, redirectTo: "/reset-password" }),
	})
}

export const useResetPassword = () => {
	return useMutation({
		mutationFn: async ({
			newPassword,
			token,
		}: { newPassword: string; token: string }) =>
			await authClient.resetPassword({ newPassword, token }),
	})
}
