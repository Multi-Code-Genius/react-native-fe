export type RootStackParamList = {
  Home: undefined;
  Details: {itemId: number} | undefined;
  User: {itemId: number} | undefined;
  FriendsRequestAcceptScreen: undefined;
  Profile: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  ResetPassword: {token: string};
};
