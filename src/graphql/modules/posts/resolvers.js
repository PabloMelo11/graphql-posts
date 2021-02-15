import Post from '../../../models/Post';
import User from '../../../models/User';

export default {
  Post: {
    author: (post) => User.findById(post.author),
  },

  Query: {
    posts: () => Post.find(),
    post: (_, { id }) => Post.findById(id),
  },

  Mutation: {
    createPost: async (_, { data }, { req }) => {
      if (!req.isAuth) {
        throw new Error('JWT token is missing');
      }

      const post = await Post.create(data);

      return post;
    },

    updatePost: async (_, { id, data }, { req }) => {
      if (!req.isAuth) {
        throw new Error('JWT token is missing');
      }

      const post = await Post.findAndModify(id, data, { new: true });

      return post;
    },

    deletePost: async (_, { id }, { req }) => {
      if (!req.isAuth) {
        throw new Error('JWT token is missing');
      }

      const post = await Post.findOneAndDelete(id);

      return !!post;
    },
  },
};
