// AuthProvider.tsx
"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getCookie } from "cookies-next";

const publicPaths = ["/login", "/register", "/forgot-password"]; // Add any public routes here

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const token = getCookie("token");
    const isPublicPath = publicPaths.includes(pathname);

    if (!token && !isPublicPath) {
      router.push("/login");
    } else if (token && isPublicPath) {
      router.push("/"); // Redirect to home if trying to access login page with token
    }
  }, [pathname, router]);

  return <>{children}</>;
};

export default AuthProvider;