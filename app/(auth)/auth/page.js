import { auth, signIn } from "@/auth";
import { redirect } from "next/navigation";

export default async function Auth() {
  const session = await auth();

  // If already logged in, redirect to dashboard
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-base-100">
      <section className="border border-neutral rounded-sm p-8 max-w-md w-full mx-4">
        <div className="text-center space-y-6">
          {/* Logo/Title */}
          <h1 className="font-raleway font-black tracking-tighter text-4xl">
            patchnote.dev
          </h1>
          
          {/* Description */}
          <p className="font-lora tracking-tighter opacity-80 text-neutral">
            transform your github commits into beautiful, customer-friendly release notes in less than 30 seconds
          </p>

          {/* GitHub Sign In Button */}
          <form
            action={async () => {
              "use server";
              await signIn("github", { redirectTo: "/dashboard" });
            }}
          >
            <button
              type="submit"
              className="btn btn-primary w-full font-raleway font-bold text-xl tracking-tighter"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                  clipRule="evenodd"
                />
              </svg>
              sign in with github
            </button>
          </form>

          {/* Features */}
          <div className="space-y-3 pt-4">
            <div className="font-space tracking-tighter text-sm opacity-60 text-neutral">
              ✓ connect your github repositories
            </div>
            <div className="font-space tracking-tighter text-sm opacity-60 text-neutral">
              ✓ ai-powered release note generation
            </div>
            <div className="font-space tracking-tighter text-sm opacity-60 text-neutral">
              ✓ 20 free credits to get started
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
