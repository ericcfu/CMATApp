// import { GraphQLServer } from 'graphql-yoga'
// ... or using `require()`
const { GraphQLServer } = require('graphql-yoga')

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/testCMAT1');

var Todo = mongoose.model('Todo', {
  text: String,
  complete: Boolean,
});

var Athlete = mongoose.model('Athlete', {
  first: String,
  last: String,
  contests: Array,
})

var Contest = mongoose.model('Contest', {
  name: String,
  type: String,
  athletes: Array,
})

const typeDefs = `
  type Query {
    hello(name: String): String!
    todos: [Todo]
    athletes: [Athlete]
    contests: [Contest]
  }
  type Todo {
    id: ID!
    text: String!
    complete: Boolean!
  }
  type Athlete {
    id: ID!
    first: String!
    last: String!
    contests: [Contest!]!
  }
  type Contest {
    id: ID!
    name: String!
    type: String!
    athletes: [Athlete!]!
  }
  type Mutation {
    createTodo(text: String!): Todo
    updateTodo(id: ID!, complete: Boolean!): Boolean
    removeTodo(id: ID!): Boolean

    createAthlete(first: String!, last: String!): Athlete
    removeAthlete(id: ID!): Boolean

    createContest(name: String!, type: String!): Contest
    removeContest(id: ID!): Boolean
  }
  
`

const resolvers = {
  Query: {
    hello: (_, { name }) => `Hello ${name || 'World'}`,
    todos: () => Todo.find(),
    athletes: () => Athlete.find(),
    contests: () => Contest.find(),
  },
  Mutation: {
    createTodo: async (_, { text }) => {
      const todo = new Todo({ text, complete: false });
      await todo.save();
      return todo;
    },
    updateTodo: async (_, { id, complete }) => {
      await Todo.findByIdAndUpdate(id, { complete });
      return true;
    },
    removeTodo: async (_, { id }) => {
      await Todo.findByIdAndDelete(id);
      return true;
    },
    // athlete info
    createAthlete: async (_, { first, last }) => {
      const athlete = new Athlete({ first, last });
      await athlete.save();
      return athlete;
    },
    //add some update stuff
    removeAthlete: async (_, { id }) => {
      await Athlete.findByIdAndDelete(id);
      return true;
    },
    //Contests
    createContest: async (_, { name, type }) => {
      const contest = new Contest({ name, type });
      await contest.save();
      return contest;
    },
    // need update stuff
    removeContest: async (_, { id }) => {
      await Contest.findByIdAndDelete(id);
      return true;
    },

  }
}

const server = new GraphQLServer({ typeDefs, resolvers })
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  server.start(() => console.log('Server is running on localhost:4000'))
});
