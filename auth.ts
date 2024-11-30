import NextAuth from "next-auth";
import Auth0Provider from "next-auth/providers/auth0";

export const { auth, handlers, signIn, signOut } = NextAuth({
	providers: [
		Auth0Provider({
			clientId: process.env.AUTH0_CLIENT_ID,
			clientSecret: process.env.AUTH0_CLIENT_SECRET,
			issuer: `https://${process.env.AUTH0_DOMAIN}`,
		}),
	],
	secret: process.env.NEXTAUTH_SECRET,
	callbacks: {
		async session({ session, token }) {
			if (token?.sub) {
				session.user.id = token.sub;
			}
			return session;
		},
		async jwt({ token, account }) {
			if (account) {
				token.accessToken = account.access_token;
			}
			return token;
		},
	},
});
