import React, { useEffect } from "react";
import { Route, useHistory, useLocation } from "react-router-dom";
import jwt_decode from 'jwt-decode';
import LoadingOverlay from 'react-loading-overlay';
import {
  useDispatch,
  useSelector,
} from 'react-redux';
import { setAdmin } from "../actions"


const PrivateRoute = ({ exact, component: Component, ...rest }) => {
  const location = useLocation();
  const history = useHistory();
  const checking = useSelector(state => state.user.checking);
  const dispatch = useDispatch();
  const admin = useSelector(state => state.user.admin);
  
  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    if( !token || typeof token === "boolean" ) {
      history.push("/auth-login");
      return;
    }
     try {
      const decoded = jwt_decode(token);
      console.log("token decode", decoded)
      if ( decoded.exp < Date.now() / 1000 ) {
          history.push("/auth-login");
          return;
      } else {
        if(!admin){
          const temp =  JSON.parse(localStorage.getItem("admin"));
          dispatch(setAdmin(temp));
        }
      }
    } catch (error) {
      history.push("/auth-login");
      return;
    }
    
  }, [ location.pathname ])
  return ( // eslint-disable-line
  <LoadingOverlay active={checking} spinner>

    <Route
      exact={exact ? true : false}
      rest
      render={(props) =>
          <Component {...props} {...rest}></Component>
      }
    ></Route>
  </LoadingOverlay>
)};

export default PrivateRoute;
