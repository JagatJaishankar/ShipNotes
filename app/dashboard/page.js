import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import DashboardClient from "@/components/dashboard/DashboardClient";
import DashboardCredits from "@/components/dashboard/DashboardCredits";
import Navbar from "@/components/layout/Navbar";
import { SmallScreenMessage } from "@/components/ui";

export default async function Dashboard() {
  const session = await auth();

  // If not logged in, redirect to auth
  if (!session?.user) {
    redirect("/auth");
  }

  return (
    <main className="min-h-screen bg-base-100 px-6 py-2">
      <SmallScreenMessage />
      <Navbar session={session} />

      <section className="rounded-sm mt-4 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="font-lora tracking-tighter opacity-80 text-neutral">
              welcome back, {session.user.name}
            </p>
          </div>
        </div>

        {/* Credits and Stats Display */}
        <div className="flex flex-row space-x-4 w-full mb-6">
          {/* item one: generation credits */}
          <div className="flex-[2] border-1 border-neutral bg-base-100 rounded-sm p-2 h-fill">
            <DashboardCredits session={session} />
          </div>
          {/* item two: account status*/}
          <div className="flex-[1] border-1 border-neutral bg-base-100 rounded-sm p-2 space-y-1">
            <div className="font-raleway font-extrabold tracking-tighter lowercase">
              account statistics
            </div>
            <div className="flex flex-row justify-between">
              <div className="font-space tracking-normal opacity-80 text-sm lowercase">
                plan:
              </div>
              <div className="badge badge-neutral font-space tracking-normal text-sm border-1 border-neutral lowercase">
                free
              </div>
            </div>
            <div className="flex flex-row justify-between">
              <div className="font-space tracking-normal opacity-80 text-sm lowercase">
                projects:
              </div>
              <div className="badge badge-neutral font-space tracking-normal text-sm border-1 border-neutral lowercase">
                unlimited
              </div>
            </div>
            <div className="flex flex-row justify-between">
              <div className="font-space tracking-normal opacity-80 text-sm lowercase">
                member since:
              </div>
              <div className="badge badge-neutral font-space tracking-normal text-sm border-1 border-neutral lowercase">
                {new Date(session.user.createdAt || Date.now()).getFullYear()}
              </div>
            </div>
          </div>
        </div>

        {/* Projects Section - Client Component */}
        <DashboardClient session={session} />
      </section>
    </main>
  );
}
