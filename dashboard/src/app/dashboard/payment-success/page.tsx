"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

function PaymentSuccessContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const botId = searchParams.get("bot_id");
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        if (!botId) return;

        if (countdown <= 0) {
            router.push(`/dashboard/builder/${botId}?payment=success`);
            return;
        }

        const timer = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [botId, router, countdown]);

    if (!botId) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-4">
                <div className="text-white text-center">
                    <h1 className="text-2xl font-bold mb-2">Invalid Session</h1>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                        Go back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-600/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-600/10 rounded-full blur-[120px]" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full bg-zinc-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-[32px] shadow-2xl relative z-10"
            >
                <div className="flex flex-col items-center text-center space-y-6">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.2 }}
                        className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center border border-green-500/20"
                    >
                        <CheckCircle size={40} className="text-green-500" />
                    </motion.div>

                    <div className="space-y-2">
                        <motion.h1
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-2xl font-bold text-white flex items-center justify-center gap-2"
                        >
                            Payment Successful <Sparkles size={20} className="text-yellow-500" />
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-white/40 text-sm leading-relaxed"
                        >
                            Your export license has been activated. You can now deploy your chatbot to any platform.
                        </motion.p>
                    </div>

                    <div className="w-full h-px bg-white/5" />

                    <div className="flex items-center justify-between w-full text-xs">
                        <span className="text-white/20">License Type</span>
                        <span className="text-white font-medium">Lifetime Export</span>
                    </div>
                    <div className="flex items-center justify-between w-full text-xs">
                        <span className="text-white/20">Status</span>
                        <span className="text-green-500 font-bold uppercase tracking-widest">Active</span>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => router.push(`/dashboard/builder/${botId}`)}
                        className="w-full py-4 bg-white text-black rounded-2xl font-bold flex items-center justify-center gap-2 group transition-all hover:bg-zinc-200"
                    >
                        Return to Builder
                        <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                    </motion.button>

                    <p className="text-[10px] text-white/20">
                        Redirecting in {countdown}s...
                    </p>
                </div>
            </motion.div>
        </div>
    );
}

export default function PaymentSuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>}>
            <PaymentSuccessContent />
        </Suspense>
    );
}
