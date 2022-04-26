export const Msg = {
  required: "This field is required",
  email: "Email is not correct",
  wrongPromo: "Promocode is not correct",
  wrongWallet: "Wallet is not correct",
  summError(summ: number) { return `Promocode is available for amounts above ${summ}$` },
  requiredField(fieldName: string) { return `${fieldName} is required field` },
  onlyPositiveDigits: "Оnly positive digits are accepted",
  blockedWallet: "Your wallet has been blocked",
  maxLength(length: number) { return `Permissible maximum length is ${length}` },
  wrongPass: "Passwords must contain at least 8 characters, including uppercase, lowercase letters, numbers and special symbol",
  onlyPositive: "Only positive digits are accepted",
  min(s: number) { return `Amount must be above ${s}$` },
  max(s: number) { return `Amount must be less than ${s}$` }

}
