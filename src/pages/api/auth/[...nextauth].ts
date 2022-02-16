import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'

import { query as q } from 'faunadb'
import { fauna } from '../../../services/fauna'

export default NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_OAUTH_CLIENT_ID,
      clientSecret: process.env.GITHUB_OAUTH_CLIENT_SECRET,
      authorization: {
        params: {
          scope: 'read:user'
        }
      }
    }),
  ],
  callbacks: {
    async session({ session, user, token }) {
      try {
        const { email } = session.user
        const subscription = await fauna.query<{ data: { status: string } }>(
          q.Get(
            q.Intersection([
              q.Match(
                q.Index('subscription_by_userId'),
                q.Select(
                  'ref',
                  q.Get(
                    q.Match(
                      q.Index('user_by_email'),
                      q.Casefold(email)
                    )
                  )
                )
              ),
              q.Match(
                q.Index('subscription_by_status'),
                'active'
              )
            ])
          )
        )

        return {...session, subscription}
      } catch {
        return {...session, subscription: null}
      }
    },
    async signIn (params) {
      try {
        const { email } = params.user

        const whereUserEmailMatches = q.Match(
          q.Index('user_by_email'),
          q.Casefold(email)
        )

        await fauna.query(
          q.If(

            q.Not(
              q.Exists(
                whereUserEmailMatches
              )
            ), // condition

            q.Create(
              q.Collection('users'),
              { data: { email } }
            ), // if true

            q.Get(
              whereUserEmailMatches
            ) // else

          )
        )

        return true
        
      } catch (err) {
        return false
      }
    },
  }
})