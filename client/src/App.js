import React, { Component } from 'react';
import gql from "graphql-tag"
import { graphql, compose } from 'react-apollo'
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
// import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Form from './Form';

const TodosQuery = gql`
query {
  todos {
    id
    text
    complete
  }
}
`;

const AthletesQuery = gql`
query {
  athletes {
    first
    last
    id
  }
}
`;

const UpdateMutation = gql`
  mutation($id: ID!, $complete: Boolean!) {
    updateTodo(id: $id, complete: $complete)
  }
`;

const RemoveMutation = gql`
  mutation($id: ID!) {
    removeTodo(id: $id)
  }
`;

const RemoveAthleteMutation = gql`
  mutation($id: ID!) {
    removeAthlete(id: $id)
  }
`;

const CreateTodoMutation = gql`
  mutation($text: String!) {
    createTodo(text: $text) {
      id
      text
      complete
    }
  }
`;

const CreateAthleteMutation = gql`
  mutation($first: String!, $last: String!) {
    createAthlete(first: $first, last: $last) {
      first
      last
      id
    }
  }
`;

class App extends Component {
  // updateTodo = async todo => {
  //   // update todo
  //   await this.props.updateTodo({
  //     variables: {
  //       id: todo.id,
  //       complete: !todo.complete,
  //     },
  //     update: store => {
  //       // Read the data from our cache for this query.
  //       const data = store.readQuery({ query: TodosQuery });
  //       // Add our comment from the mutation to the end.
  //       data.todos = data.todos.map(
  //         x =>
  //           x.id === todo.id
  //             ? {
  //               ...todo,
  //               complete: !todo.complete
  //             }
  //             : x
  //       );
  //       // Write our data back to the cache.
  //       store.writeQuery({ query: TodosQuery, data });
  //     },
  //   });
  // };

  removeTodo = async todo => {
    // remove todo
    await this.props.removeTodo({
      variables: {
        id: todo.id,
      },
      update: store => {
        // Read the data from our cache for this query.
        const data = store.readQuery({ query: TodosQuery });
        // Add our comment from the mutation to the end.
        data.todos = data.todos.filter(x => x.id !== todo.id);
        // Write our data back to the cache.
        store.writeQuery({ query: TodosQuery, data });
      },
    });
  };
  // TODO: need to implement remove

  removeAthlete = async athlete => {
    await this.props.removeAthlete({
      variables: {
        id: athlete.id,
      },
      update: store => {
        const data = store.readQuery({ query: AthletesQuery });
        data.athletes = data.athletes.filter(x => x.id !== athlete.id);
        store.writeQuery({query: AthletesQuery, data})
      },
    });
  }

  // createTodo = async text => {
  //   await this.props.createTodo({
  //     variables: {
  //       text,
  //     },
  //     update: (store, { data: { createTodo } }) => {
  //       // Read the data from our cache for this query.
  //       const data = store.readQuery({ query: TodosQuery });
  //       // Add our comment from the mutation to the end.
  //       data.todos.push(createTodo);
  //       // Write our data back to the cache.
  //       store.writeQuery({ query: TodosQuery, data });
  //     },
  //   });
  // }

  createAthlete = async (first, last) => {
    await this.props.createAthlete({
      variables: {
        first,
        last,
      },
      update: (store, { data: { createAthlete } }) => {
        const data = store.readQuery({ query: AthletesQuery });
        data.athletes.push(createAthlete);
        store.writeQuery({ query: AthletesQuery, data })
      },
    });
  }


  render() {
    const { data: { loading, athletes } } = this.props;
    if (loading) {
      return null;
    }

    return (
      <div style={{ display: 'flex' }}>
        <div style={{ margin: 'auto', width: 400 }}>
          <Paper elevation={1}>
            <Form submit={this.createAthlete} />
            <List>
              {athletes.map(athlete => (
                <ListItem
                  key={athlete.id}
                  role={undefined}
                  dense
                  button
                // onClick={() => this.updateTodo(todo)}
                >
                  {/* <Checkbox
                    checked={todo.complete}
                    tabIndex={-1}
                    disableRipple
                  /> */}
                  <ListItemText primary={athlete.first + " " + athlete.last} />
                  <ListItemSecondaryAction>
                    <IconButton onClick={() => this.removeAthlete(athlete)}>
                      <CloseIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List >
          </Paper>
        </div>
      </div>
    )
  }
}

export default compose(
  graphql(CreateTodoMutation, { name: 'createTodo' }),
  graphql(RemoveMutation, { name: 'removeTodo' }),
  graphql(UpdateMutation, { name: 'updateTodo' }),
  graphql(CreateAthleteMutation, { name: 'createAthlete' }),
  graphql(RemoveAthleteMutation, { name: 'removeAthlete' }),
  graphql(TodosQuery),
  graphql(AthletesQuery)
)(App);
