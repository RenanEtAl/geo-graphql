const { AuthenticationError } = require("apollo-server");

const user = {
  _id: "1",
  name: "ren",
  email: "ren.tanola@gmail.com",
  picture: "String",
};

const authenticated = (next) => (root, args, ctx, info) => {
  if (!ctx.currentUser) {
    throw new AuthenticationError("You must be logged in");
  }

  return next(root, arsg, ctx, info);
};

module.exports = {
  Query: {
    me: authenticated((root, args, ctx) => ctx.currentUser),
  },
};
