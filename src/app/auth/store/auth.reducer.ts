import { User } from '../user.model';
import * as AuthActions from './auth.actions';

export interface State {
  user: User;
  authError: string;
}

const initialState: State = {
  user: null,
  authError: null
};

export function authReducer(state = initialState, action: AuthActions.AuthActions) {
  switch (action.type) {
    case AuthActions.AUTHENTICATE_SUCCESS:
      const user = new User(action.payload.email, action.payload.userId,
                            action.payload.token, action.payload.expirationDate);
      return {
        ...state,
        user,
        authError: null
      };
    case AuthActions.LOGOUT:
      return {
        ...state,
        user: null
      };
    case AuthActions.SIGNUP_START:
    case AuthActions.LOGIN_START:
      return {
        ...state,
        authError: null
      };
    case AuthActions.AUTHENTICATE_FAIL:
      return {
        ...state,
        user: null,
        authError: action.payload
      };
    case AuthActions.CLEAR_ERROR:
      return {
        ...state,
        authError: null
      };
    default:
      return state;
  }
}
