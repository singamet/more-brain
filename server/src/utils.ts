import crypto from "crypto";
export const generateHash = (id: string) => {
  const hash = crypto.createHash("sha256");
  hash.update(id);
  return hash.digest("hex").slice(0, 15);
};
