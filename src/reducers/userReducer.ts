interface User {
  user: { email: string | null } | undefined;
}

export enum UserActionType {
  LOGIN = 'login',
  LOGOUT = 'logout',
}
export type UserAction = {
  type: UserActionType;
  payload?: any;
};

export function userReducer(state: User, action: UserAction) {
  switch (action.type) {
    case UserActionType.LOGIN:
      return { ...state, user: action.payload };

    case UserActionType.LOGOUT:
      return { ...state, user: null };
  }
}
