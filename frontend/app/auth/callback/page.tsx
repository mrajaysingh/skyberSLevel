"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  useEffect(() => {
    const sessionToken = searchParams.get("sessionToken");
    const refreshToken = searchParams.get("refreshToken");
    const role = searchParams.get("role");

    if (!sessionToken) {
      router.replace("/login?error=missing_token");
      return;
    }

    const handleAuth = async () => {
      try {
        // Store tokens
        localStorage.setItem("sessionToken", sessionToken);
        if (refreshToken) {
          localStorage.setItem("refreshToken", refreshToken);
        }

        // Verify token and fetch user details
        const res = await fetch(`${apiUrl}/api/auth/verify`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${sessionToken}`,
          },
        });

        if (!res.ok) {
          throw new Error("Token verification failed");
        }

        const data = await res.json();

        // Persist minimal user data for the app
        if (data && data.success && data.data?.user) {
          localStorage.setItem("userData", JSON.stringify(data.data.user));
          localStorage.setItem("skyber_authenticated", "true");

          // Redirect based on role
          const redirectPath = sessionStorage.getItem("skyber_redirect_after_login");
          sessionStorage.removeItem("skyber_redirect_after_login");

          if (redirectPath) {
            router.replace(redirectPath);
          } else if (role === "super-admin" || data.data.user.role === "super-admin") {
            router.replace("/auth/dashboards/user/super-admin");
          } else {
            router.replace("/");
          }
        } else {
          router.replace("/login?error=invalid_session");
        }
      } catch (e) {
        console.error("OAuth callback error:", e);
        // Clean up on error
        localStorage.removeItem("sessionToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userData");
        localStorage.removeItem("skyber_authenticated");
        router.replace("/login?error=oauth_failed");
      }
    };

    handleAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return null;
}

export default function AuthCallback() {
  return (
    <Suspense fallback={null}>
      <AuthCallbackContent />
    </Suspense>
  );
}


