import { unformatMaskValidation, maskValidation } from 'shared/patterns/validationPatterns';
import { unformat } from '@react-input/mask';

export function getUnformattedPhone(phoneNumber: string = '') {
  return unformat(phoneNumber, unformatMaskValidation.PHONE.mask);
}

export function getFormattedPhone(phoneNumber: string = '') {
  return unformat(phoneNumber, unformatMaskValidation.PHONE.mask);
}
