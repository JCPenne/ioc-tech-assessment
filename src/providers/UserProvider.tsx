import { useReducer } from 'react';
import { UserState, userReducer } from '../reducers/user';
import { UserContext } from '../contexts/user';

const defaultState: UserState = {
  isLoading: false,
};

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(userReducer, defaultState);

  return <UserContext.Provider value={{ state, dispatch }}>{children}</UserContext.Provider>;
};
