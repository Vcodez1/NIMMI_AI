"use client";

import Link from "next/link";
import { Bot, Zap, Shield, Wand2, ArrowRight, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#fcfcfd] text-zinc-900 selection:bg-blue-500/10">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 font-bold text-2xl tracking-tighter">
            <div className="relative w-10 h-10 overflow-hidden rounded-xl border border-zinc-100 shadow-sm">
              <Image
                src="/nimmi-logo.png"
                alt="Nimmi Logo"
                fill
                className="object-contain p-1"
                priority
              />
            </div>
            <span className="bg-gradient-to-r from-zinc-900 to-zinc-600 bg-clip-text text-transparent">Nimmi AI</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-zinc-600 font-medium">
            <a href="#features" className="hover:text-zinc-900 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-zinc-900 transition-colors">How it works</a>
            <a href="#pricing" className="hover:text-zinc-900 transition-colors">Pricing</a>
          </div>
          <Link href="/auth/signup" className="px-6 py-2.5 bg-zinc-900 text-white rounded-full font-semibold hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-900/10">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold mb-6 border border-blue-100 shadow-sm">
              New: Gemini 1.5 Pro Support
            </span>
            <h1 className="text-5xl md:text-8xl font-bold tracking-tight mb-8 bg-gradient-to-b from-zinc-900 to-zinc-600 bg-clip-text text-transparent leading-tight">
              Build your AI bot<br />in 5 minutes.
            </h1>
            <p className="text-xl text-zinc-600 max-w-2xl mx-auto mb-12">
              The ultimate platform for creating custom-trained AI chatbots.
              Upload your documents, customize the look, and embed it anywhere.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth/signup" className="group px-8 py-4 bg-blue-600 text-white rounded-full font-bold text-lg hover:bg-blue-700 transition-all flex items-center gap-2 shadow-xl shadow-blue-500/20">
                Start Building Now
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="px-8 py-4 bg-zinc-100 text-zinc-900 border border-zinc-200 rounded-full font-bold text-lg hover:bg-zinc-200 transition-all">
                View Demo
              </button>
            </div>
          </motion.div>

          {/* Floating Preview */}
          <motion.div
            className="mt-24 relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <div className="absolute inset-0 bg-blue-400/10 blur-[120px] rounded-full mx-auto w-[60%] h-[60%]" />
            <div className="relative border border-zinc-200 rounded-3xl overflow-hidden shadow-2xl bg-white aspect-[16/9] max-w-5xl mx-auto p-4 flex gap-4">
              {/* Dashboard Mockup */}
              <div className="w-1/4 h-full bg-zinc-50 rounded-xl border border-zinc-100 p-4 flex flex-col gap-4">
                {[1, 2, 3].map(i => <div key={i} className="h-8 w-full bg-zinc-200/50 rounded-lg" />)}
              </div>
              <div className="flex-1 h-full bg-zinc-50/50 rounded-xl border border-zinc-100 p-8 flex flex-col gap-6">
                <div className="h-12 w-1/3 bg-zinc-200/50 rounded-xl" />
                <div className="grid grid-cols-2 gap-4 flex-1">
                  <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm" />
                  <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm" />
                </div>
              </div>
              {/* Widget Preview */}
              <div className="absolute bottom-12 right-12 w-72 h-96 bg-white rounded-2xl shadow-2xl border border-zinc-100 flex flex-col overflow-hidden animate-bounce-slow">
                <div className="bg-blue-600 p-4 font-bold flex justify-between text-white">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-white/20 overflow-hidden relative">
                      <Image src="/nimmi-logo.png" alt="Logo" fill className="object-contain p-0.5" />
                    </div>
                    <span className="text-sm">AI Assistant</span>
                  </div>
                  <MessageSquare size={16} />
                </div>
                <div className="flex-1 p-4 flex flex-col gap-3">
                  <div className="bg-zinc-100 p-3 rounded-2xl rounded-tl-none text-xs w-3/4 text-zinc-700">Hello! How can I help you today?</div>
                  <div className="bg-blue-600 p-3 rounded-2xl rounded-tr-none text-xs w-2/3 self-end text-white">Can you explain the pricing?</div>
                </div>
                <div className="p-3 border-t border-zinc-100">
                  <div className="h-10 bg-zinc-50 rounded-xl border border-zinc-100 flex items-center px-3 text-[10px] text-zinc-400">Type a message...</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 border-t border-zinc-100 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: "Train in Seconds", desc: "Upload PDFs or link your website to instantly provide your AI with knowledge." },
              { icon: Wand2, title: "Fully Custom", desc: "Change colors, logos, and personality to match your brand's unique voice." },
              { icon: Shield, title: "Enterprise Grade", desc: "Advanced security and rate-limiting to keep your data and budget safe." },
            ].map((f, i) => (
              <div key={i} className="p-8 rounded-3xl bg-[#fcfcfd] border border-zinc-100 hover:border-blue-200 transition-all hover:shadow-lg hover:shadow-blue-500/5 group">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 border border-blue-100 transition-transform group-hover:scale-110">
                  <f.icon className="text-blue-600" size={24} />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-zinc-900">{f.title}</h3>
                <p className="text-zinc-600 leading-relaxed font-medium">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-zinc-100 px-6 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-zinc-400 font-medium">
          <div className="flex items-center gap-3 font-bold text-lg text-zinc-900">
            <div className="relative w-8 h-8 overflow-hidden rounded-lg border border-zinc-100">
              <Image src="/nimmi-logo.png" alt="Logo" fill className="object-contain p-0.5" />
            </div>
            Nimmi AI
          </div>
          <p>© 2026 Nimmi AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
