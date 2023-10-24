import { useContext } from 'react';
import { UserContext } from '../contexts/user';
import { MRT_ColumnOrderState, MRT_Updater } from 'material-react-table';

export const useUser = () => {
  const { state, dispatch } = useContext(UserContext);
  const user = state.user;

  const logIn = (email: string = 'UserOne@email.com') => {
    dispatch({ type: 'login', payload: { email: email } });
  };
  const logOut = () => {
    dispatch({ type: 'logout' });
  };
  const fetchColumnOrder = () => {
    dispatch({ type: 'fetchColumnOrder' });
  };
  const setColumnOrder = (newColumnOrder: MRT_Updater<MRT_ColumnOrderState>) => {
    dispatch({ type: 'setColumnOrder', payload: newColumnOrder as string[] });
  };
  const saveColumnOrder = (userColumnState: string[] | undefined) => {
    dispatch({ type: 'saveColumnOrder', payload: userColumnState });
  };

  return { user, logOut, logIn, setColumnOrder, fetchColumnOrder, saveColumnOrder };
};
