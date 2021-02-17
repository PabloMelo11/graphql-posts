import crypto from 'crypto';
import path from 'path';
import fs from 'fs';
import { hash } from 'bcryptjs';

import User from '../../../models/User';
import { USER_ADDED } from './channels';

export default {
  User: {
    fullName: (user) => `${user.firstName} ${user.lastName}`,
  },

  Query: {
    users: () => User.find(),
    user: (_, { id }) => User.findById(id),
  },

  Mutation: {
    createUser: async (_, { data }, { pubsub }) => {
      const hashPassword = await hash(data.password, 8);

      Object.assign(data, { password: hashPassword });

      const user = await User.create(data);

      pubsub.publish(USER_ADDED, {
        userAdded: user,
      });

      return user;
    },
    updateUser: (_, { id, data }) =>
      User.findOneAndUpdate(id, data, { new: true }),
    deleteUser: async (_, { id }) => !!(await User.findOneAndDelete(id)),
    uploadAvatar: async (_, { file }, { req }) => {
      if (!req.isAuth) {
        throw new Error('JWT token is missing');
      }

      const { filename, createReadStream } = await file;

      const fileStream = createReadStream();

      const fileHash = crypto.randomBytes(10).toString('hex');
      const fileName = `${fileHash}-${filename}`;

      const tmpFolder = path.resolve(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        'tmp',
        'uploads'
      );

      await fileStream.pipe(fs.createWriteStream(`${tmpFolder}/${fileName}`));

      return User.findOneAndUpdate(
        req.user.id,
        { avatar: fileName },
        { new: true }
      );
    },
  },

  Subscription: {
    userAdded: {
      subscribe: (obj, args, { pubsub }) => pubsub.asyncIterator(USER_ADDED),
    },
  },
};
