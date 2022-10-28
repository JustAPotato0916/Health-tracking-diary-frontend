import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  User,
} from "firebase/auth";
import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { auth } from "../config/firebase.config";

interface IAuth {
  user: User | null;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  errorMessage: string | null;
}

const AuthContext = createContext<IAuth>({
  user: null,
  signUp: async () => {},
  signIn: async () => {},
  loginWithGoogle: async () => {},
  logout: async () => {},
  errorMessage: null,
});

interface AuthProviderProps {
  children: React.ReactNode;
}

const noAuthRequired = ["/auth/login", "/auth/signup"];

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        setIsLoading(false);
      } else {
        setUser(null);
        setIsLoading(true);
        if (!noAuthRequired.includes(router.pathname))
          router.push("/auth/login");
      }
    });
  }, [auth]);

  const signUp = async (email: string, password: string) => {
    setIsLoading(true);

    await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setUser(userCredential.user);
        router.push("/");
        setIsLoading(false);
      })
      .catch((error) => {
        setErrorMessage("註冊失敗，請確認此信箱尚未使用過!");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);

    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setUser(userCredential.user);
        router.push("/");
        setIsLoading(false);
      })
      .catch((error) => {
        setErrorMessage("登入失敗！請確認帳號密碼是否輸入正確！");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    provider.addScope("https://www.googleapis.com/auth/fitness.activity.read");
    provider.addScope("https://www.googleapis.com/auth/fitness.location.read");
    provider.addScope("https://www.googleapis.com/auth/fitness.body.read");

    await signInWithPopup(auth, provider)
      .then((userCredential) => {
        setUser(userCredential.user);
        router.push("/");
        setIsLoading(false);
      })
      .catch((error) => {
        setErrorMessage("發生未知的錯誤，請選擇一個可用的帳號進行登入！");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const logout = async () => {
    setIsLoading(true);

    await signOut(auth)
      .then(() => {
        setUser(null);
      })
      .finally(() => {
        setErrorMessage(null);
        setIsLoading(false);
      });
  };

  const memoedValue = useMemo(
    () => ({ user, signUp, signIn, loginWithGoogle, logout, errorMessage }),
    [user]
  );

  return (
    <AuthContext.Provider value={memoedValue}>{children}</AuthContext.Provider>
  );
};

export default function useAuth() {
  return useContext(AuthContext);
}
