export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  ProductDetail: { productId: string };
  OrderDetail: { orderId: string };
  Checkout: { order: import('../types').Order };
  Payment: { order: import('../types').Order };
  Address: undefined;
  AddAddress: { order: import('../types').Order };
  EditAddress: { address: import('../types').Address };
};

