"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const [demoStep, setDemoStep] = useState("commits");

  const commits = [
    { message: "fix: bug in user authentication flow", author: "you", time: "2h ago" },
    { message: "feat: add dark mode toggle to settings", author: "you", time: "1d ago" },
    { message: "refactor: clean up dashboard components", author: "you", time: "2d ago" },
    { message: "docs: update README with new features", author: "you", time: "3d ago" },
  ];

  const releaseNote = {
    title: "weekly improvements & fixes",
    content: `hey there! 👋

this week we shipped some solid improvements to make your experience smoother:

**🔧 what's fixed**
• authentication flow is now rock solid (no more random logouts)
• dark mode toggle works everywhere (your eyes will thank you)

**✨ what's new** 
• cleaner dashboard that actually makes sense
• updated docs so you don't have to guess

small stuff, but it adds up. keep the feedback coming!`
  };

  return (
    <main className="text-neutral lowercase min-h-screen">
      {/* section: header */}
      <section className="max-w-4xl px-6 pt-2 mx-auto">
        <div className="navbar bg-base-200 rounded-sm border-neutral border">
          <div className="navbar-start">
            <div className="dropdown">
              <div tabIndex={0} role="button" className="btn btn-ghost sm:hidden">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                </svg>
              </div>
              <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow font-lora opacity-80">
                <li><a href="#demo">see it work</a></li>
                <li><a href="#pricing">pricing</a></li>
                <li><Link href={"/auth"}>get started</Link></li>
              </ul>
            </div>
            <a className="btn btn-ghost text-xl font-raleway font-extrabold tracking-tighter">
              shipnotes.dev
            </a>
          </div>
          <div className="navbar-center hidden sm:flex">
            <ul className="menu menu-horizontal px-1 font-lora opacity-80">
              <li><a href="#demo">see it work</a></li>
              <li><a href="#pricing">pricing</a></li>
            </ul>
          </div>
          <div className="navbar-end max-sm:hidden">
            <Link className="btn btn-ghost text-xl font-raleway font-extrabold tracking-tighter" href={"/auth"}>
              get started.
            </Link>
          </div>
        </div>
      </section>

      {/* section: hero */}
      <section className="max-w-4xl mx-auto px-6 py-32 text-center">
        <div className="font-space tracking-tight opacity-60 mb-2">
          i built this because...
        </div>
        <h1 className="font-raleway font-black text-4xl tracking-tighter leading-none mb-2">
          writing release notes
          <br className="sm:hidden" /> is a pain.
          <br />
          but customers need them.
        </h1>
        <div className="font-lora text-lg opacity-80 mb-8">
          just connect your github. <br className="sm:hidden" />
          we'll turn your commits into customer-friendly updates.
        </div>
        <a href="#pricing">
          <button className="btn btn-neutral font-raleway font-extrabold text-lg">
            i hate writing release notes.
          </button>
        </a>
      </section>

      {/* section: why this exists */}
      <section className="bg-base-200">
        <div className="max-w-4xl mx-auto py-32 px-6">
          <div className="flex sm:flex-row max-sm:flex-col sm:space-x-8 sm:items-center sm:justify-center max-sm:space-y-6">
            <div className="h-full flex-1">
              <div className="bg-base-100 border border-neutral rounded-sm p-4">
                <div className="font-space text-xs opacity-60 mb-2">before shipnotes</div>
                <div className="font-lora text-sm opacity-80 mb-4">
                  "we shipped some fixes and features this week. check the commit history if you care lol"
                </div>
                <div className="font-space text-xs opacity-60">
                  — every indie dev ever
                </div>
              </div>
            </div>
            <div className="h-full max-sm:text-center flex-1">
              <div className="font-space tracking-tight opacity-60 mb-2">
                why this exists?
              </div>
              <h1 className="font-raleway font-black text-3xl tracking-tighter leading-none mb-2">
                your customers deserve better than commit messages.
              </h1>
              <div className="font-lora mb-8 opacity-80">
                you're already documenting your work in commits. why not turn that into something your users actually want to read?
              </div>
              <a href="#pricing">
                <button className="btn btn-neutral font-raleway font-extrabold text-lg">
                  make sense.
                </button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* section: demo */}
      <section className="max-w-4xl mx-auto px-6 py-32" id="demo">
        <div className="text-center mb-12">
          <div className="font-space tracking-tight opacity-60 mb-2">
            see the magic...
          </div>
          <h1 className="font-raleway font-black text-3xl tracking-tighter leading-none mb-2">
            from messy commits to clean updates.
          </h1>
          <div className="font-lora opacity-80 mb-8">
            here's exactly how your github commits become customer-friendly release notes.
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-8 items-start">
          {/* commits side */}
          <div className="space-y-4">
            <div className="text-center sm:text-left">
              <h3 className="font-raleway font-bold text-xl tracking-tighter mb-2">
                1. your commits (the raw stuff)
              </h3>
              <p className="font-lora text-sm opacity-60 mb-4">
                the usual developer gibberish that only we understand
              </p>
            </div>
            <div className="bg-base-100 border border-neutral rounded-sm">
              {commits.map((commit, index) => (
                <div key={index} className="p-4 border-b border-neutral/20 last:border-b-0">
                  <div className="font-space text-sm opacity-80 mb-1">
                    {commit.message}
                  </div>
                  <div className="font-space text-xs opacity-40">
                    {commit.author} • {commit.time}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* release note side */}
          <div className="space-y-4">
            <div className="text-center sm:text-left">
              <h3 className="font-raleway font-bold text-xl tracking-tighter mb-2">
                2. becomes this (the good stuff)
              </h3>
              <p className="font-lora text-sm opacity-60 mb-4">
                actually readable updates your customers will appreciate
              </p>
            </div>
            <div className="bg-base-100 border border-neutral rounded-sm p-6">
              <h4 className="font-raleway font-bold text-lg tracking-tighter mb-4">
                {releaseNote.title}
              </h4>
              <div className="font-lora text-sm opacity-80 whitespace-pre-line">
                {releaseNote.content}
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <div className="font-space text-xs opacity-60">
            ✨ ai does the translation. you just pick the commits.
          </div>
        </div>
      </section>

      {/* section: how it works */}
      <section className="bg-base-200">
        <div className="max-w-4xl px-6 py-32 mx-auto text-center">
          <div className="font-space tracking-tight opacity-60 mb-2">
            simple process...
          </div>
          <h1 className="font-raleway font-black text-3xl tracking-tighter leading-none mb-2">
            literally 3 steps.
          </h1>
          <div className="font-lora mb-12 opacity-80">
            no overthinking. no fancy setup. just results.
          </div>
          
          <div className="grid sm:grid-cols-3 gap-8 mb-8">
            <div className="space-y-4">
              <div className="text-6xl">🔗</div>
              <div className="font-raleway font-bold text-lg tracking-tighter">
                connect github
              </div>
              <div className="font-lora text-sm opacity-60">
                oauth takes like 10 seconds. pick your repo.
              </div>
            </div>
            <div className="space-y-4">
              <div className="text-6xl">✅</div>
              <div className="font-raleway font-bold text-lg tracking-tighter">
                select commits
              </div>
              <div className="font-lora text-sm opacity-60">
                check the boxes. we grab the last 30 days by default.
              </div>
            </div>
            <div className="space-y-4">
              <div className="text-6xl">🚀</div>
              <div className="font-raleway font-bold text-lg tracking-tighter">
                publish & share
              </div>
              <div className="font-lora text-sm opacity-60">
                ai writes it. you edit if needed. customers get real updates.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* section: pricing */}
      <section className="max-w-4xl mx-auto text-center px-6 py-32" id="pricing">
        <div className="font-space tracking-tight opacity-60 mb-2">
          wanna try?
        </div>
        <h1 className="font-raleway font-black text-3xl tracking-tighter leading-none mb-2">
          start for free. obviously.
        </h1>
        <div className="font-lora mb-8 opacity-80">
          because asking for money before you see value is stupid.
        </div>

        <div className="bg-base-200 border border-neutral rounded-sm p-8 max-w-md mx-auto">
          <div className="font-raleway font-black text-2xl tracking-tighter mb-2">
            free to start
          </div>
          <div className="font-lora text-sm opacity-60 mb-6">
            get 20 release note generations. see if you like it.
          </div>
          <div className="space-y-3 mb-6 text-left">
            <div className="flex items-center space-x-2">
              <span className="text-green-500">✓</span>
              <span className="font-lora text-sm">connect any github repo</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-500">✓</span>
              <span className="font-lora text-sm">ai-generated release notes</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-500">✓</span>
              <span className="font-lora text-sm">hosted changelog page</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-500">✓</span>
              <span className="font-lora text-sm">website widget</span>
            </div>
          </div>
          <Link href={"/auth"} className="btn btn-neutral w-full font-raleway font-extrabold">
            let's go.
          </Link>
          <div className="font-space text-xs opacity-40 mt-3">
            no credit card. no bullshit.
          </div>
        </div>
      </section>

      {/* section: faq */}
      <section className="bg-base-200">
        <div className="max-w-3xl mx-auto text-center px-6 py-32">
          <div className="font-space tracking-tight opacity-60 mb-2">
            probably wondering...
          </div>
          <h1 className="font-raleway font-black text-3xl tracking-tighter leading-none mb-2">
            let me guess your questions.
          </h1>
          <div className="font-lora mb-8 opacity-80">
            still confused? dm me @jaishankarjagat on twitter
          </div>
          
          <div className="join join-vertical bg-base-100 text-left">
            {[
              {
                question: "do you store my code?",
                answer: "nope. we just read commit messages and metadata through github's api. your actual code never leaves github."
              },
              {
                question: "what if the ai writes something dumb?",
                answer: "you can edit everything before publishing. it's more like a smart first draft than a final product."
              },
              {
                question: "how is this different from just writing release notes?",
                answer: "it's not different. it's just faster. we turn your existing commits into readable updates in 30 seconds instead of 30 minutes."
              },
              {
                question: "what happens after 20 free generations?",
                answer: "honest answer? i'll probably just give you more credits if you ask nicely. still figuring out pricing that doesn't suck."
              },
              {
                question: "can i customize the writing style?",
                answer: "not yet, but it's on the list. for now it writes in a friendly, straightforward tone that most customers appreciate."
              },
              {
                question: "works with private repos?",
                answer: "yep. github oauth handles both public and private repos. we only ask for read access to commits."
              },
            ].map((faq, index) => (
              <div key={index} className="collapse collapse-arrow join-item border-neutral border">
                <input type="radio" name="faq-accordion" />
                <div className="collapse-title font-bold font-raleway tracking-tighter">
                  {faq.question}
                </div>
                <div className="collapse-content text-sm opacity-80 font-lora">
                  {faq.answer}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* section: footer */}
      <section className="bg-neutral text-neutral-content">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="grid sm:grid-cols-4 max-sm:grid-rows-4 gap-8">
            <div className="space-y-4">
              <div className="font-raleway font-extrabold text-xl tracking-tighter">
                shipnotes.dev
              </div>
              <div className="font-lora text-sm opacity-60 max-w-sm">
                turn your github commits into customer-friendly release notes.
                <br />
                copyright &copy; {new Date().getFullYear()}
              </div>
            </div>
            <div className="space-y-4">
              <div className="font-raleway font-bold tracking-tighter">
                product
              </div>
              <div className="space-y-2 text-sm font-lora">
                <div><Link href="/auth" className="hover:opacity-80">get started</Link></div>
                <div><a href="#demo" className="hover:opacity-80">see demo</a></div>
                <div><a href="#pricing" className="hover:opacity-80">pricing</a></div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="font-raleway font-bold tracking-tighter">
                the builder
              </div>
              <div className="space-y-2 text-sm font-lora">
                <div><a href="https://twitter.com/jaishankarjagat" target="_blank" rel="noopener noreferrer" className="hover:opacity-80">twitter</a></div>
                <div><a href="https://github.com/jaishankarjagat" target="_blank" rel="noopener noreferrer" className="hover:opacity-80">github</a></div>
                <div><a href="https://twite.dev" target="_blank" rel="noopener noreferrer" className="hover:opacity-80">twite.dev</a></div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="font-raleway font-bold tracking-tighter">
                legal
              </div>
              <div className="space-y-2 text-sm font-lora">
                <div><a className="hover:opacity-80">terms of use</a></div>
                <div><a className="hover:opacity-80">privacy policy</a></div>
                <div><a className="hover:opacity-80">refund policy</a></div>
              </div>
            </div>
          </div>
          <div className="border-t border-neutral-content/20 mt-8 pt-8 text-center">
            <div className="font-space text-xs opacity-40">
              made with probably too much coffee by an indie dev who got tired of writing release notes
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
