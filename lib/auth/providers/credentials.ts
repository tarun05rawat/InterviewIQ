import { compare } from 'bcryptjs'
import type { CredentialsConfig } from 'next-auth/providers/credentials'
import { User } from '@/models/user'
import connectDB from '@/lib/db'

export const credentialsConfig: CredentialsConfig = {
  name: 'Credentials',
  credentials: {
    email: { label: "Email", type: "email" },
    password: { label: "Password", type: "password" }
  },
  async authorize(credentials) {
    if (!credentials?.email || !credentials?.password) {
      throw new Error('Invalid credentials')
    }

    await connectDB()
    const user = await User.findOne({ email: credentials.email })

    if (!user) {
      throw new Error('User not found')
    }

    const isValid = await compare(credentials.password, user.password)

    if (!isValid) {
      throw new Error('Invalid password')
    }

    return {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
    }
  }
}