import { redirect } from "next/navigation";

// /register only hosts the sign-up form on the shared /login page (which has
// Login/Register tabs). Forward the "register" intent via ?tab= so visitors
// land on the Register tab instead of defaulting to Login.
export default function RegisterPage() {
  redirect("/login?tab=register");
}
