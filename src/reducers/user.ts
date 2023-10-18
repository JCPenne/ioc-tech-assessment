type User = {
  email: string;
};

export type UserState = {
  data?: User;
  isLoading: boolean;
  error?: string;
};

export type UserAction = { type: 'login'; payload: User } | { type: 'logout' };


//To Do: Utilize Loading and Error states to handle async actions or actions that could fail.
export function userReducer(state: UserState, action: UserAction) {
  switch (action.type) {
    case 'login':
      return { ...state, data: { email: action.payload.email } };

    case 'logout':
      return { ...state, data: undefined };

    default:
      return state;
  }
}
