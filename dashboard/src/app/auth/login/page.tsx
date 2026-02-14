"use client";

import { Mail, Lock, ArrowRight } from "lucide-react";
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

export default function Login() {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    // Refs for Yeti
    const svgContainerRef = useRef<HTMLDivElement>(null);
    const mySVGRef = useRef<SVGSVGElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const showPasswordCheckRef = useRef<HTMLInputElement>(null);
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
        curEmailIndex: 0,
        screenCenter: 0,
        svgCoords: { x: 0, y: 0 },
        emailCoords: { x: 0, y: 0 },
        emailScrollMax: 0,
        chinMin: 0.5,
        dFromC: 0,
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
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                })
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem("nimmi_user_id", data.user_id);
                localStorage.setItem("nimmi_user_name", data.name || "");
                router.push("/dashboard");
            } else {
                setError(data.detail || "Login failed");
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
                                <path ref={chinRef} className="chin" d="M84.1 121.6c2.7 2.9 6.1 5.4 9.8 7.5l.9-4.5c2.9 2.5 6.3 4.8 10.2 6.5 0-1.9-.1-3.9-.2-5.8 3 1.2 6.2 2 9.7 2.5-.3-2.1-.7-4.1-1.2-6.1" fill="none" stroke="#3a5e77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path ref={faceRef} className="face" fill="#DDF1FA" d="M134.5,46v35.5c0,21.815-15.446,39.5-34.5,39.5s-34.5-17.685-34.5-39.5V46" />
                                <path ref={hairRef} className="hair" fill="#FFFFFF" stroke="#3A5E77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M81.457,27.929 c1.755-4.084,5.51-8.262,11.253-11.77c0.979,2.565,1.883,5.14,2.712,7.723c3.162-4.265,8.626-8.27,16.272-11.235 c-0.737,3.293-1.588,6.573-2.554,9.837c4.857-2.116,11.049-3.64,18.428-4.156c-2.403,3.23-5.021,6.391-7.852,9.474" />
                                <g ref={eyebrowRef} className="eyebrow">
                                    <path fill="#FFFFFF" d="M138.142,55.064c-4.93,1.259-9.874,2.118-14.787,2.599c-0.336,3.341-0.776,6.689-1.322,10.037 c-4.569-1.465-8.909-3.222-12.996-5.226c-0.98,3.075-2.07,6.137-3.267,9.179c-5.514-3.067-10.559-6.545-15.097-10.329 c-1.806,2.889-3.745,5.73-5.816,8.515c-7.916-4.124-15.053-9.114-21.296-14.738l1.107-11.768h73.475V55.064z" />
                                    <path fill="#FFFFFF" stroke="#3A5E77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M63.56,55.102 c6.243,5.624,13.38,10.614,21.296,14.738c2.071-2.785,4.01-5.626,5.816-8.515c4.537,3.785,9.583,7.263,15.097,10.329 c1.197-3.043,2.287-6.104,3.267-9.179c4.087,2.004,8.427,3.761,12.996,5.226c0.545-3.348,0.986-6.696,1.322-10.037 c4.913-0.481,9.857-1.34,14.787-2.599" />
                                </g>
                                <g ref={eyeLRef} className="eyeL">
                                    <circle cx="85.5" cy="78.5" r="3.5" fill="#3a5e77" />
                                    <circle cx="84" cy="76" r="1" fill="#fff" />
                                </g>
                                <g ref={eyeRRef} className="eyeR">
                                    <circle cx="114.5" cy="78.5" r="3.5" fill="#3a5e77" />
                                    <circle cx="113" cy="76" r="1" fill="#fff" />
                                </g>
                                <g ref={mouthRef} className="mouth">
                                    <path ref={mouthBGRef} className="mouthBG" fill="#617E92" d="M100.2,101c-0.4,0-1.4,0-1.8,0c-2.7-0.3-5.3-1.1-8-2.5c-0.7-0.3-0.9-1.2-0.6-1.8 c0.2-0.5,0.7-0.7,1.2-0.7c0.2,0,0.5,0.1,0.6,0.2c3,1.5,5.8,2.3,8.6,2.3s5.7-0.7,8.6-2.3c0.2-0.1,0.4-0.2,0.6-0.2 c0.5,0,1,0.3,1.2,0.7c0.4,0.7,0.1,1.5-0.6,1.9c-2.6,1.4-5.3,2.2-7.9,2.5C101.7,101,100.5,101,100.2,101z" />
                                    <path ref={mouthSmallBGRef} style={{ display: 'none' }} className="mouthSmallBG" fill="#617E92" d="M100.2,101c-0.4,0-1.4,0-1.8,0c-2.7-0.3-5.3-1.1-8-2.5c-0.7-0.3-0.9-1.2-0.6-1.8 c0.2-0.5,0.7-0.7,1.2-0.7c0.2,0,0.5,0.1,0.6,0.2c3,1.5,5.8,2.3,8.6,2.3s5.7-0.7,8.6-2.3c0.2-0.1,0.4-0.2,0.6-0.2 c0.5,0,1,0.3,1.2,0.7c0.4,0.7,0.1,1.5-0.6,1.9c-2.6,1.4-5.3,2.2-7.9,2.5C101.7,101,100.5,101,100.2,101z" />
                                    <path ref={mouthMediumBGRef} style={{ display: 'none' }} className="mouthMediumBG" d="M95,104.2c-4.5,0-8.2-3.7-8.2-8.2v-2c0-1.2,1-2.2,2.2-2.2h22c1.2,0,2.2,1,2.2,2.2v2 c0,4.5-3.7,8.2-8.2,8.2H95z" />
                                    <path ref={mouthLargeBGRef} style={{ display: 'none' }} className="mouthLargeBG" d="M100 110.2c-9 0-16.2-7.3-16.2-16.2 0-2.3 1.9-4.2 4.2-4.2h24c2.3 0 4.2 1.9 4.2 4.2 0 9-7.2 16.2-16.2 16.2z" fill="#617e92" stroke="#3a5e77" strokeLinejoin="round" strokeWidth="2.5" />
                                    <defs>
                                        <path ref={mouthMaskPathRef} id="mouthMaskPath" d="M100.2,101c-0.4,0-1.4,0-1.8,0c-2.7-0.3-5.3-1.1-8-2.5c-0.7-0.3-0.9-1.2-0.6-1.8 c0.2-0.5,0.7-0.7,1.2-0.7c0.2,0,0.5,0.1,0.6,0.2c3,1.5,5.8,2.3,8.6,2.3s5.7-0.7,8.6-2.3c0.2-0.1,0.4-0.2,0.6-0.2 c0.5,0,1,0.3,1.2,0.7c0.4,0.7,0.1,1.5-0.6,1.9c-2.6,1.4-5.3,2.2-7.9,2.5C101.7,101,100.5,101,100.2,101z" />
                                    </defs>
                                    <clipPath id="mouthMask">
                                        <use href="#mouthMaskPath" overflow="visible" />
                                    </clipPath>
                                    <g clipPath="url(#mouthMask)">
                                        <g ref={tongueRef} className="tongue">
                                            <circle cx="100" cy="107" r="8" fill="#cc4a6c" />
                                            <ellipse className="tongueHighlight" cx="100" cy="100.5" rx="3" ry="1.5" opacity=".1" fill="#fff" />
                                        </g>
                                    </g>
                                    <path clipPath="url(#mouthMask)" ref={toothRef} className="tooth" style={{ fill: '#FFFFFF' }} d="M106,97h-4c-1.1,0-2-0.9-2-2v-2h8v2C108,96.1,107.1,97,106,97z" />
                                    <path ref={mouthOutlineRef} className="mouthOutline" fill="none" stroke="#3A5E77" strokeWidth="2.5" strokeLinejoin="round" d="M100.2,101c-0.4,0-1.4,0-1.8,0c-2.7-0.3-5.3-1.1-8-2.5c-0.7-0.3-0.9-1.2-0.6-1.8 c0.2-0.5,0.7-0.7,1.2-0.7c0.2,0,0.5,0.1,0.6,0.2c3,1.5,5.8,2.3,8.6,2.3s5.7-0.7,8.6-2.3c0.2-0.1,0.4-0.2,0.6-0.2 c0.5,0,1,0.3,1.2,0.7c0.4,0.7,0.1,1.5-0.6,1.9c-2.6,1.4-5.3,2.2-7.9,2.5C101.7,101,100.5,101,100.2,101z" />
                                </g>
                                <path className="nose" ref={noseRef} d="M97.7 79.9h4.7c1.9 0 3 2.2 1.9 3.7l-2.3 3.3c-.9 1.3-2.9 1.3-3.8 0l-2.3-3.3c-1.3-1.6-.2-3.7 1.8-3.7z" fill="#3a5e77" />
                                <g className="arms" clipPath="url(#armMask)">
                                    <g ref={armLRef} className="armL" style={{ visibility: 'visible' }}>
                                        <g ref={twoFingersRef} className="twoFingers">
                                            <path fill="#fff" stroke="#3a5e77" strokeWidth="2.5" d="M123.5,97.8 c-41.4,14.9-84.1,30.7-108.2,35.5L1.2,81c33.5-9.9,71.9-16.5,111.9-21.8" />
                                        </g>
                                    </g>
                                    <g ref={armRRef} className="armR" style={{ visibility: 'visible' }}>
                                        <path fill="#fff" stroke="#3a5e77" strokeWidth="2.5" d="M263.3 96.7c41.4 14.9 84.1 30.7 108.2 35.5l14-52.3C352 70 313.6 63.5 273.6 58.1" />
                                    </g>
                                </g>
                            </svg>
                        </div>
                    </div>

                    <div className="space-y-4">
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
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    id="showPasswordToggle"
                                    onMouseDown={() => {
                                        yetiState.current.showPasswordClicked = true;
                                        yetiState.current.activeElement = "password"; // Keep active
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
                        {loading ? "Logging in..." : "Sign In"}
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>

                <p className="text-center mt-6 text-zinc-500 text-sm font-medium">
                    Don't have an account?{" "}
                    <Link href="/auth/signup" className="text-blue-600 font-bold hover:underline font-semibold text-zinc-900 border-b border-zinc-200 ml-1">Sign Up</Link>
                </p>
            </div>
        </div>
    );
}
