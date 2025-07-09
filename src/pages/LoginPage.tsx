import { useEffect, useRef } from "react";
import { Lock, Globe, CodeXml, Gamepad2, BrainCircuit } from "lucide-react";
import gsap from "gsap";
import { Button } from "@/components/ui/button";
import Header from "@/components/ui/Header";

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
    }, [iconRefs.forEach]);

    return (
        <div className="min-h-screen bg-[#F2F3F8]">
            <Header />

            <main className="flex min-h-[80vh] flex-col items-center justify-center px-8 py-16">
                <div className="mx-auto flex max-w-2xl flex-col items-center space-y-8 text-center">
                    <div className="mb-8 flex flex-row gap-8">
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

                    <p className="mb-8 text-gray-900 text-xl leading-relaxed">
                        Aegis는 단국대학교 학생들을 위해<br />
                        개발에 쉽게 입문할 수 있는 기회를 제공해요.
                    </p>

                    <Button className="h-12 w-full py-0 text-xl" asChild>
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