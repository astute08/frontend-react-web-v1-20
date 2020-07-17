import React from 'react';
import { KeycloakProvider } from '@react-keycloak/web';
import keycloak from '../components/v2.1.0/keycloak/keycloak';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom';
import moment from 'moment';
import Login from '../pages/login/index';
import Dashboard from '../layout/index';
import LoginForm from '../pages/login/loginForm';
import Company from '../pages/login/company';
import Register from '../pages/register/index';
import { AppProvider } from '../includes/indexProvider';
import { isUndefined } from 'lodash';

const expireToken = localStorage.getItem('expireInfo');
const accessToken = localStorage.getItem('accessToken');
const now = Date.now();

const expireTokenCheck = expireToken < now || expireToken == "undefined";
const accessComponent = expireToken < now || expireToken == "undefined" ? Login : Dashboard;
const accessPath = expireTokenCheck ? '/' : '/menu/user';

console.log("expireToken", expireToken);
// console.log("accessComponent",  accessPath);


const routes = [
  {
    path: '/menu',
    component: Dashboard
  },
  {
    path: "/register/:token",
    component: Register
  },
  {
    path: '/',
    component: accessComponent,
    routes: [
      {
        path: "/login/loginform",
        component: LoginForm
      },
      {
        path: "/login/company",
        component: Company
      }
    ]
  },

];



export default function RouteConfigExample() {

  const onKeycloakEvent = (event, error) => {
    console.log('onKeycloakEvent : ', event, error);
  };

  const onKeycloakTokens = (tokens) => {
    console.log('onKeycloakTokens : ', tokens);
  };

  // const checkAccessToken = () => {
  //   expireToken < now ? 
  // }

  return (
    // <KeycloakProvider keycloak={keycloak} onKeycloakTokens={onKeycloakTokens} >
    <AppProvider>
      <Router>
        <div>

          <Switch>
            {routes.map((route, i) => (
              <RouteWithSubRoutes key={i} {...route} />
            ))}
          </Switch>
        </div>
      </Router>
    </AppProvider>
    // </KeycloakProvider>
  );
}

function RouteWithSubRoutes(route) {
  return (
    <Route
      path={route.path}
      render={(props) => (
        // pass the sub-routes down to keep nesting
        <route.component {...props} routes={route.routes} />
      )}
    />
  );
}
