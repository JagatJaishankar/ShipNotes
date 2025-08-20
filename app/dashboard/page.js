import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await auth();

  // If not logged in, redirect to auth
  if (!session?.user) {
    redirect("/auth");
  }

  return (
    <main className="min-h-screen bg-base-100 p-6">
      <section className="border border-neutral rounded-sm p-6 max-w-4xl mx-auto">
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

        {/* User Info Debug */}
        <div className="border border-neutral rounded-sm p-4 mb-6">
          <h2 className="font-raleway font-bold text-xl tracking-tighter mb-3">
            user info
          </h2>
          <div className="space-y-2 font-space tracking-tighter text-sm opacity-80 text-neutral">
            <div>name: {session.user.name}</div>
            <div>email: {session.user.email}</div>
            <div>image: {session.user.image}</div>
          </div>
        </div>

        {/* Projects Section */}
        <div className="border border-neutral rounded-sm p-4">
          <h2 className="font-raleway font-bold text-xl tracking-tighter mb-3">
            your projects
          </h2>
          <p className="font-lora tracking-tighter opacity-80 text-neutral">
            no projects yet. create your first project to get started.
          </p>
          <button className="btn btn-primary mt-4 font-raleway font-bold tracking-tighter">
            create project
          </button>
        </div>
      </section>
    </main>
  );
}