import bcrypt from 'bcryptjs'

export const hashPassword = (password: string): string => {
  return bcrypt.hashSync(password);
};

export const comparePass = (password: string, hashedPass: string): boolean => {
  return bcrypt.compareSync(password, hashedPass);
}
