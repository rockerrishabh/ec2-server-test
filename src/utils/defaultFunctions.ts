import argon2 from "argon2";

export const matchPassword = async (
  hashedPassword: string,
  plainPassword: string
) => {
  const verifyPassword = await argon2.verify(hashedPassword, plainPassword);
  return verifyPassword;
};

export const checkPassword = (password: string, confirmPassword: string) => {
  return password === confirmPassword;
};

export const hashPassword = async (password: string) => {
  const hashed = await argon2.hash(password);
  return hashed;
};
