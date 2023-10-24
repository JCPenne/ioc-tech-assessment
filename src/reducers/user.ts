import { User } from '../types';

export type UserState = {
  user?: User;
  isLoading: boolean;
  error?: string | null;
};

export type UserAction =
  | { type: 'login'; payload: User }
  | { type: 'logout' }
  | { type: 'setColumnOrder'; payload?: string[] }
  | { type: 'saveColumnOrder'; payload?: string[] }
  | { type: 'fetchColumnOrder' };

//To Do: Utilize Loading and Error states to handle async actions or actions that could fail.
export function userReducer(state: UserState, action: UserAction): UserState {
  switch (action.type) {
    case 'login': {
      const userObject = localStorage.getItem('user');
      let parsedUserObject = {};
      if (typeof userObject === 'string') {
        parsedUserObject = JSON.parse(userObject);
      } else {
        parsedUserObject = { email: action.payload.email };
        localStorage.setItem('user', JSON.stringify(parsedUserObject));
      }

      return { ...state, user: { email: action.payload.email } };
    }

    case 'logout': {
      return { ...state, user: undefined };
    }

    case 'setColumnOrder': {
      return { ...state, user: { ...state.user, columnOrder: action.payload } };
    }

    case 'saveColumnOrder': {
      const userObject = localStorage.getItem('user');
      let parsedUserObject = {};
      if (typeof userObject === 'string') {
        parsedUserObject = JSON.parse(userObject);
      }
      const updatedUserObject = { ...parsedUserObject, columnOrder: action.payload };
      localStorage.setItem('user', JSON.stringify(updatedUserObject));

      return state;
    }

    case 'fetchColumnOrder': {
      const userObject = localStorage.getItem('user');
      let parsedUserObject = {};
      if (typeof userObject === 'string') {
        parsedUserObject = JSON.parse(userObject);
      }
      return { ...state, user: parsedUserObject };
    }

    default: {
      return state;
    }
  }
}
