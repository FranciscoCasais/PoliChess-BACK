import jwt, { JwtPayload } from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "mi_clave_secreta";

export function generateToken(idUsuario: number, isAdmin: boolean): string {
  return jwt.sign({ id: idUsuario, isAdmin: isAdmin }, SECRET_KEY, { expiresIn: "2h" });
}

export function verifyToken(token: string): string | JwtPayload | null {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    return null;
  }
}
