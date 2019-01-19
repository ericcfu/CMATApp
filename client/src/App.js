import React, { Component } from 'react';
import gql from "graphql-tag"
import { graphql, compose } from 'react-apollo'
import Paper from '@material-ui/core/Paper';
// import List from '@material-ui/core/List';
// import ListItem from '@material-ui/core/ListItem';
// import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
// import ListItemText from '@material-ui/core/ListItemText';
// import Checkbox from '@material-ui/core/Checkbox';
// import IconButton from '@material-ui/core/IconButton';
// import CloseIcon from '@material-ui/icons/Close';
import Form from './Form';
import AthleteList from './Lists';

// graphql queries
const AthletesQuery = gql`
query {
  athletes {
    first
    last
    id
  }
}
`;

// graphql mutations
const RemoveAthleteMutation = gql`
  mutation($id: ID!) {
    removeAthlete(id: $id)
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

// Main App component
class App extends Component {
  removeAthlete = async athlete => {
    await this.props.removeAthlete({
      variables: {
        id: athlete.id,
      },
      update: store => {
        const data = store.readQuery({ query: AthletesQuery });
        data.athletes = data.athletes.filter(x => x.id !== athlete.id);
        store.writeQuery({ query: AthletesQuery, data })
      },
    });
  }
  
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

  athleteClicked = async (id) => {
    // pull up list of events for that athlete
    // duplicate the athletes list page for events within that athlete
  }

  // app render methods
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
            <AthleteList removeAthlete={this.removeAthlete} athletes={athletes} />
          </Paper>
        </div>
      </div>
    )
  }
}

export default compose(
  graphql(CreateAthleteMutation, { name: 'createAthlete' }),
  graphql(RemoveAthleteMutation, { name: 'removeAthlete' }),
  graphql(AthletesQuery)
)(App);
