import { createContext, useState } from "react";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  user: string;
  iat?: number;
  exp?: number;
}

interface AuthContextValue {
  userToken: string | null;
  setUserToken: (token: string | null) => void;
  userId: string;
  setUserId: (id: string) => void;
}

export const AuthContext = createContext<AuthContextValue>({
  userToken: null,
  setUserToken: () => { },
  userId: "",
  setUserId: () => { },
});

function decodeTokenUserId(token: string): string {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded?.user ?? "";
  } catch {
    return "";
  }
}

export function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const [userToken, setUserTokenState] = useState<string | null>(() => {
    return localStorage.getItem("userToken");
  });

  const [userId, setUserId] = useState<string>(() => {
    const token = localStorage.getItem("userToken");
    return token ? decodeTokenUserId(token) : "";
  });

  function setUserToken(token: string | null) {
    setUserTokenState(token);
    if (token) {
      setUserId(decodeTokenUserId(token));
    } else {
      setUserId("");
    }
  }

  return (
    <AuthContext.Provider value={{ userToken, setUserToken, userId, setUserId }}>
      {children}
    </AuthContext.Provider>
  );
}
