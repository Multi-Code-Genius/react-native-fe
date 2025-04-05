export type RootStackParamList = {
  Home: undefined;
  Details: {itemId: number} | undefined;
  User: {itemId: number} | undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  ResetPassword: {token: string};
};
