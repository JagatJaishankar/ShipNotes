import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();

  // If logged in, go to dashboard; otherwise go to auth
  if (session?.user) {
    redirect("/dashboard");
  } else {
    redirect("/auth");
  }
}
