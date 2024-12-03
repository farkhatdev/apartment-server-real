export function createOtp(): number {
  return 10000 + Math.floor(Math.random() * 90000);
}
const sendOtp = async (phoneNumber: string) => {
  try {
    console.log(phoneNumber);
  } catch (error) {
    console.error(error);
  }
};

export default sendOtp;
