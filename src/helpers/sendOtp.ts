export function createOtp(): number {
  return 100000 + Math.floor(Math.random() * 900000);
}
