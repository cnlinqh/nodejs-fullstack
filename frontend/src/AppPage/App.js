import React from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { history } from '../_helpers';
import { Topics } from '../HomePage';
import { Login } from '../LoginPage';
import { Register } from '../RegisterPage';
import { PrivateRoute } from '../AppPage'
import { alertActions, userActions } from '../_actions';

class App extends React.Component {
    constructor(props) {
        super(props);

        history.listen((location, action) => {
            // clear alert on location change
            this.props.clear();
        });
    }
    render() {
        const { alert, user } = this.props;
        var loginStatus = user.currentUser && user.currentUser.name ? true : false;
        return (
            <div>
                <div className="navbar navbar-inverse">
                    <div className="container">
                        {/* {loginStatus? <a className="navbar-brand">Welcome {user.currentUser.name}</a>:<div></div>} */}
                        <ul className="nav navbar-nav navbar-right">
                            <li>
                                <a onClick={() => { history.push("/home"); }}>
                                    <span className="glyphicon glyphicon-home" /> Home
                                </a>
                            </li>
                            <li>
                                {loginStatus ?
                                    <a onClick={() => { this.props.logout(); history.push("/login"); }}>
                                        <span className="glyphicon glyphicon-log-out" /> Logout
                                    </a>
                                    :
                                    <a onClick={() => { history.push("/login"); }}>
                                        <span className="glyphicon glyphicon-log-in" /> Login
                                    </a>}
                            </li>
                            <li>
                                <a onClick={() => { history.push("/register"); }}>
                                    <span className="glyphicon glyphicon-registration-mark" /> Sign Up
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                {alert.msg && <div>{alert.msg}</div>}
                <main>
                    <Router history={history}>
                        <Switch>{/* Switch make sure there is one one Route will be matched */}
                            <PrivateRoute path='/home' component={Topics}></PrivateRoute>
                            <Route path='/login' component={Login}></Route>
                            <Route path='/register' component={Register}></Route>
                            <Redirect to="/home"></Redirect>
                        </Switch>
                    </Router>
                </main>
            </div>
        )
    }
}

function mapStateToProps(state) {
    const { alert, user } = state;
    return { alert, user }
}
const mapDispatchToProps = {
    clear: alertActions.clear,
    logout: userActions.logout

}
const connectedApp = connect(mapStateToProps, mapDispatchToProps)(App);
export { connectedApp as App };
