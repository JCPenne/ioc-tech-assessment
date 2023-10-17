import { createContext, useContext } from 'react';
import { UserState, UserAction } from '../reducers/user';

type UserContextType = {
  state: UserState;
  dispatch: React.Dispatch<UserAction>;
};

export const UserContext = createContext<UserContextType>({
  state: { isLoading: false },
  dispatch: () => {},
});

export const useUser = () => {
  const { state, dispatch } = useContext(UserContext);
  const user = state.data;

  const logIn = (email: string = 'UserOne@email.com') => {
    dispatch({ type: 'login', payload: { email: email } });
  };
  const logOut = () => {
    dispatch({ type: 'logout' });
  };

  return { user, logOut, logIn };
};
