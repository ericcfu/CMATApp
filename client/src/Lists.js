import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

export default class AthleteList extends React.Component {
    // needs prop athlete passed in
    render() {
        return (
            <List>
                {this.props.athletes.map(athlete => (
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
                            <IconButton onClick={() => this.props.removeAthlete(athlete)}>
                                <CloseIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List >
        )
    }
}
