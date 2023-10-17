import { useReducer } from 'react';
import { userReducer } from '../reducers/user';
import { UserContext } from '../contexts/user';

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(userReducer, { isLoading: false });

  return <UserContext.Provider value={{ state, dispatch }}>{children}</UserContext.Provider>;
};
