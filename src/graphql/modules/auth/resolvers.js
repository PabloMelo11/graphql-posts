import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import User from '../../../models/User';

export default {
  Mutation: {
    authentication: async (_, { data }) => {
      const user = await User.findOne({ email: data.email });

      if (!user) {
        throw new Error('Incorrect email/password combination');
      }

      const passwordMatched = await compare(data.password, user.password);

      if (!passwordMatched) {
        throw new Error('Incorrect email/password combination');
      }

      const token = sign({}, 'secret', {
        expiresIn: '1h',
        subject: String(user._id),
      });

      return {
        user,
        token,
      };
    },
  },
};
