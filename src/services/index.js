import authService from './authService';
import userService from './userService';
import productService from './productService';
import cartService from './cartService';
import orderService from './orderService';
import notificationService from './notificationService';
import adminService from './adminService';
import serviceService from './serviceService';
import quoteService from './quoteService';
import fileService from './fileService';

export {
  authService,
  userService,
  productService,
  cartService,
  orderService,
  notificationService,
  adminService,
  serviceService,
  quoteService,
  fileService,
};

export default {
  auth: authService,
  user: userService,
  product: productService,
  cart: cartService,
  order: orderService,
  notification: notificationService,
  admin: adminService,
  service: serviceService,
  quote: quoteService,
  file: fileService,
};