import { PrismaClient } from "@prisma/client";
import NextAuth from "next-auth";
import Auth0Provider from "next-auth/providers/auth0";

const prisma = new PrismaClient();

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
		async signIn({ user }) {
			// ユーザがログインするときに呼び出される
			if (user.email) {
				const existingUser = await prisma.user.findUnique({
					where: { email: user.email },
				});

				if (!existingUser) {
					// ユーザーが存在しない場合、新規作成
					// とりあえず、emailの@以前をnameとして登録
					const tmpUserName = user.email.split("@")[0];
					await prisma.user.create({
						data: {
							email: user.email,
							name: tmpUserName,
						},
					});
				}
			}
			return true;
		},
	},
});
