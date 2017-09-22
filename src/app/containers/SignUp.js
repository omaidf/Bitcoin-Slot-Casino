import React from 'react';
import {Link} from 'react-router-dom';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import UserService from '../services/user';
import Axios from 'axios';
import Snackbar from 'material-ui/Snackbar';

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
let handleSubmitFlag = true;
export default class LandingPage extends React.Component {

    constructor(props) {
        super(props);
        cxt = this;
        this.state = this.getInitialStates();
        this.bindFunctionsToThis();
    }

    getInitialStates() {
        return {
            name: "",
            email: UserService.getEmail(),
            password: "",
            err: [
                "", "", ""
            ],
            snack: false,
            snackData: ""
        };
    }

    bindFunctionsToThis() {
        [
            'validateEmail',
            'handleSubmit',
            'handleEmailChange',
            'handleNameChange',
            'handlePasswordChange',
            'sendToServer'
        ].map(fn => this[fn] = this[fn].bind(this));
    }

    validateEmail(email) {
        let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    handleEmailChange(event)
    {
        this.setState({email: event.target.value, snack: false});
    }
    handleNameChange(event)
    {
        this.setState({name: event.target.value, snack: false});
    }
    handlePasswordChange(event)
    {
        this.setState({password: event.target.value, snack: false});
    }
    handleSubmit() {
        if (handleSubmitFlag) {
            handleSubmitFlag = false;
            console.log(this.state);
            let data = JSON.parse(JSON.stringify(this.state));
            let err = [];
            let pass = true;
            if (data.name == undefined || data.name == "") {
                err[0] = "Name can't be left blank";
                pass = false;
            }
            if (!this.validateEmail(data.email)) {
                err[1] = "Incorrect format";
                pass = false;
            }
            if (data.password == undefined || data.password == "" || data.password.length < 7) {
                err[2] = "Incorrect password";
                pass = false;
            }

            if (pass) {
                this.setState({snack: true, snackData: "Please wait while we receive confirmation from server"})
                this.sendToServer(data);
            } else {
                handleSubmitFlag = true;
            }
            this.setState({err});
        }
    }

    componentDidMount() {}

    render() {
        return (
            <div>
                <div className='logo-header'>
                    <i className="fa fa-money logo-icon" aria-hidden="true"></i>
                    <span className='logo-name'>webSlots</span>
                    <span className='header-menu-item'>
                        <Link to={'/login'}>
                            <i className="fa fa-sign-in" aria-hidden="true"></i>&nbsp;&nbsp;login</Link>
                    </span>
                </div>
                <div className='container'>
                    <div className="signup-container">
                        <h1>
                            Sign Up Here
                        </h1>
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
                            value={this.state.name}
                            onChange={this.handleNameChange}
                            errorText={this.state.err[0]}
                            floatingLabelText="enter your name"/>
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
                            errorText={this.state.err[1]}
                            floatingLabelText="enter your e-mail"/>
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
                            value={this.state.password}
                            onChange={this.handlePasswordChange}
                            type="password"
                            errorText={this.state.err[2]}
                            floatingLabelText="enter password"/>
                        <br/><br/>
                        <RaisedButton
                            label="Sign Up"
                            labelPosition="before"
                            primary={true}
                            style={styles.button}
                            onClick={this.handleSubmit}/>
                    </div>
                    <Snackbar
                        className="status-snack-bar"
                        open={this.state.snack}
                        message={this.state.snackData}/>
                </div>
            </div>
        )
    }

    sendToServer(data) {
        Axios
            .post('/user/register', {
            name: data.name,
            username: data.email,
            password: data.password
        })
            .then((response) => {
                if (response.status == 200) {
                    if (response.data && response.data.status) {
                        cxt.setState({
                            snackData: response.data.status + ', Redirecting to login page.'
                        })
                    } else {
                        cxt.setState({snackData: 'Successful. Redirecting to login page. '})
                    }
                    setTimeout(() => {
                        this
                            .props
                            .history
                            .push('/home');
                    }, 2000);
                } else {
                    cxt.setState({snackData: ' Some Error Occurred ! Please Try Again'});
                }
                handleSubmitFlag = true;
            })
            .catch((error) => {
                console.dir(error);
                if (error.response && error.response.data && error.response.data.err && error.response.data.err.message) {
                    cxt.setState({snackData: error.response.data.err.message});
                } else {
                    cxt.setState({snackData: ' Some Error Occurred ! Please Try Again'});
                }
                handleSubmitFlag = true;
            });
    }
}