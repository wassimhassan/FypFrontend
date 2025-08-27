
import { jwtDecode } from "jwt-decode";

export const getToken = () => localStorage.getItem("token") || null;

export const getUserFromToken = () => {
  const token = getToken();
  if (!token) return null;
  try {
    return jwtDecode(token); // your backend signs { id, role }
  } catch {
    return null;
  }
};

export const hasAnyRole = (user, roles = []) => {
  if (!user) return false;
  if (!roles?.length) return true; // no roles required
  return roles.includes(user.role);
};

