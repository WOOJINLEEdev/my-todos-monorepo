import { prisma } from "../lib/prisma";

export interface User {
  sub: string;
  email: string;
  name: string;
}

export const authModel = {
  createUser: async ({ sub, email, name }: User) => {
    return await prisma.user.create({
      data: {
        email,
        name,
        sns: {
          create: {
            snsId: sub,
            type: "google",
          },
        },
      },
    });
  },

  getUser: async ({ email }: Pick<User, "email">) => {
    return await prisma.user.findUnique({ where: { email } });
  },
};
