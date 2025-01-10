import { useAuthUser } from "@/providers/authProvider"
import { LoginCredentials, RegisterCredentials } from "@/domain/auth/authService";
import * as actions from "@/actions/auth";

export const useAuth = () => {
  const { update } = useAuthUser();

  const login = async (credentials: LoginCredentials) => {
    const data = await actions.login(credentials);

    if (data.error) throw data.message;

    update!();
  }

  const register = async (credentials: RegisterCredentials) => {
    const data = await actions.register(credentials);
    const loginCredentials = {
      email: credentials.email,
      password: credentials.password,
    }
    if ('error' in data && data.error) {
      throw data.message;
    } else {
      login(loginCredentials) 
    }
    

    update!();
  }

  const logout = async () => {
    await actions.logout();
  }

  return {
    login,
    register,
    logout,
  }
}
