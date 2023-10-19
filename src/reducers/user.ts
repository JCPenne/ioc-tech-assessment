import { MRT_ColumnOrderState, MRT_Updater } from 'material-react-table';

type User = {
  email: string;
  columnOrder?: string[];
};

export type UserState = {
  data?: User;
  isLoading: boolean;
  error?: string;
};

export type UserAction =
  | { type: 'login'; payload: User }
  | { type: 'logout' }
  | { type: 'setColumnOrder'; payload: MRT_Updater<MRT_ColumnOrderState> }
  | { type: 'saveColumnOrder'; payload?: string[] }
  | { type: 'fetchColumnOrder' };

//To Do: Utilize Loading and Error states to handle async actions or actions that could fail.
export function userReducer(state: UserState, action: UserAction) {
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

      return { ...state, data: { email: action.payload.email } };
    }

    case 'logout': {
      return { ...state, data: undefined };
    }

    case 'setColumnOrder': {
      return { ...state, data: { ...state.data, columnOrder: action.payload } };
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
      return { ...state, data: parsedUserObject };
    }

    default: {
      return state;
    }
  }
}
