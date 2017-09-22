import React from 'react';
import {Link} from 'react-router-dom';
import TextField from 'material-ui/TextField';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import * as css from '../../css/slot-machine.css'
import {Tabs, Tab} from 'material-ui/Tabs';
import FontIcon from 'material-ui/FontIcon';
import SlotMachine from '../components/SlotMachine'
import UserService from '../services/user';
import RaisedButton from 'material-ui/RaisedButton';
import Axios from 'axios';



/*
    Page Container for Home
*/

const minBet = 0.001;

const styles = {
    title: {
        color: 'white'
    },
    appBar: {
        boxShadow: 'none',
        border: 'none',
        background: 'transparent'
    },
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
        margin: '0px 20px 20px 20px',
        height: 40,
        borderRadius: '10%'
    }
};

let cxt;
let handleWithdrawFlag = true;
export default class Home extends React.Component {

    constructor(props)
    {
        super(props);
        cxt = this;
        window.home = cxt;
        this.state = this.getInitialStates();
        this.bindFunctionsToThis();
    }

    getInitialStates() {
        return {
            name: 'getting from server. wait..',
            balance: 'getting from server. wait..',
            wallet: 'getting from server. wait..',
            email: UserService.getEmail(),
            bet: 0,
            err: [],
            slotBet: 0,
            showResult: false,
            result: '',
            sendAdd: '',
            sendAmount:''
        };
    }

    handleBetChange(event)
    {
        this.setState({bet: event.target.value});
    }

    bindFunctionsToThis() {
        ['getUserInfo','handleBetChange','handleBetSubmit','handleResult','handleSendAddChange','handleSendAmountChange','handleWithdraw','sendWithdrawReqToServer'].map(fn => this[fn] = this[fn].bind(this));
    }

    handleResult(message) {
        this.setState({
            showResult: true,
            result:message,
            name: 'getting from server. wait..',
            balance: 'getting from server. wait..',
            wallet: 'getting from server. wait..',
            slotBet:0
        }, () => {
            this.getUserInfo();
            setTimeout(() => {
                cxt.setState({
                    showResult: false,
                    result:'',
                })
            }, 4000);
        })
    }

    handleBetSubmit() {
        let bet = parseFloat(this.state.bet);
        let err = [];
        console.log(bet);
        if (bet < minBet) {
            err[0] = "Min bet is " + minBet;
        }
        else if (isNaN(parseFloat(this.state.balance))) {
            err[0] = "Wallet balance not fetched, Please try again";
        }
        else if (parseFloat(this.state.balance) < bet)
        {
            err[0] = "Enough credits not available ! please load your wallet";
        }
        else {
            this.setState({
                slotBet: this.state.bet
            })
        }
        this.setState({
            err
        })
        console.log('handleBetSubmit');
    }

    handleSendAmountChange(event) {
        this.setState({
            sendAmount: event.target.value
        })
    }


    handleSendAddChange(event) {
        this.setState({
            sendAdd : event.target.value
        })
    }

    handleWithdraw() {
        if (handleWithdrawFlag) {
            handleWithdrawFlag = false;
            let err = [];
            let pass = true;
            if (!this.state.sendAdd || this.state.sendAdd.length < 1) {
                pass = false
                err[1] = "Required";
            }
            if (parseFloat(this.state.sendAmount) > this.state.balance || this.state.sendAmount == 0 || this.state.sendAmount  < 0) {
                pass = false;
                err[2] = "Insufficient or invalid funds"
            }

            if (pass) {
                this.sendWithdrawReqToServer(this.state.sendAdd, this.state.sendAmount);
            }
            else
            {
                handleWithdrawFlag = true;
            }

            this.setState({
                err
            })
        }
    }

    render() {
        return (
            <div>
                <div className='logo-header'>
                    <i className="fa fa-money logo-icon" aria-hidden="true"></i>
                    <span className='logo-name'>webSlots</span>
                    <span className='header-menu-item'>
                        <Link to={'/'}>
                            <i className="fa fa-sign-out" aria-hidden="true"></i>&nbsp;&nbsp;log out</Link>
                    </span>
                </div>
                <div className='home-container'>
                    <div className='home-content'>
                        <SlotMachine bet={this.state.slotBet} handleResult={this.handleResult}/>
                    </div>
                </div>
                <div className={'result-text display-' + this.state.showResult}>
                    {this.state.result}
                    </div>
                <TextField
                    className={'text-field-container display-' + !this.state.showResult}
                            hintText=""
                            floatingLabelStyle={styles.floatingLabelStyle}
                            floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                            hintStyle={styles.hintStyle}
                            errorStyle={styles.errorStyle}
                            underlineStyle={styles.underlineStyle}
                            underlineFocusStyle={styles.underlineStyle}
                            inputStyle={styles.inputStyle}
                            value={this.state.bet}
                            onChange={this.handleBetChange}
                            errorText={this.state.err[0]}
                            type="number"
                            floatingLabelText="enter bet amount"/>
                        <br/><br/>
                        <RaisedButton
                            className={'display-' + !this.state.showResult}
                            label="Set Bet"
                            labelPosition="before"
                            primary={true}
                            style={styles.button}
                            onClick={this.handleBetSubmit} />
                        <br />
                        <br/>
                <div className="footer-container">
                    <Tabs className="tabs-root">
                        <Tab
                            icon={<i className="fa fa-user" aria-hidden="true"></i>}
                            label='user-info'>
                            <div className="tab-container">
                                <div className="tab-info-text">
                                    Name : {this.state.name}
                                    <br />
                                    Account Balance : {this.state.balance}
                                    </div>
                            </div>
                        </Tab>
                        <Tab
                            icon={<i className="fa fa-btc" aria-hidden="true"></i>}
                            label="deposit">
                            <div className="tab-container">
                                <div className="tab-info-text">
                                    WebSlot wallet : {this.state.wallet}
                                    <br />
                                    </div>
                            </div>
                        </Tab>
                        <Tab
                            icon={<i className="fa fa-university" aria-hidden="true"></i>}
                            label="withdraw">
                            <div className="tab-container">
                                <div className="tab-info-text">
                            <TextField
                            className='send-btc-container'
                            hintText=""
                            errorStyle={styles.errorStyle}
                            value={this.state.sendAdd}
                            onChange={this.handleSendAddChange}
                            errorText={this.state.err[1]}
                            floatingLabelText="enter destination address" /><br/>
                        <TextField
                            className='send-btc-container'
                            hintText=""
                            errorStyle={styles.errorStyle}
                            value={this.state.sendAmount}
                            onChange={this.handleSendAmountChange}
                            errorText={this.state.err[2]}
                            type="number"
                            floatingLabelText="enter btc to be withdrawn"/>
                            <br/><br/>
                        <RaisedButton
                            label="Withdraw"
                            labelPosition="before"
                            primary={true}
                            style={styles.button}
                            onClick={this.handleWithdraw} />
                        <br />
                        {this.state.withdrawStatus}
                        <br />
                                </div>
                                </div>
                        </Tab>
                    </Tabs>
                </div>
            </div>
        )
    }

    componentDidMount() {
        this.getUserInfo();
    }

    getUserInfo() {

        Axios
            .post('/user/getBCBalance', {
                username: this.state.email
            })
            .then((response) => {
                if (response.status == 200) {
                    if (response.data && response.data.status) {
                        cxt.setState({
                            balance: bitsToBTC(response.data.data)
                        })
                    } else {
                        cxt.setState({ balance: ' Error fetching' })
                    }

                } else {
                    cxt.setState({ balance: ' Error fetching' });
                }
            })
            .catch((error) => {
                console.dir(error);
                if (error.response && error.response.data && error.response.data.err && error.response.data.err.message) {
                    cxt.setState({ balance: error.response.data.err.message });
                } else {
                    cxt.setState({ balance: ' Error fetching' });
                }
            });

        // User Info
        Axios
            .post('/user/info', {
                username: this.state.email
            })
            .then((response) => {
                if (response.status == 200) {
                    if (response.data && response.data.status) {
                        cxt.setState({
                            name: response.data.data.name,
                            wallet:response.data.data.wallet
                        })
                    } else {
                        cxt.setState({ name: ' Error fetching' })
                    }

                } else {
                    cxt.setState({ name: ' Error fetching' });
                }
            })
            .catch((error) => {
                console.dir(error);
                if (error.response && error.response.data && error.response.data.err && error.response.data.err.message) {
                    cxt.setState({ name: error.response.data.err.message });
                } else {
                    cxt.setState({ name: ' Error fetching' });
                }
            });
    }

    sendWithdrawReqToServer() {
        cxt.setState({ withdrawStatus : ' Sending Request to Server. Wait' })
        Axios
        .post('/user/sendfunds', {
            username: this.state.email,
            amount: this.state.sendAmount,
            address:this.state.sendAdd
        })
        .then((response) => {
            if (response.status == 200) {
                if (response.data && response.data.status) {
                    // Success
                    cxt.setState({ withdrawStatus : ' Successful Transfer' , sendAmount : 0 })
                } else {
                    cxt.setState({ withdrawStatus : ' Error while withdraw' })
                }

            } else {
                cxt.setState({ withdrawStatus: ' Error while withdraw' })
            }
            this.getUserInfo();
            handleWithdrawFlag = true;
        })
        .catch((error) => {
            console.dir(error);
            if (error.response && error.response.data && error.response.data.err && error.response.data.err.message) {
                cxt.setState({ withdrawStatus : error.response.data.err.message });
            } else {
                cxt.setState({ withdrawStatus : ' Error while withdraw' })
            }
            this.getUserInfo();
            handleWithdrawFlag = true;
        });
    }
}

function bitsToBTC(data){
    return (data / 1e8).toFixed(8);
};