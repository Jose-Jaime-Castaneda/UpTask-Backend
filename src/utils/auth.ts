import bcrypt from "bcrypt";

export const hashPassword = async (pwd: string) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(pwd, salt);
};

export const checkPassword = async (newPwd: string, pwd: string) => {
  return await bcrypt.compare(newPwd, pwd)
}
