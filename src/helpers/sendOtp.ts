export function createOtp(): number {
  return 10000 + Math.floor(Math.random() * 90000);
}
