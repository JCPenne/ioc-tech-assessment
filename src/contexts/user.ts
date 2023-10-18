import { createContext } from 'react';
import { UserState, UserAction } from '../reducers/user';

type UserContextType = {
  state: UserState;
  dispatch: React.Dispatch<UserAction>;
};

export const UserContext = createContext<UserContextType>({
  state: { isLoading: false },
  dispatch: () => {},
});
