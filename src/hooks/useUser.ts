import { useContext } from 'react';
import { UserContext } from '../contexts/user';

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
