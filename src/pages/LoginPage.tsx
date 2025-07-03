import { useEffect, useRef } from "react";
import { Lock, Globe, CodeXml, Gamepad2, BrainCircuit } from "lucide-react";
import gsap from "gsap";
import { Button } from "@/components/ui/button";

function LoginPage() {
    const iconRefs = [
        useRef<HTMLDivElement>(null),
        useRef<HTMLDivElement>(null),
        useRef<HTMLDivElement>(null),
        useRef<HTMLDivElement>(null),
        useRef<HTMLDivElement>(null),
    ];

    useEffect(() => {
        const animations: gsap.core.Tween[] = [];

        iconRefs.forEach((ref, i) => {
            if (ref.current) {
                const animation = gsap.fromTo(
                    ref.current,
                    { x: -100, opacity: 0 },
                    {
                        x: 0,
                        opacity: 1,
                        duration: 1.2,
                        delay: i * 0.3,
                        ease: "power2.out",
                    }
                );
                animations.push(animation);
            }
        });
        return () => {
            animations.forEach(animation => animation.kill());
        };
    }, []);

    return (
        <div className="min-h-screen bg-white">
            <header className="flex items-center px-8 py-4">
                <div className="flex items-center gap-3">
                    <img
                        src="aegis-logo-2500w-opti.png"
                        alt="Aegis Logo"
                        width={56}
                        height={56}
                        className="rounded-full"
                    />
                    <h1 className="text-2xl text-black">Aegis</h1>
                </div>
            </header>

            <main className="flex flex-col items-center justify-center px-8 py-16 min-h-[80vh]">
                <div className="flex flex-col items-center max-w-2xl mx-auto text-center space-y-8">
                    <div className="flex flex-row gap-8 mb-8">
                        <div ref={iconRefs[0]}>
                            <Lock size={80} color="#6366f1" aria-hidden="true" />
                        </div>
                        <div ref={iconRefs[1]}>
                            <Globe size={80} color="#10b981" aria-hidden="true" />
                        </div>
                        <div ref={iconRefs[2]}>
                            <CodeXml size={80} color="#f59e42" aria-hidden="true" />
                        </div>
                        <div ref={iconRefs[3]}>
                            <Gamepad2 size={80} color="#ef4444" aria-hidden="true" />
                        </div>
                        <div ref={iconRefs[4]}>
                            <BrainCircuit size={80} color="#a855f7" aria-hidden="true" />
                        </div>
                    </div>

                    <p className="text-xl text-gray-700 leading-relaxed mb-8">
                        Aegis는 단국대학교 학생들을 위해<br />
                        개발에 쉽게 입문할 수 있는 기회를 제공해요.
                    </p>

                    <Button className="w-full h-12 text-xl py-0" asChild>
                        <a
                            href={`${import.meta.env.VITE_API_URL}/oauth2/authorization/google`}
                        >
                            Google로 로그인
                        </a>
                    </Button>
                </div>
            </main>
        </div>
    );
}

export default LoginPage;