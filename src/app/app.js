import React from 'react'
import {BrowserRouter as Router, Route, Link, browserHistory} from 'react-router-dom'
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

// Needed for onTouchTap
injectTapEventPlugin();

/*
  Route Container for Application
*/
import LandingPage from './containers/LandingPage'
import Home from './containers/Home'
import Login from './containers/Login'
import SignUp from './containers/SignUp'

export default class App extends React.Component {
    render() {
        return (
            <MuiThemeProvider>
                <Router history={browserHistory}>
                    <div>
                        <Route exact path='/' component={LandingPage} />
                        <Route path='/home' component={ Home } />
                        <Route path='/login' component={ Login } />
                        <Route path='/signup' component={ SignUp } />
                    </div>
                </Router>
            </MuiThemeProvider>
        )
    }
}
