import React, { useEffect } from "react";
import { Route, useHistory, useLocation } from "react-router-dom";
import jwt_decode from 'jwt-decode';


const PrivateRoute = ({ exact, component: Component, ...rest }) => {
  const location = useLocation();
  const history = useHistory();
  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    if( !token || typeof token === "boolean" ) {
      history.push("/auth-login");
      return;
    }
    const decoded = jwt_decode(token);
    console.log("token decode", decoded)
    if ( decoded.exp < Date.now() / 1000 ) {
        history.push("/auth-login");
        return;
    } else {
    }
  }, [ location.pathname ])
  return ( // eslint-disable-line
  <Route
    exact={exact ? true : false}
    rest
    render={(props) =>
        <Component {...props} {...rest}></Component>
    }
  ></Route>)
};

export default PrivateRoute;
