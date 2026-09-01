const KOREAN_RESIDENT_ID = /(?:^|\D)\d{6}\s*-?\s*[1-8]\d{6}(?!\d)/u;
const PASSWORD_VALUE = /(?:비밀번호|password|passcode)\s*[:=]\s*\S{4,}/iu;
const CARD_CANDIDATE = /(?:\d[ -]?){13,19}/gu;

function passesLuhn(value: string) {
  let sum = 0;
  let doubleDigit = false;

  for (let index = value.length - 1; index >= 0; index -= 1) {
    let digit = Number(value[index]);
    if (doubleDigit) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    doubleDigit = !doubleDigit;
  }

  return sum % 10 === 0;
}

export function containsHighlySensitiveData(value: string) {
  if (KOREAN_RESIDENT_ID.test(value) || PASSWORD_VALUE.test(value)) return true;

  for (const match of value.matchAll(CARD_CANDIDATE)) {
    const digits = match[0].replace(/\D/gu, "");
    if (digits.length >= 13 && digits.length <= 19 && passesLuhn(digits)) return true;
  }

  return false;
}
