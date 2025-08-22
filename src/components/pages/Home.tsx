import React from 'react';
import { Link } from '@tanstack/react-router';
import {
  BarChart,
  Users,
  Smartphone,
  Lock,
  Star,
  CheckCircle,
  Trophy
} from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-ocean-600 to-sky-400"></div>
      
      {/* Floating glass elements inspired by Figma design */}
      <div className="absolute inset-0">
        {/* Large floating card */}
        <div className="absolute top-1/4 right-8 w-64 h-40 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl transform rotate-12 hidden lg:block"></div>
        
        {/* Medium floating element */}
        <div className="absolute top-1/3 left-12 w-48 h-32 bg-sunset-500/20 backdrop-blur-lg border border-sunset-500/30 rounded-xl transform -rotate-6 hidden lg:block"></div>
        
        {/* Small accent circles */}
        <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-sunrise-500/30 rounded-full backdrop-blur-sm hidden md:block"></div>
        <div className="absolute top-3/4 left-1/3 w-12 h-12 bg-sky-400/40 rounded-full backdrop-blur-sm hidden md:block"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content side */}
          <div className="text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-6">
              <div className="w-2 h-2 bg-sunrise-500 rounded-full"></div>
              <span className="text-sky-200 text-sm font-medium">NFL Season 2025</span>
            </div>
            
            {/* Main headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              The Next Generation
              <span className="block text-sky-400">Pick'em Experience</span>
            </h1>
            
            {/* Value proposition */}
            <p className="text-xl text-sky-200 mb-8 max-w-lg leading-relaxed">
              Join thousands of NFL fans competing in leagues with real-time scoring, advanced analytics, and the most intuitive pick'em interface ever built.
            </p>
            
            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link 
                to="/register"
                className="bg-sky-400 hover:bg-sky-500 text-navy-900 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200 shadow-xl hover:shadow-2xl text-center"
              >
                Get Started
              </Link>
              <button className="border border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200 backdrop-blur-sm">
                View Demo
              </button>
            </div>
            
            {/* Trust indicators */}
            <div className="flex items-center gap-6 text-sky-200 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-sunrise-500" />
                <span>Instant Setup</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-sunrise-500" />
                <span>Real-time Scoring</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-sunrise-500" />
                <span>Mobile Optimized</span>
              </div>
            </div>
          </div>
          
          {/* Visual side */}
          <div className="relative hidden lg:block">
            {/* Main visual card */}
            <div className="relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-2xl">
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-semibold">Week 12 Picks</h3>
                  <div className="bg-sunrise-500/20 text-sunrise-400 px-3 py-1 rounded-full text-sm">Live</div>
                </div>
                
                {/* Game rows */}
                <div className="space-y-3">
                  {[
                    { team1: 'Cowboys', team2: 'Eagles', selected: 'Eagles' },
                    { team1: 'Chiefs', team2: 'Bills', selected: 'Chiefs' },
                    { team1: 'Packers', team2: 'Lions', selected: 'Lions' }
                  ].map((game, i) => (
                    <div key={i} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-sunset-500 to-sunrise-500 rounded-full"></div>
                        <span className="text-white text-sm">{game.team1} vs {game.team2}</span>
                      </div>
                      <div className="bg-sky-400/20 text-sky-400 px-2 py-1 rounded text-xs">{game.selected}</div>
                    </div>
                  ))}
                </div>
                
                {/* Progress */}
                <div className="pt-4 border-t border-white/10">
                  <div className="flex justify-between text-sm text-sky-200 mb-2">
                    <span>Season Progress</span>
                    <span>8/12 weeks</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div className="bg-gradient-to-r from-sky-400 to-sunrise-500 h-2 rounded-full" style={{ width: '67%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating stats cards */}
            <div className="absolute -top-4 -right-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">73%</div>
                <div className="text-xs text-sky-200">Win Rate</div>
              </div>
            </div>
            
            <div className="absolute -bottom-4 -left-4 bg-sunset-500/20 backdrop-blur-md border border-sunset-500/30 rounded-xl p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">#2</div>
                <div className="text-xs text-sky-200">League Rank</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const StatsSection: React.FC = () => {
  const stats = [
    { value: '25K+', label: 'Active Players', subtext: 'Making picks weekly' },
    { value: '500+', label: 'Active Leagues', subtext: 'Competing right now' },
    { value: '$2.5M+', label: 'Prize Money', subtext: 'Awarded to winners' },
    { value: '99.9%', label: 'Uptime', subtext: 'Never miss a game' }
  ];

  return (
    <section className="relative py-16 bg-gradient-to-r from-navy-900 to-ocean-600">
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Trusted by NFL fans everywhere
          </h2>
          <p className="text-sky-200 text-lg max-w-2xl mx-auto">
            Join the fastest-growing pick'em community with real-time competition and serious prizes.
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                <div className="text-3xl md:text-4xl font-bold text-sky-400 mb-2 group-hover:text-sunrise-500 transition-colors duration-300">
                  {stat.value}
                </div>
                <div className="text-white font-semibold mb-1">
                  {stat.label}
                </div>
                <div className="text-sky-200 text-sm">
                  {stat.subtext}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-6 py-3">
            <div className="flex -space-x-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-8 h-8 bg-gradient-to-br from-sunset-500 to-sunrise-500 rounded-full border-2 border-white/20"></div>
              ))}
            </div>
            <span className="text-sky-200 text-sm ml-2">
              <span className="text-white font-semibold">2,847 players</span> joined this week
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-xl">
      <div className="text-sunset-500 mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
      <p className="text-sky-200 leading-relaxed">{description}</p>
    </div>
  );
};

const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="bg-gradient-to-br from-ocean-600 to-navy-900 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            You do the picking,
            <span className="block text-sky-400">we'll handle the competition.</span>
          </h2>
          <p className="text-xl text-sky-200 max-w-3xl mx-auto">
            From league creation to season-long competition, we've built everything you need for the ultimate pick'em experience.
          </p>
        </div>

        {/* Main feature sections */}
        <div className="grid lg:grid-cols-2 gap-16 mb-16">
          {/* Left feature */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-sky-400/20 text-sky-400 px-4 py-2 rounded-full text-sm font-medium">
                <CheckCircleIcon className="w-4 h-4" />
                Easy Setup
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-white">
                Create leagues in seconds, not hours.
              </h3>
              <p className="text-sky-200 text-lg leading-relaxed">
                Set up custom leagues with flexible rules, invite friends with a simple link, and manage everything from one intuitive dashboard. No complicated setup or confusing settings.
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-sky-400 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-navy-900" />
                  </div>
                  <span className="text-white">Instant league creation</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-sky-400 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-navy-900" />
                  </div>
                  <span className="text-white">Smart invite system</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-sky-400 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-navy-900" />
                  </div>
                  <span className="text-white">Flexible scoring rules</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right feature */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-sunrise-500/20 text-sunrise-500 px-4 py-2 rounded-full text-sm font-medium">
                <BarChart className="w-4 h-4" />
                Real-time Updates
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-white">
                Live scoring keeps everyone engaged.
              </h3>
              <p className="text-sky-200 text-lg leading-relaxed">
                Watch your picks come to life with real-time score updates and instant standings. See exactly how you're performing against your league mates as games unfold.
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-sunrise-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-navy-900" />
                  </div>
                  <span className="text-white">ESPN API integration</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-sunrise-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-navy-900" />
                  </div>
                  <span className="text-white">Instant notifications</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-sunrise-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-navy-900" />
                  </div>
                  <span className="text-white">Live leaderboards</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Users className="w-12 h-12" />}
            title="Social Competition"
            description="Built-in chat, trash talk, and celebration features that make competing with friends even more fun."
          />
          
          <FeatureCard
            icon={<Smartphone className="w-12 h-12" />}
            title="Mobile Optimized"
            description="Perfect experience on any device. Make picks on the go and never miss a deadline."
          />
          
          <FeatureCard
            icon={<Lock className="w-12 h-12" />}
            title="Secure & Reliable"
            description="Bank-level security with 99.9% uptime. Your leagues and data are always safe and accessible."
          />
        </div>
      </div>
    </section>
  );
};

const CTASection: React.FC = () => {
  return (
    <section className="bg-gradient-to-r from-sunset-500 to-sunrise-500 py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
          Ready to Dominate Your League?
        </h2>
        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          Join thousands of NFL fans who've already discovered the easiest way to run pick'em leagues. 
          Get started today and see why Pick'em Pro is the #1 choice for serious competitors.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link 
            to="/register"
            className="bg-navy-900 hover:bg-navy-800 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105"
          >
            Create Your League Now
          </Link>
          <button className="border-2 border-white text-white hover:bg-white hover:text-sunset-500 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200">
            View Demo
          </button>
        </div>
        <div className="mt-8 text-white/80">
          <p className="text-sm flex items-center justify-center gap-2">
            <Lock className="w-4 h-4" />
            Free to start • No credit card required • 30-day money-back guarantee
          </p>
        </div>
      </div>
    </section>
  );
};

const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      quote: "Pick'em Pro made our league so much more engaging. The real-time updates and easy interface keep everyone involved all season long.",
      author: "Mike Johnson",
      role: "League Commissioner",
      avatar: "MJ"
    },
    {
      quote: "Finally, a pick'em platform that just works. No more spreadsheets, no more confusion. Just pure competition and fun.",
      author: "Sarah Chen",
      role: "3-time League Champion",
      avatar: "SC"
    },
    {
      quote: "The mobile experience is fantastic. I can make my picks during commercial breaks and never miss a deadline.",
      author: "David Rodriguez",
      role: "Weekly Winner",
      avatar: "DR"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-navy-900 to-ocean-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            What people are saying about us
          </h2>
          <p className="text-sky-200 text-lg max-w-2xl mx-auto">
            Join thousands of NFL fans who've discovered the best way to compete in pick'em leagues.
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300">
              {/* Quote */}
              <div className="mb-6">
                <div className="text-sunrise-500 text-4xl mb-4">"</div>
                <p className="text-sky-200 text-lg leading-relaxed italic">
                  {testimonial.quote}
                </p>
              </div>
              
              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-sunset-500 to-sunrise-500 rounded-full flex items-center justify-center text-white font-bold">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="text-white font-semibold">{testimonial.author}</div>
                  <div className="text-sky-300 text-sm">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom stats */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-8 py-6">
            <div className="flex items-center gap-2">
              <div className="flex text-sunrise-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <span className="text-white font-semibold">4.9/5</span>
            </div>
            <div className="text-sky-200 text-sm">
              Based on <span className="text-white font-semibold">2,400+</span> reviews
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer: React.FC = () => {
  return (
    <footer className="bg-navy-900 border-t border-ocean-600/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company info */}
          <div className="col-span-1">
            <div className="flex items-center gap-2 text-2xl font-bold text-sky-400 mb-4">
              <Trophy className="h-8 w-8" />
              Pick'em Pro
            </div>
            <p className="text-sky-200 mb-4">
              The simplest way to run NFL pick'em leagues with friends and family.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-sky-400 hover:text-sunrise-500 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="text-sky-400 hover:text-sunrise-500 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                </svg>
              </a>
              <a href="#" className="text-sky-400 hover:text-sunrise-500 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-sky-200">
              <li><a href="#" className="hover:text-sunrise-500 transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-sunrise-500 transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-sunrise-500 transition-colors">How It Works</a></li>
              <li><a href="#" className="hover:text-sunrise-500 transition-colors">Demo</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sky-200">
              <li><a href="#" className="hover:text-sunrise-500 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-sunrise-500 transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-sunrise-500 transition-colors">League Setup Guide</a></li>
              <li><a href="#" className="hover:text-sunrise-500 transition-colors">API Docs</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sky-200">
              <li><a href="#" className="hover:text-sunrise-500 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-sunrise-500 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-sunrise-500 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-sunrise-500 transition-colors">Careers</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-ocean-600/30 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sky-300 text-sm">
            © 2025 Pick'em Pro. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm text-sky-300 mt-4 md:mt-0">
            <a href="#" className="hover:text-sunrise-500 transition-colors">Status</a>
            <a href="#" className="hover:text-sunrise-500 transition-colors">Security</a>
            <a href="#" className="hover:text-sunrise-500 transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const Home: React.FC = () => {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </>
  );
};

export default Home;