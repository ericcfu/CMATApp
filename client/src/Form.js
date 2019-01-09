import React from 'react';
import TextField from '@material-ui/core/TextField';

export default class Form extends React.Component {

    state = {
        first: '',
        last: '',
    };

    handleFirstChange = (e) => {
        const newText = e.target.value;
        this.setState({
            first: newText,
        });
    };

    handleLastChange = (e) => {
        const newText = e.target.value;
        this.setState({
            last: newText,
        });
    };

    handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            this.props.submit(this.state.first)
            this.setState({ text: '' })
        }
    }

    render() {
        const { first, last } = this.state;
        return (
            <div>
                <TextField
                    onChange={this.handleFirstChange}
                    onKeyDown={this.handleKeyDown}
                    label="First Name"
                    margin="normal"
                    value={first}
                // fullWidth
                />
                <TextField
                    onChange={this.handleLastChange}
                    onKeyDown={this.handleKeyDown}
                    label="Last Name"
                    margin="normal"
                    value={last}
                // fullWidth
                />
            </div>
        );
    }
}