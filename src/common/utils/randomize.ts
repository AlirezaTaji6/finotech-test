import { otpCodeLength } from '../constants/otp-code-length';

const characters = {
  numeric: '0123456789',
  alphabetLowercase: 'abcdefghijklmnopqrstuvwxyz',
  alphabetUppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
};

const generateRandomString = (chars: string, len: number) => {
  let result = '';
  while (len--) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
};

export const generateVerificationCode = () =>
  generateRandomString(characters.numeric, otpCodeLength);
