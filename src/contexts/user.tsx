import { createContext, useContext, useReducer } from 'react';
import { UserAction, UserActionType, userReducer } from '../reducers/userReducer';

type UserState = {
  user: { email: string | null } | undefined;
};
type UserContextType = {
  state: UserState;
  dispatch: React.Dispatch<UserAction>;
};

export const UserContext = createContext<UserContextType>({
  state: { user: undefined },
  dispatch: () => {},
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(userReducer, { user: undefined } as UserState);

  return <UserContext.Provider value={{ state, dispatch }}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const { state, dispatch } = useContext(UserContext);
  const user = state.user;

  const logIn = (email: string = 'UserOne@email.com') => {
    dispatch({ type: UserActionType.LOGIN, payload: { user: { email } } });
  };
  const logOut = () => {
    dispatch({ type: UserActionType.LOGOUT, payload: undefined });
  };

  return { user, logOut, logIn };
};
