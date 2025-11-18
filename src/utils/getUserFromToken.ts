import { User } from "@/models/user";
import { deleteCookie } from "cookies-next";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";

export const getUserFromToken = (token: string): User | null => {
    try {
      const decoded = jwtDecode<User>(token);

      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        toast.warning("Token expirado.");

        deleteCookie("accessToken");

        return null;
      }

      return {
        id: decoded.id,
        name: decoded.name,
        email: decoded.email,
        role: decoded.role,
      };
    } catch (err) {
      toast.error(`Erro ao decodificar token: ${err}`);
      
      return null;
    }
  };
