import axios from 'axios';
import { LOG_IN, LOG_OUT, SIGN_UP, HANDLE_EMAIL_INPUT, HANDLE_PASSWORD_INPUT, CLEAR_AUTH_INPUTS, CHECK_SESSION } from './actionTypes';

export function handleEmailInput(input) {
  return function (dispatch) {
    dispatch({
      type: HANDLE_EMAIL_INPUT,
      payload: input.target.value,
    });
  };
}

export function handlePasswordInput(input) {
  return function (dispatch) {
    dispatch({
      type: HANDLE_PASSWORD_INPUT,
      payload: input.target.value,
    });
  };
}

export function clearAuthInputs() {
  return function (dispatch) {
    dispatch({
      type: CLEAR_AUTH_INPUTS,
      emailAddress: '',
      password: '',
    });
  };
}

export function checkLogin(email, password) {
  return function (dispatch) {
    console.log('checkLogin called with:', email, password);
    // dispatch({
    //   type: LOG_IN,
    //   emailAddress: email,
    //   password: password,
    // });
  };
}

export function checkLogout() {
  return function (dispatch) {
    console.log('checkLogout called!');
    // dispatch({
    //   type: LOG_OUT,
    //   emailAddress: email,
    //   password: password,
    // });
  };
}

export function checkSignup(email, password) {
  return function (dispatch) {
    console.log('checkSignup called with:', email, password);
    // dispatch({
    //   type: SIGN_UP,
    //   emailAddress: email,
    //   password: password,
    // });
  };
}

export function handleFacebookLogin(user) {
  return function (dispatch) {
    return axios.get('/auth/facebook', {
      params: user,
    })
    .then((response) => {
      console.log('Response from facebookLogin:', response);
      dispatch({
        type: LOG_IN,
        isLoggedIn: true,
        payload: response,
      });
    })
    .catch((err) => {
      console.error('Error on login:', err);
    });
  };
}

export function handleFacebookLogout(user) {
  return function (dispatch) {
    return axios.get('/unlink/facebook', {
      params: user,
    })
    .then((response) => {
      console.log('Response from facebookLogout:', response);
      dispatch({
        type: LOG_OUT,
        isLoggedIn: false,
        payload: response,
      });
    })
    .catch((err) => {
      console.error('Error on logout:', err);
    });
    // dispatch({
    //   type: LOG_OUT,
    //   isLoggedIn: false
    // });
  };
}

// export function checkFacebookSession(user) {
//   return function (dispatch) {
//     return axios.get('/auth/facebook', {
//       params: user,
//     })
//     .then((response) => {
//       console.log('Response from checkFacebookSession:', response);
//       dispatch({
//         type: CHECK_SESSION,
//         status: response,
//       });
//     })
//     .catch((err) => {
//       console.error('Error on checkSession:', err);
//     });
//     // dispatch({
//     //   type: LOG_OUT,
//     //   isLoggedIn: false
//     // });
//   };
// }


