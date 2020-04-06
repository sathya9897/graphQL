import { GraphQLServer } from "graphql-yoga";

//? Scalar Types -> String, Boolean, Int, Float, ID

// demo users data

const users = [
  {
    id: "1",
    name: "Andrew",
    email: "andrew@example.com",
    age: 27
  },
  {
    id: "2",
    name: "Sarah",
    email: "sarah@example.com"
  },
  {
    id: "3",
    name: "Mike",
    email: "mike@example.com"
  }
];

const posts = [
  {
    id: "10",
    title: "GraphQL 101",
    body: "This is how to use GraphQL...",
    published: true,
    author: "1"
  },
  {
    id: "11",
    title: "GraphQL 201",
    body: "This is an advanced GraphQL post...",
    published: false,
    author: "1"
  },
  {
    id: "12",
    title: "Programming Music",
    body: "",
    published: false,
    author: "2"
  }
];

const comments = [
  {
    id: "102",
    text: "This worked well for me. Thanks!",
    author: "3",
    post: "10"
  },
  {
    id: "103",
    text: "Glad you enjoyed it.",
    author: "1",
    post: "10"
  },
  {
    id: "104",
    text: "This did not work",
    author: "2",
    post: "11"
  },
  {
    id: "105",
    text: "Nevermind. I got it to work.",
    author: "2",
    post: "11"
  }
];

//? defines schema
const typeDefs = `
  type Query {
    me: User!
    users(query: String): [User!]!
    post: Post!
    posts(query: String): [Post!]!
    comments: [Comment!]!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
    comments: [Comment!]!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
    comments: [Comment!]!
  }

  type Comment {
    id: ID!
    text: String!
    author: User!
    post: Post!
  }
`;

//? defines resolvers
const resolvers = {
  Query: {
    users(parent, args, ctx, info) {
      if (!args.query) {
        return users;
      }
      return users.filter(user => {
        return user.name.toLowerCase().includes(args.query.toLowerCase());
      });
    },
    me() {
      return {
        id: "a2f5b1f",
        name: "Sathya Reddy",
        email: "sathyarox7@gmail.com",
        age: 23
      };
    },
    post() {
      return {
        id: "g1e9e178g",
        title: "GraphQL 101",
        body: "GraphQL Bootcamp course",
        published: true
      };
    },
    posts(parent, args, ctx, info) {
      if (!args.query) {
        return posts;
      }
      return posts.filter(post => {
        return (
          post.title.toLowerCase().includes(args.query.toLowerCase()) ||
          post.body.toLowerCase().includes(args.query.toLowerCase())
        );
      });
    },
    comments() {
      return comments;
    }
  },
  Post: {
    author(parent, args, ctx, info) {
      return users.find(user => user.id === parent.author);
    },
    comments(parent, args, ctx, info) {
      return comments.filter(com => com.post === parent.id);
    }
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter(post => post.author === parent.id);
    },
    comments(parent, args, ctx, info) {
      return comments.filter(com => com.author === parent.id);
    }
  },
  Comment: {
    author(parent, args, ctx, info) {
      return users.find(user => user.id === parent.author);
    },
    post(parent, args, ctx, info) {
      return posts.find(post => post.id === parent.post);
    }
  }
};

const server = new GraphQLServer({ typeDefs, resolvers });

server.start(() => console.log("listening..."));
