"use client";

import { User, Mail, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Script from "next/script";
import "./yeti.css";

// Global for MorphSVG
declare global {
    interface Window {
        gsap: any;
        MorphSVGPlugin: any;
    }
}

export default function Signup() {
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    // Refs for Yeti
    const svgContainerRef = useRef<HTMLDivElement>(null);
    const mySVGRef = useRef<SVGSVGElement>(null);
    const nameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const armLRef = useRef<SVGGElement>(null);
    const armRRef = useRef<SVGGElement>(null);
    const eyeLRef = useRef<SVGGElement>(null);
    const eyeRRef = useRef<SVGGElement>(null);
    const noseRef = useRef<SVGPathElement>(null);
    const mouthRef = useRef<SVGGElement>(null);
    const mouthBGRef = useRef<SVGPathElement>(null);
    const mouthSmallBGRef = useRef<SVGPathElement>(null);
    const mouthMediumBGRef = useRef<SVGPathElement>(null);
    const mouthLargeBGRef = useRef<SVGPathElement>(null);
    const mouthMaskPathRef = useRef<SVGPathElement>(null);
    const mouthOutlineRef = useRef<SVGPathElement>(null);
    const toothRef = useRef<SVGPathElement>(null);
    const tongueRef = useRef<SVGGElement>(null);
    const chinRef = useRef<SVGPathElement>(null);
    const faceRef = useRef<SVGPathElement>(null);
    const eyebrowRef = useRef<SVGGElement>(null);
    const outerEarLRef = useRef<SVGGElement>(null);
    const outerEarRRef = useRef<SVGGElement>(null);
    const earHairLRef = useRef<SVGGElement>(null);
    const earHairRRef = useRef<SVGGElement>(null);
    const hairRef = useRef<SVGPathElement>(null);
    const bodyBGRef = useRef<SVGPathElement>(null);
    const bodyBGchangedRef = useRef<SVGPathElement>(null);
    const twoFingersRef = useRef<SVGGElement>(null);

    const yetiState = useRef({
        activeElement: null as string | null,
        screenCenter: 0,
        svgCoords: { x: 0, y: 0 },
        fieldCoords: { x: 0, y: 0 },
        fieldScrollMax: 0,
        chinMin: 0.5,
        mouthStatus: "small",
        blinking: null as any,
        eyeScale: 1,
        eyesCovered: false,
        showPasswordClicked: false,
        eyeLCoords: { x: 0, y: 0 },
        eyeRCoords: { x: 0, y: 0 },
        noseCoords: { x: 0, y: 0 },
        mouthCoords: { x: 0, y: 0 }
    });

    useEffect(() => {
        const timer = setInterval(() => {
            if (window.gsap && window.MorphSVGPlugin) {
                initLoginForm();
                clearInterval(timer);
            }
        }, 500);
        return () => clearInterval(timer);
    }, []);

    const initLoginForm = () => {
        if (!window.gsap || !window.MorphSVGPlugin) return;
        const gsap = window.gsap;
        gsap.registerPlugin(window.MorphSVGPlugin);

        gsap.set(armLRef.current, { x: -93, y: 220, rotation: 105, transformOrigin: "top left" });
        gsap.set(armRRef.current, { x: -93, y: 220, rotation: -105, transformOrigin: "top right" });
        gsap.set(mouthRef.current, { transformOrigin: "center center" });

        startBlinking(5);
    };

    const startBlinking = (delay: number) => {
        if (!window.gsap) return;
        const gsap = window.gsap;
        const randomInt = (max: number) => Math.floor(Math.random() * max);
        const wait = delay ? randomInt(delay) : 1;

        yetiState.current.blinking = gsap.to([eyeLRef.current, eyeRRef.current], .1, {
            delay: wait,
            scaleY: 0,
            yoyo: true,
            repeat: 1,
            transformOrigin: "center center",
            onComplete: () => startBlinking(12)
        });
    };

    const calculateFaceMove = (inputEl: HTMLInputElement) => {
        if (!window.gsap || !inputEl || !mySVGRef.current) return;
        const gsap = window.gsap;
        const carPos = inputEl.selectionEnd || inputEl.value.length;

        const div = document.createElement('div');
        const span = document.createElement('span');
        const style = getComputedStyle(inputEl);
        for (const p of style) { (div.style as any)[p] = (style as any)[p]; }
        div.style.position = 'absolute'; div.style.visibility = 'hidden'; div.style.whiteSpace = 'pre';
        document.body.appendChild(div);
        div.textContent = inputEl.value.substring(0, carPos);
        span.textContent = inputEl.value.substring(carPos) || '.';
        div.appendChild(span);

        const fieldRect = inputEl.getBoundingClientRect();
        const caretX = span.getBoundingClientRect().left;
        const caretY = fieldRect.top + fieldRect.height / 2;
        const svgRect = mySVGRef.current.getBoundingClientRect();

        const s = {
            eyeL: { x: svgRect.left + svgRect.width * 0.42, y: svgRect.top + svgRect.height * 0.38 },
            eyeR: { x: svgRect.left + svgRect.width * 0.565, y: svgRect.top + svgRect.height * 0.38 },
            nose: { x: svgRect.left + svgRect.width * 0.485, y: svgRect.top + svgRect.height * 0.41 },
            mouth: { x: svgRect.left + svgRect.width * 0.5, y: svgRect.top + svgRect.height * 0.5 }
        };

        const getA = (o: { x: number, y: number }) => Math.atan2(o.y - caretY, o.x - caretX);
        const aL = getA(s.eyeL), aR = getA(s.eyeR), aN = getA(s.nose), aM = getA(s.mouth);

        const move = (r: any, x: number, y: number, a: number, rot: number = 0) =>
            gsap.to(r.current, 0.7, { x: -Math.cos(a) * x, y: -Math.sin(a) * y, rotation: rot, transformOrigin: "center center", ease: "expo.out" });

        move(eyeLRef, 20, 10, aL);
        move(eyeRRef, 20, 10, aR);
        move(noseRef, 23, 10, aN, Math.cos(aM) * 6);
        move(mouthRef, 23, 10, aM, Math.cos(aM) * 6);
        gsap.to(chinRef.current, 0.7, { x: -Math.cos(aM) * 18, y: -Math.sin(aM) * 5, scaleY: Math.max(0.6, 1 - Math.abs(Math.cos(aM)) * 0.4), transformOrigin: "center top", ease: "expo.out" });
        gsap.to(faceRef.current, 0.7, { x: -Math.cos(aM) * 7, y: -Math.sin(aM) * 4, skewX: -Math.cos(aM) * 5, transformOrigin: "center top", ease: "expo.out" });
        gsap.to(eyebrowRef.current, 0.7, { x: -Math.cos(aM) * 7, y: -Math.sin(aM) * 4, skewX: -Math.cos(aM) * 25, transformOrigin: "center top", ease: "expo.out" });

        document.body.removeChild(div);
    };

    const onEmailInput = () => {
        if (!emailRef.current) return;
        calculateFaceMove(emailRef.current);
        const gsap = window.gsap;
        if (!gsap) return;

        const val = emailRef.current.value;
        const mouthStatus = val.includes("@") ? "large" : (val.length > 0 ? "medium" : "small");

        if (mouthStatus !== yetiState.current.mouthStatus) {
            yetiState.current.mouthStatus = mouthStatus;
            const targetSVG = mouthStatus === "large" ? mouthLargeBGRef.current : (mouthStatus === "medium" ? mouthMediumBGRef.current : mouthSmallBGRef.current);
            gsap.to([mouthBGRef.current, mouthOutlineRef.current, mouthMaskPathRef.current], 0.7, { morphSVG: targetSVG, ease: "power2.out" });
            gsap.to([eyeLRef.current, eyeRRef.current], 0.7, { scale: mouthStatus === "large" ? 0.65 : (mouthStatus === "medium" ? 0.85 : 1), transformOrigin: "center center", ease: "power2.out" });
        }
    };

    const coverEyes = () => {
        if (!window.gsap) return;
        const gsap = window.gsap;
        yetiState.current.eyesCovered = true;
        gsap.to(armLRef.current, .45, { x: -25, y: 2, rotation: 0, ease: "power2.out" });
        gsap.to(armRRef.current, .45, { x: 25, y: 2, rotation: 0, ease: "power2.out" });
    };

    const uncoverEyes = () => {
        if (!window.gsap) return;
        const gsap = window.gsap;
        yetiState.current.eyesCovered = false;
        gsap.to(armLRef.current, .45, { x: -93, y: 220, rotation: 105, ease: "power2.out" });
        gsap.to(armRRef.current, .45, { x: -93, y: 220, rotation: -105, ease: "power2.out" });
    };

    const resetFace = () => {
        if (!window.gsap) return;
        const gsap = window.gsap;
        gsap.to([eyeLRef.current, eyeRRef.current, noseRef.current, mouthRef.current, chinRef.current, faceRef.current, eyebrowRef.current], 1, { x: 0, y: 0, rotation: 0, scale: 1, skewX: 0, ease: "power2.out" });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    name: formData.name
                })
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem("nimmi_user_id", data.user_id);
                localStorage.setItem("nimmi_user_name", data.name || formData.name);
                router.push("/dashboard");
            } else {
                setError(data.detail || "Account creation failed");
            }
        } catch (err) {
            setError("Could not connect to backend");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 text-zinc-900">
            <Script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js" strategy="beforeInteractive" />
            <Script src="https://assets.codepen.io/16327/MorphSVGPlugin3.min.js" strategy="lazyOnload" onLoad={initLoginForm} />

            <div className="max-w-md w-full bg-white border border-zinc-200 p-8 pt-4 rounded-[40px] shadow-2xl shadow-zinc-200/50">
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="yeti-container" ref={svgContainerRef}>
                        <div className="bg-white rounded-full border border-zinc-100 shadow-inner">
                            <svg ref={mySVGRef} className="mySVG" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
                                <defs>
                                    <circle id="armMaskPath" cx="100" cy="100" r="100" />
                                    <clipPath id="armMask">
                                        <use href="#armMaskPath" overflow="visible" />
                                    </clipPath>
                                </defs>
                                <circle cx="100" cy="100" r="100" fill="#f0f7ff" />
                                <g className="body">
                                    <path ref={bodyBGchangedRef} style={{ display: 'none' }} fill="#FFFFFF" d="M200,122h-35h-14.9V72c0-27.6-22.4-50-50-50s-50,22.4-50,50v50H35.8H0l0,91h200L200,122z" />
                                    <path ref={bodyBGRef} stroke="#3A5E77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="#FFFFFF" d="M200,158.5c0-20.2-14.8-36.5-35-36.5h-14.9V72.8c0-27.4-21.7-50.4-49.1-50.8c-28-0.5-50.9,22.1-50.9,50v50 H35.8C16,122,0,138,0,157.8L0,213h200L200,158.5z" />
                                    <path fill="#DDF1FA" d="M100,156.4c-22.9,0-43,11.1-54.1,27.7c15.6,10,34.2,15.9,54.1,15.9s38.5-5.8,54.1-15.9 C143,167.5,122.9,156.4,100,156.4z" />
                                </g>
                                <g className="earL">
                                    <g ref={outerEarLRef} fill="#ddf1fa" stroke="#3a5e77" strokeWidth="2.5">
                                        <circle cx="47" cy="83" r="11.5" />
                                        <path d="M46.3 78.9c-2.3 0-4.1 1.9-4.1 4.1 0 2.3 1.9 4.1 4.1 4.1" strokeLinecap="round" strokeLinejoin="round" />
                                    </g>
                                    <g ref={earHairLRef}>
                                        <rect x="51" y="64" fill="#FFFFFF" width="15" height="35" />
                                        <path d="M53.4 62.8C48.5 67.4 45 72.2 42.8 77c3.4-.1 6.8-.1 10.1.1-4 3.7-6.8 7.6-8.2 11.6 2.1 0 4.2 0 6.3.2-2.6 4.1-3.8 8.3-3.7 12.5 1.2-.7 3.4-1.4 5.2-1.9" fill="#fff" stroke="#3a5e77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </g>
                                </g>
                                <g className="earR">
                                    <g ref={outerEarRRef}>
                                        <circle fill="#DDF1FA" stroke="#3A5E77" strokeWidth="2.5" cx="153" cy="83" r="11.5" />
                                        <path fill="#DDF1FA" stroke="#3A5E77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M153.7,78.9 c2.3,0,4.1,1.9,4.1,4.1c0,2.3-1.9,4.1-4.1,4.1" />
                                    </g>
                                    <g ref={earHairRRef}>
                                        <rect x="134" y="64" fill="#FFFFFF" width="15" height="35" />
                                        <path fill="#FFFFFF" stroke="#3A5E77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M146.6,62.8 c4.9,4.6,8.4,9.4,10.6,14.2c-3.4-0.1-6.8-0.1-10.1,0.1c4,3.7,6.8,7.6,8.2,11.6c-2.1,0-4.2,0-6.3,0.2c2.6,4.1,3.8,8.3,3.7,12.5 c-1.2-0.7-3.4-1.4-5.2-1.9" />
                                    </g>
                                </g>
                                <g className="arms" clipPath="url(#armMask)">
                                    <g ref={armLRef} className="armL" style={{ visibility: 'visible' }}>
                                        <path fill="#fff" stroke="#3a5e77" strokeWidth="2.5" d="M123.5,97.8 c-41.4,14.9-84.1,30.7-108.2,35.5L1.2,81c33.5-9.9,71.9-16.5,111.9-21.8" />
                                    </g>
                                    <g ref={armRRef} className="armR" style={{ visibility: 'visible' }}>
                                        <path fill="#fff" stroke="#3a5e77" strokeWidth="2.5" d="M263.3 96.7c41.4 14.9 84.1 30.7 108.2 35.5l14-52.3C352 70 313.6 63.5 273.6 58.1" />
                                    </g>
                                </g>
                            </svg>
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold tracking-tight text-center bg-gradient-to-r from-zinc-900 to-zinc-600 bg-clip-text text-transparent">Create Account</h2>

                    {error && <div className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-xl text-xs text-center font-medium">{error}</div>}

                    <div className="space-y-4">
                        <div className="inputGroup">
                            <label className="yeti-label">Full Name</label>
                            <input
                                ref={nameRef}
                                type="text"
                                required
                                value={formData.name}
                                onChange={e => {
                                    setFormData({ ...formData, name: e.target.value });
                                    calculateFaceMove(nameRef.current!);
                                }}
                                onFocus={() => {
                                    yetiState.current.activeElement = "name";
                                    calculateFaceMove(nameRef.current!);
                                }}
                                onBlur={() => {
                                    yetiState.current.activeElement = null;
                                    setTimeout(() => { if (!yetiState.current.activeElement) resetFace(); }, 100);
                                }}
                                placeholder="Your Name"
                                className="yeti-input"
                            />
                        </div>

                        <div className="inputGroup">
                            <label className="yeti-label">Email Address</label>
                            <input
                                ref={emailRef}
                                type="email"
                                required
                                value={formData.email}
                                onChange={e => {
                                    setFormData({ ...formData, email: e.target.value });
                                    onEmailInput();
                                }}
                                onFocus={() => {
                                    yetiState.current.activeElement = "email";
                                    calculateFaceMove(emailRef.current!);
                                }}
                                onBlur={() => {
                                    yetiState.current.activeElement = null;
                                    setTimeout(() => { if (!yetiState.current.activeElement) resetFace(); }, 100);
                                }}
                                placeholder="email@domain.com"
                                className="yeti-input"
                            />
                        </div>

                        <div className="inputGroup">
                            <label className="yeti-label">Password</label>
                            <div className="relative">
                                <input
                                    ref={passwordRef}
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    onFocus={() => {
                                        yetiState.current.activeElement = "password";
                                        if (!yetiState.current.eyesCovered) coverEyes();
                                    }}
                                    onBlur={() => {
                                        yetiState.current.activeElement = null;
                                        setTimeout(() => {
                                            if (yetiState.current.activeElement !== "toggle" && yetiState.current.activeElement !== "password") {
                                                uncoverEyes();
                                            }
                                        }, 100);
                                    }}
                                    className="yeti-input"
                                    placeholder="Create a password"
                                />
                                <button
                                    type="button"
                                    id="showPasswordToggle"
                                    onMouseDown={() => {
                                        yetiState.current.showPasswordClicked = true;
                                        yetiState.current.activeElement = "password";
                                    }}
                                    onMouseUp={() => yetiState.current.showPasswordClicked = false}
                                    onClick={() => {
                                        const newShow = !showPassword;
                                        setShowPassword(newShow);
                                        const gsap = window.gsap;
                                        if (gsap) {
                                            if (newShow) {
                                                gsap.to(twoFingersRef.current, .35, { transformOrigin: "bottom left", rotation: 30, x: -9, y: -2, ease: "power2.inOut" });
                                            } else {
                                                gsap.to(twoFingersRef.current, .35, { transformOrigin: "bottom left", rotation: 0, x: 0, y: 0, ease: "power2.inOut" });
                                            }
                                        }
                                    }}
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>
                    </div>

                    <button
                        disabled={loading}
                        className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 group shadow-xl shadow-blue-500/20 disabled:opacity-50 mt-6"
                    >
                        {loading ? "Creating account..." : "Get Started"}
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>

                <p className="text-center mt-6 text-zinc-500 text-sm font-medium">
                    Already have an account?{" "}
                    <Link href="/auth/login" className="text-blue-600 font-bold hover:underline font-semibold text-zinc-900 border-b border-zinc-200 ml-1">Sign In</Link>
                </p>
            </div>
        </div>
    );
}
