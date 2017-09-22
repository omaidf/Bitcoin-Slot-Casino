import React from 'react';
import {findDOMNode} from 'react-dom';
import $ from 'jquery';
import Axios from 'axios';

let cxt;
export default class SlotMachine extends React.Component {

    constructor(props) {
        super(props);
        cxt = this;
        window.sm = this;
        cxt.state = this.getInitialStates();
        cxt.bindFunctionsToThis();
    }

    getInitialStates() {
        return {
            slotCredits: this.props.bet,
            spinning: false,
            spin: [
                0, 0, 0
            ]
        };
    }

    bindFunctionsToThis() {
        [
            'handleSlotTriggerOnClick',
            'stopSpin',
            'endSpin',
            'endSlot',
            'sendBetToServer'
        ].map(fn => this[fn] = this[fn].bind(this));
    }

    handleSlotTriggerOnClick() {
        window.blur();
        if (this.sendBetToServer()) {
            if (cxt.state.spinning === false) {
                $('#slot-machine .arm').animate({ top: '45px', height: '2%' });
                $('#slot-machine .arm .knob').animate({ top: '-20px', height: '20px' });
                $('#slot-machine .arm-shadow').animate({
                    top: '40px'
                }, 380);
                $('#slot-machine .ring1 .shadow, #slot-machine .ring2 .shadow').animate({ top: '50%', opacity: 1 });
                cxt.setState({
                    spinning: 3
                }, () => {
                })

                $('img.slotSpinAnimation').show();
                setTimeout(function () {
                    $('#slot-machine .arm').animate({ top: '-25px', height: '50%', overflow: 'visible' });
                    $('#slot-machine .arm .knob').animate({ top: '-15px', height: '16px' });
                    $('#slot-machine .arm-shadow').animate({ top: '13px' });
                    $('#slot-machine .ring1 .shadow, #slot-machine .ring2 .shadow').animate({ top: '0', opacity: 0 });
                }, 500);
            }
        }
    }

    stopSpin(slot) {
        $('#wheel' + slot)
            .find('img:last')
            .hide()
            .end()
            .find('img:first')
            .animate({
                top: -cxt.state.spin[slot - 1] * 44
            }, {
                duration: 500,
                easing: 'elasticOut',
                complete: function () {
                    let spinning = cxt.state.spinning;
                    spinning--;
                    cxt.setState({spinning});
                    if (spinning <= 0) {
                        cxt.endSpin();
                    }

                }
            });
    }

    endSpin() {
        let waitToSpin = 1000;
        this.setState({
            slotCredits: 0
        }, () => {
            setTimeout(function () {
                $('#slot-trigger').removeClass('slot-triggerDisabled');
                cxt.setState({spinning: false});
            }, waitToSpin);
        })
    }

    endSlot() {
        $('#slot-block').show();
        $('#slot-credits').text('VERLOREN!!!');


    }
    componentDidMount() {
        extendJQMethod();
    }

    render() {
        return (
            <div className="container">
                <div id="slot-machine">
                    <div className="row">
                        <div className="slot-container">
                            <div id="slot-body">
                                <div id="slot-block"></div>
                                <div id="slot-frame"></div>
                                <div id="slot-glaze-bottom"></div>
                                <div id="slot-display">
                                    <div id="slot-overlay"></div>
                                    <div id="slot-overlay-line"></div>
                                    <div id="slot-credits">{cxt.state.slotCredits}</div>
                                    <div id="slot-zeros">00000000000</div>
                                </div>
                                <div id="slot-wheels">
                                    <div id="wheel1" className="wheel">
                                        <div className="overlay"></div>
                                        <img
                                            src="../../images/reel-1.gif"
                                            style={{
                                            'top': -(parseInt(cxt.state.spin[0] * 44 + 5)) + 'px'
                                        }}/>
                                        <img src="../../images/reel-anim.gif" className="slotSpinAnimation"/>
                                    </div>
                                    <div id="wheel2" className="wheel">
                                        <div className="overlay"></div>
                                        <img
                                            src="../../images/reel-2.gif"
                                            style={{
                                            'top': -(parseInt(cxt.state.spin[1] * 44 + 5)) + 'px'
                                        }}/>
                                        <img src="../../images/reel-anim.gif" className="slotSpinAnimation"/>
                                    </div>
                                    <div id="wheel3" className="wheel">
                                        <div className="overlay"></div>
                                        <img
                                            src="../../images/reel-3.gif"
                                            style={{
                                            'top': -(parseInt(cxt.state.spin[2] * 44 + 5)) + 'px'
                                        }}/>
                                        <img src="../../images/reel-anim.gif" className="slotSpinAnimation"/>
                                    </div>
                                </div>

                                <div
                                    id="slot-trigger"
                                    onClick={cxt.handleSlotTriggerOnClick}>
                                    <div className="arm">
                                        <div className="knob"></div>
                                    </div>
                                    <div className="arm-shadow"></div>
                                    <div className="ring1">
                                        <div className="shadow"></div>
                                    </div>
                                    <div className="ring2">
                                        <div className="shadow"></div>
                                    </div>
                                </div>

                            </div>

                            <div id="slot-details">
                                <div id="slot-top"></div>
                                <div id="slot-bottom"></div>
                            </div>
                        </div>
                    </div>

                    <div className="slot-legend-container">
                        <div id="slot-legend">
                            <div className="frame"></div>
                            <ul className="wins">
                                <li className="jackpot">
                                    <span className="icon id1"></span>
                                    <span className="icon id2"></span>
                                    <span className="icon id3"></span>
                                    <span className="count">500</span>
                                </li>
                                <li className="win250">
                                    <span className="icon id1"></span>
                                    <span className="icon id2"></span>
                                    <span className="icon id3"></span>
                                    <span className="count">250</span>
                                </li>
                                <li className="win150">
                                    <span className="icon id1"></span>
                                    <span className="icon id2"></span>
                                    <span className="icon id3"></span>
                                    <span className="count">150</span>
                                </li>
                                <li className="win100">
                                    <span className="icon id1"></span>
                                    <span className="icon id2"></span>
                                    <span className="icon id3"></span>
                                    <span className="count">100</span>
                                </li>
                                <li className="win80-1">
                                    <span className="icon id1"></span>
                                    <span className="icon id2"></span>
                                    <span className="icon id3"></span>
                                    <span className="count">80</span>
                                </li>
                                <li className="win80-2">
                                    <span className="icon id1"></span>
                                    <span className="icon id2"></span>
                                    <span className="icon id3"></span>
                                    <span className="count">80</span>
                                </li>
                                <li className="win50-1">
                                    <span className="icon id1"></span>
                                    <span className="icon id2"></span>
                                    <span className="icon none"></span>
                                    <span className="count">50</span>
                                </li>
                                <li className="win50-2">
                                    <span className="icon id1"></span>
                                    <span className="icon id2"></span>
                                    <span className="icon id3"></span>
                                    <span className="count">50</span>
                                </li>
                                <li className="win40">
                                    <span className="icon id1"></span>
                                    <span className="icon id2"></span>
                                    <span className="icon none"></span>
                                    <span className="count">40</span>
                                </li>
                                <li className="win30">
                                    <span className="icon id1"></span>
                                    <span className="icon id2"></span>
                                    <span className="icon id3"></span>
                                    <span className="count">30</span>
                                </li>
                                <li className="win15">
                                    <span className="icon id1"></span>
                                    <span className="icon id2"></span>
                                    <span className="icon none"></span>
                                    <span className="count">15</span>
                                </li>
                                <li className="win10">
                                    <span className="icon id1"></span>
                                    <span className="icon id2"></span>
                                    <span className="icon id3"></span>
                                    <span className="count">10</span>
                                </li>
                                <li className="win5">
                                    <span className="icon id1"></span>
                                    <span className="icon id2"></span>
                                    <span className="icon none"></span>
                                    <span className="count">5</span>
                                </li>
                                <li className="win2">
                                    <span className="icon id1"></span>
                                    <span className="icon none"></span>
                                    <span className="icon none"></span>
                                    <span className="count">2</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.bet != nextProps.bet) {
            this.setState({ slotCredits: nextProps.bet });
        }
    }

    sendBetToServer() {
        if (isNaN(parseFloat(this.state.slotCredits)) || this.state.slotCredits == 0)
        {
            alert('Invalid bet amount');
            return false;
        }
         // User Info
         Axios
         .post('/user/startBet', {
             bet: this.state.slotCredits
         })
             .then((response) => {
                 console.log(response);
             if (response.status == 200) {
                 if (response.data && response.data.status) {
                     let data = response.data.data;
                     if (data.spins) {
                         this.setState({
                             spin: data.spins
                         }, () => {
                            setTimeout(function () {
                                cxt.stopSpin(1);
                            }, parseInt(1000 * Math.random()));

                            setTimeout(function () {
                                cxt.stopSpin(2);
                            }, parseInt(1000 * Math.random()));

                            setTimeout(function () {
                                cxt.stopSpin(3);
                            }, parseInt(1000 * Math.random()));
                            if (data.win > 0) {
                                this.props.handleResult("Congrats ! win : " + data.win + "x");
                            }
                            else
                            {
                                this.props.handleResult("Win : " + data.win);
                            }
                         })
                     }
                 } else {
                     this.props.handleResult("Error while playing slot");
                 }

             } else {
                this.props.handleResult("Error while playing slot");
             }
         })
         .catch((error) => {
             console.dir(error);
             if (error.response && error.response.data && error.response.data.err && error.response.data.err.message) {
                 this.props.handleResult(error.response.data.err.message);
             } else {
                 this.props.handleResult("Error while playing slot");
             }
             });
         return true;
    }
}

function extendJQMethod() {
    $.extend($.easing, {
        bounceOut: function (x, t, b, c, d) {
            if ((t /= d) < (1 / 2.75)) {
                return c * (7.5625 * t * t) + b;
            } else if (t < (2 / 2.75)) {
                return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
            } else if (t < (2.5 / 2.75)) {
                return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
            } else {
                return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
            }
        },
        easeOut: function (x, t, b, c, d) {
            return -c * (t /= d) * (t - 2) + b;
        },
        elasticOut: function (x, t, b, c, d) {
            var s = 1.70158;
            var p = 0;
            var a = c;
            if (t == 0)
                return b;
            if ((t /= d) == 1)
                return b + c;
            if (!p)
                p = d * .3;
            if (a < Math.abs(c)) {
                a = c;
                var s = p / 4;
            } else
                var s = p / (2 * Math.PI) * Math.asin(c / a);
            return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
        }
    });
}