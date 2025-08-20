import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import DashboardClient from "@/components/dashboard/DashboardClient";

export default async function Dashboard() {
  const session = await auth();

  // If not logged in, redirect to auth
  if (!session?.user) {
    redirect("/auth");
  }

  return (
    <main className="min-h-screen bg-base-100 p-6">
      <section className="border border-neutral rounded-sm p-6 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="font-raleway font-black tracking-tighter text-4xl">
              dashboard
            </h1>
            <p className="font-lora tracking-tighter opacity-80 text-neutral">
              welcome back, {session.user.name}
            </p>
          </div>
          
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button className="btn btn-secondary font-raleway font-bold tracking-tighter">
              sign out
            </button>
          </form>
        </div>

        {/* Credits Display */}
        <div className="border border-neutral rounded-sm p-4 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-raleway font-bold text-xl tracking-tighter">
                credits
              </h2>
              <p className="font-lora tracking-tighter opacity-80 text-neutral">
                20 credits remaining
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-space tracking-tighter text-sm opacity-60">
                5 used for release note generation
              </span>
              <button className="btn btn-outline btn-sm font-raleway font-bold tracking-tighter">
                get more credits
              </button>
            </div>
          </div>
        </div>

        {/* Projects Section - Client Component */}
        <DashboardClient session={session} />
      </section>
    </main>
  );
}