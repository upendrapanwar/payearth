import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { isLogin } from './../../helpers/login';

const PrivateRoute = ({ component: Component, roles, currentUserRole, ...rest }) => (
    <Route {...rest} render={props => {
        const currentUser = isLogin();
        if (!currentUser) {
            // not logged in so redirect to login page with the return url
            return <Redirect to={{ pathname: '/'}} />
        }

        // check if route is restricted by role
        if (roles && roles.indexOf(currentUserRole) === -1) {
            // role not authorised so redirect to home page
            return <Redirect to={{ pathname: '/'}} />
        }

        // authorised so return component
        return <Component {...props} />
    }} />
)

export default PrivateRoute;