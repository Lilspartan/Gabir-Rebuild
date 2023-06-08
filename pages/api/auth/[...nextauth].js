import NextAuth from "next-auth";

import EmailProvider from "next-auth/providers/email";
import DiscordProvider from "next-auth/providers/discord";

import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "../../../utils/mongodb";

import dbConnect from "../../../utils/dbConnect";
import User from '../../../database/models/user';

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  // Configure one or more authentication providers
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET
    }),
    EmailProvider({
      server: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // use SSL
        auth: {
            user: "gabirmotors",
            pass: process.env.MAIL_PASSWORD
        }
      },
      from: process.env.MAIL_USERNAME
    }),
    // ...add more providers here
  ],
  theme: {
    colorScheme: 'dark',
    brandColor: "#222222",
    logo: "https://gabirmotors.com/main.png",
    buttonText: "#ffffff"
  },
  secret: "gabirmotorsportsistheworldspremierepretendmotorsportsorganization",
  callbacks: {
    async jwt({ token, account }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token
      }

      return token
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      // session.accessToken = token.accessToken

      let _user = await User.findOne({ email: session.user.email });

      if (_user) {
        session.userData = _user;
      } else {
        let icon = session.user.image;
        if (icon === undefined) {
          icon = "https://i.gabirmotors.com/MFTs/images/mft" + (Math.floor(Math.random() * (11 - 1 + 1)) + 1) +".jpg"
        }

        let newUser = User.create({
          name: session.user.name || session.user.email.split('@')[0],
          email: session.user.email,
          icon: icon,
          alerts: [],
          api_key: null,
          account_creation_time: Date.now(),
          roles: [ "user" ],
        })
        session.userData = newUser;
      }

      return session
    }
  }
}

export default NextAuth(authOptions)