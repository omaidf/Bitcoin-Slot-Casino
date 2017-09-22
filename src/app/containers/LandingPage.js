import React from 'react';
import {Link} from 'react-router-dom';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import UserService from '../services/user';

/*
    Page Container for LandingPage
*/

const styles = {
    errorStyle: {
        color: 'red'
    },
    underlineStyle: {
        borderColor: 'white'
    },
    floatingLabelStyle: {
        color: 'white'
    },
    floatingLabelFocusStyle: {
        color: 'white'
    },
    hintStyle: {
        color: 'white'
    },
    inputStyle: {
        color: 'white'
    },
    button: {
        margin: 20,
        height: 40,
        borderRadius: '10%'
    }
};

let cxt;
export default class LandingPage extends React.Component {

    constructor(props) {
        super(props);
        cxt = this;
        this.state = this.getInitialStates();
        this.bindFunctionsToThis();
    }

    getInitialStates() {
        return {email: ""};
    }

    bindFunctionsToThis() {
        ['handleEmailChange', 'handleSubmit'].map(fn => this[fn] = this[fn].bind(this));
    }

    handleSubmit() {
        UserService.setEmail(this.state.email);
        this
            .props
            .history
            .push('/signup');
    }

    handleEmailChange(event)
    {
        this.setState({email: event.target.value});
    }
    componentDidMount() {}

    render() {
        return (
            <div>
                <div className='logo-header'>
                    <i className="fa fa-money logo-icon" aria-hidden="true"></i>
                    <span className='logo-name'>webSlots</span>
                    <span className='header-menu-item'><Link to={'/login'}> <i className="fa fa-sign-in" aria-hidden="true"></i>&nbsp;&nbsp;login</Link></span>
                </div>
                <div className='container'>
                    <div className='row landing-container'>
                        <div>
                            <h1>Welcome to webSlots</h1>
                            <h4>Let's get you started with bitcoin-based slot machine</h4>
                        </div>
                        <div className='vspace'></div>
                        <TextField
                            className='text-field-container'
                            hintText=""
                            floatingLabelStyle={styles.floatingLabelStyle}
                            floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                            hintStyle={styles.hintStyle}
                            errorStyle={styles.errorStyle}
                            underlineStyle={styles.underlineStyle}
                            underlineFocusStyle={styles.underlineStyle}
                            fullWidth={true}
                            inputStyle={styles.inputStyle}
                            value={this.state.email}
                            onChange={this.handleEmailChange}
                            floatingLabelText="Enter e-mail here"/>
                    </div>
                    <RaisedButton
                        label="Start"
                        labelPosition="before"
                        primary={true}
                        style={styles.button}
                        onClick={this.handleSubmit}/>
                </div>
            </div>
        )
    }
}