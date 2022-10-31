import { setCookie } from "cookies-next";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  linkWithPopup,
  onAuthStateChanged,
  onIdTokenChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  unlink,
  User,
  UserCredential,
} from "firebase/auth";
import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { auth } from "../config/firebase.config";
import UserDataService from "../service/UserDataService";

interface IAuth {
  user: User | null;
  isLoading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  linkGoogle: () => Promise<void>;
  unlinkGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  error: boolean;
}

const AuthContext = createContext<IAuth>({
  user: null,
  isLoading: false,
  signUp: async () => {},
  signIn: async () => {},
  loginWithGoogle: async () => {},
  linkGoogle: async () => {},
  unlinkGoogle: async () => {},
  logout: async () => {},
  error: false,
});

interface AuthProviderProps {
  children: React.ReactNode;
}

const noAuthRequired = ["/auth/login", "/auth/signup"];

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<boolean>(false);
  const router = useRouter();
  const googleProvider = new GoogleAuthProvider();
  googleProvider.addScope(
    "https://www.googleapis.com/auth/fitness.activity.read"
  );
  googleProvider.addScope(
    "https://www.googleapis.com/auth/fitness.location.read"
  );
  googleProvider.addScope("https://www.googleapis.com/auth/fitness.body.read");

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        setCookie("authToken", await user.getIdToken(true));
        setIsLoading(false);
      } else {
        setUser(null);
        setCookie("authToken", null);
        setCookie("googleAccessToken", null);
        setIsLoading(true);
        if (!noAuthRequired.includes(router.pathname))
          router.push("/auth/login");
      }
    });
  }, [auth]);

  useEffect(() => {
    onIdTokenChanged(auth, async (user) => {
      if (user) setCookie("authToken", await user.getIdToken(true));
    });
  }, []);

  const signUp = async (email: string, password: string) => {
    setIsLoading(true);

    await createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential: UserCredential) => {
        setUser(userCredential.user);
        setCookie("authToken", await userCredential.user.getIdToken(true));
        router.push("/");
        setIsLoading(false);
      })
      .catch((error) => {
        setError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);

    await signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential: UserCredential) => {
        setUser(userCredential.user);
        setCookie("authToken", await userCredential.user.getIdToken(true));

        if (
          userCredential.user.providerData.find((providerData) => {
            return providerData.providerId == "google.com";
          })
        ) {
          const credential =
            GoogleAuthProvider.credentialFromResult(userCredential);
          setCookie("googleAccessToken", credential?.accessToken);
        }

        await UserDataService.create({
          uid: userCredential.user.uid,
          name: `用戶 ${Math.floor(Math.random() * (9999 - 1000) + 1000)}`,
          email: email,
        });
        router.push("/");
        setIsLoading(false);
      })
      .catch((error) => {
        setError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);

    await signInWithPopup(auth, googleProvider)
      .then(async (userCredential: UserCredential) => {
        setUser(userCredential.user);
        setCookie("authToken", await userCredential.user.getIdToken(true));

        const credential =
          GoogleAuthProvider.credentialFromResult(userCredential);
        setCookie("googleAccessToken", credential?.accessToken);

        await UserDataService.create({
          uid: userCredential.user.uid,
          name: userCredential.user.displayName!,
          email: userCredential.user.email!,
        });
        router.push("/");
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const linkGoogle = async () => {
    setIsLoading(true);

    return await linkWithPopup(user!, googleProvider)
      .then(async (userCredential: UserCredential) => {
        const credential =
          GoogleAuthProvider.credentialFromResult(userCredential);
        setUser(userCredential.user);
        setCookie("authToken", await userCredential.user.getIdToken(true));
        setCookie("googleAccessToken", credential?.accessToken);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const unlinkGoogle = async () => {
    setIsLoading(true);

    return await unlink(user!, "google.com")
      .then((user: User) => {
        setUser(user);
        setCookie("googleAccessToken", null);
      })
      .catch((error) => {
        console.log(error);
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
        setCookie("authToken", null);
        setCookie("googleAccessToken", null);
      })
      .finally(() => {
        setError(false);
        setIsLoading(false);
      });
  };

  const memoedValue = useMemo(
    () => ({
      user,
      signUp,
      signIn,
      loginWithGoogle,
      linkGoogle,
      unlinkGoogle,
      logout,
      isLoading,
      error,
    }),
    [user]
  );

  return (
    <AuthContext.Provider value={memoedValue}>{children}</AuthContext.Provider>
  );
};

export default function useAuth() {
  return useContext(AuthContext);
}
