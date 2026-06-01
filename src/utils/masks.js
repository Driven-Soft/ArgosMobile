export function maskPhone(value) {
  const digits = (value ?? "").replace(/\D/g, "").slice(0, 11);

  if (digits.length === 0) return "";
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10)
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function maskEmail(value) {
  return (value ?? "").replace(/\s/g, "").toLowerCase();
}

export function maskName(value) {
  return (value ?? "")
    .replace(/[^A-Za-zÀ-ÿ\s]/g, "")
    .replace(/\s{2,}/g, " ");
}

export function onlyDigits(value) {
  return (value ?? "").replace(/\D/g, "");
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value) {
  return EMAIL_REGEX.test((value ?? "").trim());
}

export function isValidPhone(value) {
  const len = onlyDigits(value).length;
  return len === 10 || len === 11;
}
