import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Auth from './components/auth/auth'
import Dashboard from './components/dashboard/dashboard';
import MapChildComponent from './components/maps/maps';
import ProfileMapComponent from './components/profile/profile';
import Predict from './components/predict/predict';



class Routes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      routes: [
        { path: 'maps', component: MapChildComponent },
        { path: 'profile', component: ProfileMapComponent },
        { path: 'predict', component: Predict },
      ],
    };
  }

  render() {
    const { routes } = this.state;
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={Auth} />
          <Dashboard>
            {routes.map((route) => (
              <Route
                key={route.path}
                exact
                path={`/${route.path}`}
                component={route.component}
              />
            ))}
          </Dashboard>
        </Switch>
      </Router>
    );
  }
}


export default Routes
