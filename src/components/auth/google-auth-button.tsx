"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/providers/auth-provider";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          renderButton: (
            element: HTMLElement,
            options: {
              theme?: "outline" | "filled_blue" | "filled_black";
              size?: "large" | "medium" | "small";
              text?: "signin_with" | "signup_with" | "continue_with" | "signin";
              shape?: "rectangular" | "pill" | "circle" | "square";
              width?: number;
            }
          ) => void;
          prompt: () => void;
        };
      };
    };
  }
}

function decodeJWT(token: string) {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return null;
  }
}

export function GoogleAuthButton() {
  const { login } = useAuthContext();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId || !buttonRef.current || initializedRef.current) return;

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (!window.google || !buttonRef.current) return;
      initializedRef.current = true;
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response) => {
          setLoading(true);
          try {
            const payload = decodeJWT(response.credential);
            if (!payload) throw new Error("Failed to decode Google token");
            const data: any = await api("/auth/google", {
              method: "POST",
              body: JSON.stringify({
                name: payload.name,
                email: payload.email,
                googleId: payload.sub,
                avatar: payload.picture,
              }),
            });
            login(data.token, data.user);
            toast.success("Logged in with Google");
            router.push("/");
          } catch (err: any) {
            toast.error(err.message || "Google login failed");
          } finally {
            setLoading(false);
          }
        },
      });
      window.google.accounts.id.renderButton(buttonRef.current!, {
        theme: "outline",
        size: "large",
        text: "signin_with",
        shape: "rectangular",
        width: 320,
      });
    };
    document.head.appendChild(script);

    return () => {
      initializedRef.current = false;
    };
  }, [login, router]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div ref={buttonRef} className="min-h-[40px]" />
      {loading && (
        <Button disabled variant="outline" className="w-full">
          Signing in...
        </Button>
      )}
    </div>
  );
}
