import { sign } from 'jsonwebtoken';

import User from '../../../models/User';

export default {
  Mutation: {
    authentication: async (_, { data }) => {
      const user = await User.findOne({ email: data.email });

      if (!user) {
        throw new Error('User does not exists!');
      }

      const token = sign({}, 'secret', {
        expiresIn: '1h',
      });

      return {
        user,
        token,
      };
    },
  },
};
