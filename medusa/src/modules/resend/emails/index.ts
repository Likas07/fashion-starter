import AuthPasswordResetEmail from './auth-password-reset';
import OrderPlacedEmail from './order-placed';
import WelcomeEmail from './welcome';

export const subjects = {
  'auth-password-reset': 'Reset your password',
  'order-placed': 'Your order has been placed',
  'customer-welcome': 'Welcome to Sofa Society!',
};

export default {
  'auth-password-reset': AuthPasswordResetEmail,
  'order-placed': OrderPlacedEmail,
  'customer-welcome': WelcomeEmail,
};
