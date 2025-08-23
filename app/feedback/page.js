// Feedback form page for credit reset
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import connectMongo from "@/lib/mongoose";
import User from "@/models/User";
import Navbar from "@/components/layout/Navbar";
import FeedbackForm from "@/components/feedback/FeedbackForm";
import { SmallScreenMessage } from "@/components/ui";

export default async function FeedbackPage() {
  const session = await auth();

  // If not logged in, redirect to auth
  if (!session?.user) {
    redirect("/auth");
  }

  // Connect to database and fetch user data
  await connectMongo();
  const user = await User.findById(session.user.id).lean();

  if (!user) {
    redirect("/dashboard");
  }

  // If user already has 20 credits, redirect to dashboard
  if (user.credits >= 20) {
    redirect("/dashboard?message=already_max_credits");
  }

  // Serialize user data for client component
  const serializedUser = {
    id: user._id.toString(),
    credits: user.credits,
    email: user.email,
    githubUsername: user.githubUsername,
    isProUser: user.isProUser || false,
  };

  return (
    <main className="min-h-screen bg-base-100 p-6">
      <SmallScreenMessage />
      <Navbar session={session} />
      
      <section className="border border-neutral rounded-sm p-6 max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="font-raleway font-black tracking-tighter text-4xl mb-2">
            get more free credits
          </h1>
          <p className="font-lora tracking-tighter opacity-80 text-neutral mb-4">
            help us improve shipnotes by sharing your feedback. in return, we&apos;ll reset your credits to 20!
          </p>
          
          {/* Current Credits Display */}
          <div className="alert alert-info mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div>
              <h3 className="font-raleway font-bold tracking-tighter">current credits: {serializedUser.credits}</h3>
              <div className="font-lora tracking-tighter text-sm opacity-80">
                after submitting feedback, you&apos;ll have 20 credits
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="border border-neutral rounded-sm p-4 mb-6 bg-base-200">
          <h2 className="font-raleway font-bold text-xl tracking-tighter mb-3">
            quick questions
          </h2>
          <div className="space-y-2">
            <p className="font-lora tracking-tighter text-sm opacity-80">
              • each answer must be at least 15 characters
            </p>
            <p className="font-lora tracking-tighter text-sm opacity-80">
              • be honest and specific - this helps us build better features
            </p>
            <p className="font-lora tracking-tighter text-sm opacity-80">
              • your feedback is valuable for improving shipnotes
            </p>
          </div>
        </div>

        {/* Feedback Form Component */}
        <FeedbackForm user={serializedUser} />
      </section>
    </main>
  );
}