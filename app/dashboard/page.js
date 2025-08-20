import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import DashboardClient from "@/components/dashboard/DashboardClient";
import DashboardCredits from "@/components/dashboard/DashboardCredits";
import Navbar from "@/components/layout/Navbar";

export default async function Dashboard() {
  const session = await auth();

  // If not logged in, redirect to auth
  if (!session?.user) {
    redirect("/auth");
  }

  return (
    <main className="min-h-screen bg-base-100 p-6">
      <Navbar session={session} />
      
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
        </div>

        {/* Credits and Stats Display */}
        <div className="flex flex-row space-x-4 w-full mb-6">
          {/* item one: generation credits */}
          <div className="flex-[2] border border-neutral bg-base-100 rounded-sm p-2">
            <div className="flex flex-col justify-between h-full">
              <div className="flex flex-row items-center space-x-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5ZM16.5 15a.75.75 0 0 1 .712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 0 1 0 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 0 1-1.422 0l-.395-1.183a1.5 1.5 0 0 0-.948-.948l-1.183-.395a.75.75 0 0 1 0-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0 1 16.5 15Z"
                    clipRule="evenodd"
                  />
                </svg>
                <DashboardCredits session={session} />
              </div>
            </div>
          </div>
          {/* item two: account status*/}
          <div className="flex-[1] border border-neutral bg-base-100 rounded-sm p-2 space-y-1">
            <div className="font-raleway font-bold tracking-tighter">
              account statistics
            </div>
            <div className="flex flex-row justify-between">
              <div className="font-space tracking-tighter opacity-80 text-sm">
                plan:
              </div>
              <div className="badge badge-neutral font-lora tracking-tighter text-sm">
                free
              </div>
            </div>
            <div className="flex flex-row justify-between">
              <div className="font-space tracking-tighter opacity-80 text-sm">
                projects:
              </div>
              <div className="badge badge-neutral font-lora tracking-tighter text-sm">
                unlimited
              </div>
            </div>
            <div className="flex flex-row justify-between">
              <div className="font-space tracking-tighter opacity-80 text-sm">
                member since:
              </div>
              <div className="badge badge-neutral font-lora tracking-tighter text-sm">
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