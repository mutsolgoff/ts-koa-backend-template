import bcrypt from "bcrypt";

export const verifyPassword = ({
  candidatePassword,
  salt,
  hash,
}: {
  candidatePassword: string;
  salt: string;
  hash: string;
}) => {
  const candidateHash = bcrypt.hashSync(candidatePassword, salt);
  if (candidateHash === hash) return true;
  else return false;
};
