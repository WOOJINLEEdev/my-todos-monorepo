import { User, authModel } from "../models/authModel";

export const authService = {
  createUser: async ({ sub, email, name }: User) => {
    return await authModel.createUser({ sub, email, name });
  },

  getUser: async ({ email }: Pick<User, "email">) => {
    return await authModel.getUser({ email });
  },
};
