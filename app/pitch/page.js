"use client";
// Pitch deck page for shipnotes.dev - professional presentation following design system
import React, { useState, useEffect, useCallback } from "react";
import { SmallScreenMessage } from "@/components/ui";

const PitchDeck = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPresenting, setIsPresenting] = useState(false);

  const totalSlides = 10;

  // Navigation functions
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const goToSlide = useCallback((index) => {
    setCurrentSlide(index);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "ArrowRight" || e.key === " ") nextSlide();
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "Escape") setIsPresenting(false);
      if (e.key === "Enter" || e.key === "f") setIsPresenting(true);
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [nextSlide, prevSlide]);

  // Slide components
  const slides = [
    // Slide 1: Title
    () => (
      <div className="flex flex-col items-center justify-center text-center space-y-8">
        <div className="space-y-6">
          <h1 className="font-raleway font-extrabold tracking-tighter text-6xl md:text-8xl lowercase text-primary">
            shipnotes.dev
          </h1>
          <p className="font-lora tracking-wide text-2xl md:text-3xl opacity-80 text-neutral lowercase max-w-4xl">
            turn github commits into customer communications in &lt;30 seconds
          </p>
        </div>
        <div className="border-1 border-neutral rounded-sm bg-base-200 p-6 max-w-2xl">
          <p className="font-raleway font-extrabold tracking-tighter text-xl lowercase">
            automated release notes for indie saas developers
          </p>
        </div>
      </div>
    ),

    // Slide 2: Problem
    () => (
      <div className="space-y-12">
        <div className="text-center">
          <h2 className="font-raleway font-extrabold tracking-tighter text-4xl lowercase mb-4">
            the problem
          </h2>
          <p className="font-lora tracking-wide text-xl opacity-80 text-neutral lowercase max-w-3xl mx-auto">
            saas companies lose customers due to poor communication about product updates
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="border-1 border-error rounded-sm p-8 text-center">
            <div className="font-raleway font-extrabold tracking-tighter text-5xl lowercase mb-4 text-error">
              73%
            </div>
            <p className="font-space tracking-normal text-sm opacity-60 text-neutral lowercase">
              of developers skip writing release notes
            </p>
          </div>
          
          <div className="border-1 border-warning rounded-sm p-8 text-center">
            <div className="font-raleway font-extrabold tracking-tighter text-5xl lowercase mb-4 text-warning">
              4-8
            </div>
            <p className="font-space tracking-normal text-sm opacity-60 text-neutral lowercase">
              hours per month writing updates manually
            </p>
          </div>
          
          <div className="border-1 border-error rounded-sm p-8 text-center">
            <div className="font-raleway font-extrabold tracking-tighter text-5xl lowercase mb-4 text-error">
              40%
            </div>
            <p className="font-space tracking-normal text-sm opacity-60 text-neutral lowercase">
              higher churn when customers are uninformed
            </p>
          </div>
        </div>
      </div>
    ),

    // Slide 3: Solution
    () => (
      <div className="space-y-12">
        <div className="text-center">
          <h2 className="font-raleway font-extrabold tracking-tighter text-4xl lowercase mb-4">
            our solution
          </h2>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <div className="border-1 border-neutral rounded-sm p-6 hover:bg-base-200 transition-colors">
            <div className="font-raleway font-extrabold tracking-tighter text-xl lowercase mb-3">
              🔄 auto-generate
            </div>
            <p className="font-lora tracking-wide opacity-80 text-neutral lowercase text-sm">
              ai transforms github commits into customer-friendly release notes
            </p>
          </div>
          
          <div className="border-1 border-neutral rounded-sm p-6 hover:bg-base-200 transition-colors">
            <div className="font-raleway font-extrabold tracking-tighter text-xl lowercase mb-3">
              ✏️ quick edit
            </div>
            <p className="font-lora tracking-wide opacity-80 text-neutral lowercase text-sm">
              simple editor to refine and personalize generated content
            </p>
          </div>
          
          <div className="border-1 border-neutral rounded-sm p-6 hover:bg-base-200 transition-colors">
            <div className="font-raleway font-extrabold tracking-tighter text-xl lowercase mb-3">
              🚀 one-click publish
            </div>
            <p className="font-lora tracking-wide opacity-80 text-neutral lowercase text-sm">
              instant publishing to hosted changelog pages
            </p>
          </div>
          
          <div className="border-1 border-neutral rounded-sm p-6 hover:bg-base-200 transition-colors">
            <div className="font-raleway font-extrabold tracking-tighter text-xl lowercase mb-3">
              🔧 widget integration
            </div>
            <p className="font-lora tracking-wide opacity-80 text-neutral lowercase text-sm">
              embeddable widget shows customers latest updates
            </p>
          </div>
        </div>
      </div>
    ),

    // Slide 4: Market
    () => (
      <div className="space-y-12">
        <div className="text-center">
          <h2 className="font-raleway font-extrabold tracking-tighter text-4xl lowercase mb-4">
            market opportunity
          </h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="border-1 border-primary rounded-sm p-8 text-center">
            <div className="font-raleway font-extrabold tracking-tighter text-5xl lowercase mb-4 text-primary">
              2.1m
            </div>
            <p className="font-space tracking-normal text-sm opacity-60 text-neutral lowercase">
              active github repositories
            </p>
          </div>
          
          <div className="border-1 border-success rounded-sm p-8 text-center">
            <div className="font-raleway font-extrabold tracking-tighter text-5xl lowercase mb-4 text-success">
              $50b
            </div>
            <p className="font-space tracking-normal text-sm opacity-60 text-neutral lowercase">
              saas market growing 18% annually
            </p>
          </div>
          
          <div className="border-1 border-info rounded-sm p-8 text-center">
            <div className="font-raleway font-extrabold tracking-tighter text-5xl lowercase mb-4 text-info">
              500k+
            </div>
            <p className="font-space tracking-normal text-sm opacity-60 text-neutral lowercase">
              indie developers &amp; small teams
            </p>
          </div>
        </div>

        <div className="border-1 border-neutral rounded-sm bg-base-200 p-6 max-w-4xl mx-auto text-center">
          <p className="font-raleway font-extrabold tracking-tighter text-lg lowercase">
            target: indie saas founders and small dev teams (1-50 employees) using github
          </p>
        </div>
      </div>
    ),

    // Slide 5: Business Model
    () => (
      <div className="space-y-12">
        <div className="text-center">
          <h2 className="font-raleway font-extrabold tracking-tighter text-4xl lowercase mb-4">
            business model
          </h2>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <div className="border-1 border-neutral rounded-sm p-6">
            <div className="font-raleway font-extrabold tracking-tighter text-lg lowercase mb-3">
              freemium start
            </div>
            <p className="font-lora tracking-wide opacity-80 text-neutral lowercase text-sm">
              20 free credits (5 release note generations) for new users
            </p>
          </div>
          
          <div className="border-1 border-neutral rounded-sm p-6">
            <div className="font-raleway font-extrabold tracking-tighter text-lg lowercase mb-3">
              feedback-driven growth
            </div>
            <p className="font-lora tracking-wide opacity-80 text-neutral lowercase text-sm">
              users get more credits by providing product feedback
            </p>
          </div>
          
          <div className="border-1 border-neutral rounded-sm p-6">
            <div className="font-raleway font-extrabold tracking-tighter text-lg lowercase mb-3">
              premium plans
            </div>
            <p className="font-lora tracking-wide opacity-80 text-neutral lowercase text-sm">
              unlimited generations, advanced features, custom branding
            </p>
          </div>
          
          <div className="border-1 border-neutral rounded-sm p-6">
            <div className="font-raleway font-extrabold tracking-tighter text-lg lowercase mb-3">
              enterprise
            </div>
            <p className="font-lora tracking-wide opacity-80 text-neutral lowercase text-sm">
              team collaboration, analytics, api access
            </p>
          </div>
        </div>
      </div>
    ),

    // Slide 6: Traction
    () => (
      <div className="space-y-12">
        <div className="text-center">
          <h2 className="font-raleway font-extrabold tracking-tighter text-4xl lowercase mb-4">
            development progress
          </h2>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          <div className="border-1 border-neutral rounded-sm p-6">
            <div className="font-raleway font-extrabold tracking-tighter text-lg lowercase mb-3 text-primary">
              current
            </div>
            <div className="space-y-2">
              <p className="font-space tracking-normal text-sm opacity-60 text-neutral lowercase">
                mvp in development
              </p>
              <p className="font-space tracking-normal text-sm opacity-60 text-neutral lowercase">
                technical architecture complete
              </p>
            </div>
          </div>
          
          <div className="border-1 border-neutral rounded-sm p-6">
            <div className="font-raleway font-extrabold tracking-tighter text-lg lowercase mb-3 text-success">
              q1 2025
            </div>
            <div className="space-y-2">
              <p className="font-space tracking-normal text-sm opacity-60 text-neutral lowercase">
                beta launch
              </p>
              <p className="font-space tracking-normal text-sm opacity-60 text-neutral lowercase">
                first paying customers
              </p>
            </div>
          </div>
          
          <div className="border-1 border-neutral rounded-sm p-6">
            <div className="font-raleway font-extrabold tracking-tighter text-lg lowercase mb-3 text-info">
              q2 2025
            </div>
            <div className="space-y-2">
              <p className="font-space tracking-normal text-sm opacity-60 text-neutral lowercase">
                product-market fit
              </p>
              <p className="font-space tracking-normal text-sm opacity-60 text-neutral lowercase">
                scaling customer base
              </p>
            </div>
          </div>
          
          <div className="border-1 border-neutral rounded-sm p-6">
            <div className="font-raleway font-extrabold tracking-tighter text-lg lowercase mb-3 text-warning">
              q3 2025
            </div>
            <div className="space-y-2">
              <p className="font-space tracking-normal text-sm opacity-60 text-neutral lowercase">
                advanced features
              </p>
              <p className="font-space tracking-normal text-sm opacity-60 text-neutral lowercase">
                team collaboration tools
              </p>
            </div>
          </div>
        </div>
      </div>
    ),

    // Slide 7: Tech Stack
    () => (
      <div className="space-y-12">
        <div className="text-center">
          <h2 className="font-raleway font-extrabold tracking-tighter text-4xl lowercase mb-4">
            technology
          </h2>
          <p className="font-lora tracking-wide text-xl opacity-80 text-neutral lowercase max-w-2xl mx-auto">
            modern, scalable stack built for performance
          </p>
        </div>
        
        <div className="border-1 border-neutral rounded-sm bg-base-200 p-8 max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-space tracking-normal text-sm opacity-80 text-neutral lowercase">
                  frontend:
                </span>
                <span className="font-space tracking-normal text-sm opacity-60 text-neutral">
                  Next.js 15.4 with React
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-space tracking-normal text-sm opacity-80 text-neutral lowercase">
                  backend:
                </span>
                <span className="font-space tracking-normal text-sm opacity-60 text-neutral">
                  Node.js API routes
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-space tracking-normal text-sm opacity-80 text-neutral lowercase">
                  database:
                </span>
                <span className="font-space tracking-normal text-sm opacity-60 text-neutral">
                  MongoDB Atlas
                </span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-space tracking-normal text-sm opacity-80 text-neutral lowercase">
                  ai:
                </span>
                <span className="font-space tracking-normal text-sm opacity-60 text-neutral">
                  OpenAI GPT-4o
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-space tracking-normal text-sm opacity-80 text-neutral lowercase">
                  auth:
                </span>
                <span className="font-space tracking-normal text-sm opacity-60 text-neutral">
                  GitHub OAuth
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-space tracking-normal text-sm opacity-80 text-neutral lowercase">
                  hosting:
                </span>
                <span className="font-space tracking-normal text-sm opacity-60 text-neutral">
                  Vercel
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),

    // Slide 8: Competitive Advantage
    () => (
      <div className="space-y-12">
        <div className="text-center">
          <h2 className="font-raleway font-extrabold tracking-tighter text-4xl lowercase mb-4">
            why we'll win
          </h2>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <div className="border-1 border-primary rounded-sm p-6 hover:bg-base-200 transition-colors">
            <div className="font-raleway font-extrabold tracking-tighter text-lg lowercase mb-3 text-primary">
              zero workflow change
            </div>
            <p className="font-lora tracking-wide opacity-80 text-neutral lowercase text-sm">
              uses existing github commits - no new processes to learn
            </p>
          </div>
          
          <div className="border-1 border-success rounded-sm p-6 hover:bg-base-200 transition-colors">
            <div className="font-raleway font-extrabold tracking-tighter text-lg lowercase mb-3 text-success">
              customer-focused
            </div>
            <p className="font-lora tracking-wide opacity-80 text-neutral lowercase text-sm">
              ai trained specifically for customer communication, not technical docs
            </p>
          </div>
          
          <div className="border-1 border-info rounded-sm p-6 hover:bg-base-200 transition-colors">
            <div className="font-raleway font-extrabold tracking-tighter text-lg lowercase mb-3 text-info">
              complete solution
            </div>
            <p className="font-lora tracking-wide opacity-80 text-neutral lowercase text-sm">
              generation + hosting + distribution in one platform
            </p>
          </div>
          
          <div className="border-1 border-warning rounded-sm p-6 hover:bg-base-200 transition-colors">
            <div className="font-raleway font-extrabold tracking-tighter text-lg lowercase mb-3 text-warning">
              developer-first
            </div>
            <p className="font-lora tracking-wide opacity-80 text-neutral lowercase text-sm">
              built by developers, for developers who understand the pain
            </p>
          </div>
        </div>
      </div>
    ),

    // Slide 9: Ask
    () => (
      <div className="space-y-12">
        <div className="text-center">
          <h2 className="font-raleway font-extrabold tracking-tighter text-4xl lowercase mb-4">
            what we need
          </h2>
        </div>
        
        <div className="border-1 border-neutral rounded-sm bg-base-200 p-8 max-w-4xl mx-auto">
          <h3 className="font-raleway font-extrabold tracking-tighter text-xl lowercase mb-6">
            non-monetary support needed:
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <span className="font-raleway font-extrabold tracking-tighter text-sm opacity-80 text-neutral lowercase">
                  mentorship
                </span>
                <span className="font-lora tracking-wide opacity-80 text-neutral lowercase text-sm">
                  from successful saas founders
                </span>
              </div>
              
              <div className="flex items-start space-x-3">
                <span className="font-raleway font-extrabold tracking-tighter text-sm opacity-80 text-neutral lowercase">
                  access
                </span>
                <span className="font-lora tracking-wide opacity-80 text-neutral lowercase text-sm">
                  to developer communities for user research
                </span>
              </div>
              
              <div className="flex items-start space-x-3">
                <span className="font-raleway font-extrabold tracking-tighter text-sm opacity-80 text-neutral lowercase">
                  feedback
                </span>
                <span className="font-lora tracking-wide opacity-80 text-neutral lowercase text-sm">
                  from experienced entrepreneurs
                </span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <span className="font-raleway font-extrabold tracking-tighter text-sm opacity-80 text-neutral lowercase">
                  network
                </span>
                <span className="font-lora tracking-wide opacity-80 text-neutral lowercase text-sm">
                  connections to potential customers and partners
                </span>
              </div>
              
              <div className="flex items-start space-x-3">
                <span className="font-raleway font-extrabold tracking-tighter text-sm opacity-80 text-neutral lowercase">
                  advisors
                </span>
                <span className="font-lora tracking-wide opacity-80 text-neutral lowercase text-sm">
                  for ai/ml and developer tools expertise
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),

    // Slide 10: Contact
    () => (
      <div className="flex flex-col items-center justify-center text-center space-y-12">
        <div className="space-y-6">
          <h1 className="font-raleway font-extrabold tracking-tighter text-5xl md:text-6xl lowercase">
            let's build together
          </h1>
        </div>
        
        <div className="border-1 border-primary rounded-sm bg-base-200 p-8 max-w-2xl">
          <h3 className="font-raleway font-extrabold tracking-tighter text-xl lowercase mb-4">
            ready to transform how saas companies communicate with customers
          </h3>
          <p className="font-raleway font-extrabold tracking-tighter text-2xl lowercase text-primary mb-2">
            shipnotes.dev
          </p>
          <p className="font-lora tracking-wide opacity-80 text-neutral lowercase">
            turning commits into customer connections
          </p>
        </div>
        
        <div className="font-raleway font-extrabold tracking-tighter text-3xl lowercase opacity-60">
          thank you!
        </div>
      </div>
    ),
  ];

  return (
    <main className="min-h-screen bg-base-100">
      <SmallScreenMessage />
      
      {!isPresenting && (
        <div className="p-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="font-raleway font-extrabold tracking-tighter text-4xl lowercase mb-4">
                shipnotes.dev pitch deck
              </h1>
              <p className="font-lora tracking-wide opacity-80 text-neutral lowercase mb-6">
                navigate with arrow keys, space bar, or click the dots below
              </p>
              <button
                onClick={() => setIsPresenting(true)}
                className="btn btn-primary font-raleway font-extrabold tracking-tighter lowercase border-1 border-neutral"
              >
                start presentation (f or enter)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Slide Container */}
      <div className={`${isPresenting ? 'fixed inset-0 z-50' : ''} flex flex-col justify-center items-center p-8`}>
        <div className="w-full max-w-6xl mx-auto">
          {slides[currentSlide]()}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className={`${isPresenting ? 'fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50' : 'flex justify-center mt-8'}`}>
        <div className="flex items-center space-x-4 bg-base-200 border-1 border-neutral rounded-sm p-4">
          {/* Previous Button */}
          <button
            onClick={prevSlide}
            className="btn btn-sm btn-secondary font-raleway font-extrabold tracking-tighter lowercase border-1 border-neutral"
            disabled={currentSlide === 0}
          >
            ←
          </button>

          {/* Slide Dots */}
          <div className="flex space-x-2">
            {Array.from({ length: totalSlides }, (_, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                className={`w-3 h-3 rounded-full border-1 border-neutral transition-colors ${
                  i === currentSlide ? 'bg-primary' : 'bg-base-300 hover:bg-base-200'
                }`}
              />
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={nextSlide}
            className="btn btn-sm btn-secondary font-raleway font-extrabold tracking-tighter lowercase border-1 border-neutral"
            disabled={currentSlide === totalSlides - 1}
          >
            →
          </button>

          {/* Slide Counter */}
          <div className="font-space tracking-normal text-sm opacity-60 text-neutral lowercase">
            {currentSlide + 1} / {totalSlides}
          </div>

          {/* Exit Presentation Button */}
          {isPresenting && (
            <button
              onClick={() => setIsPresenting(false)}
              className="btn btn-sm btn-ghost font-raleway font-extrabold tracking-tighter lowercase"
            >
              esc
            </button>
          )}
        </div>
      </div>

      {/* Instructions */}
      {!isPresenting && (
        <div className="text-center p-6">
          <p className="font-space tracking-normal text-sm opacity-60 text-neutral lowercase">
            press f or enter for fullscreen • arrow keys or space to navigate • esc to exit
          </p>
        </div>
      )}
    </main>
  );
};

export default PitchDeck;