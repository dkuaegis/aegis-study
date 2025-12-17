import { gsap } from "gsap";
import { BrainCircuit, CodeXml, Gamepad2, Globe, Lock } from "lucide-react";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const LoginPage = () => {
    const iconsRef = useRef<(HTMLDivElement | null)[]>([]);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLParagraphElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const tl = gsap.timeline({ delay: 0.3 });

        gsap.set([titleRef.current, subtitleRef.current, buttonRef.current], {
            opacity: 0,
            y: 20,
        });

        gsap.set(iconsRef.current, {
            opacity: 0,
            x: -50,
            scale: 0.9,
        });

        gsap.set(cardRef.current, {
            scale: 0.95,
            opacity: 1,
        });

        tl.to(cardRef.current, {
            scale: 1,
            duration: 0.5,
            ease: "power2.out",
        })
            .to(
                titleRef.current,
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    ease: "power2.out",
                },
                "-=0.2"
            )
            .to(
                subtitleRef.current,
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    ease: "power2.out",
                },
                "-=0.3"
            )
            .to(
                buttonRef.current,
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    ease: "power2.out",
                },
                "-=0.5" // subtitle과 버튼이 동시에 등장하도록 offset을 동일하게 맞춤
            )
            .to(
                iconsRef.current,
                {
                    opacity: 1,
                    x: 0,
                    scale: 1,
                    duration: 0.5,
                    stagger: 0.1,
                    ease: "back.out(1.4)",
                },
                "-=0.2"
            );
        return () => {
            tl.kill();
            // Reset elements to initial state on cleanup
            if (titleRef.current)
                gsap.set(titleRef.current, { opacity: 0, y: 20 });
            if (subtitleRef.current)
                gsap.set(subtitleRef.current, { opacity: 0, y: 20 });
            if (buttonRef.current)
                gsap.set(buttonRef.current, { opacity: 0, y: 20 });
            if (iconsRef.current) {
                iconsRef.current.filter(Boolean).forEach((el) => {
                    gsap.set(el, { opacity: 0, x: -50, scale: 0.9 });
                });
            }
            if (cardRef.current)
                gsap.set(cardRef.current, { scale: 0.95, opacity: 1 });
        };
    }, []);

    const icons = [
        {
            id: "lock",
            Icon: Lock,
            color: "text-gray-900",
            bg: "bg-white",
            shadow: "hover:shadow-gray-300",
        },
        {
            id: "globe",
            Icon: Globe,
            color: "text-gray-900",
            bg: "bg-white",
            shadow: "hover:shadow-gray-300",
        },
        {
            id: "codeXml",
            Icon: CodeXml,
            color: "text-gray-900",
            bg: "bg-white",
            shadow: "hover:shadow-gray-300",
        },
        {
            id: "gamepad",
            Icon: Gamepad2,
            color: "text-gray-900",
            bg: "bg-white",
            shadow: "hover:shadow-gray-300",
        },
        {
            id: "braincircuit",
            Icon: BrainCircuit,
            color: "text-gray-900",
            bg: "bg-white",
            shadow: "hover:shadow-gray-300",
        },
    ];

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 p-4">
            <div className="absolute inset-0 opacity-[0.02]">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, black 1px, transparent 0)`,
                        backgroundSize: "20px 20px",
                    }}
                ></div>
            </div>

            <Card
                ref={cardRef}
                className="w-full max-w-md border border-gray-200/50 bg-white/90 shadow-2xl shadow-gray-500/10 backdrop-blur-sm"
            >
                <CardContent className="p-8">
                    <div className="space-y-8 text-center">
                        <div className="space-y-3">
                            <h2
                                ref={titleRef}
                                className="font-bold text-3xl text-gray-900 opacity-0"
                            >
                                환영합니다
                            </h2>
                            <p
                                ref={subtitleRef}
                                className="text-gray-600 leading-relaxed opacity-0"
                            >
                                Aegis는 단국대학교 학생들을 위해
                                <br />
                                개발에 쉽게 입문할 수 있는 기회를 제공해요.
                            </p>
                        </div>
                        <div className="flex justify-center gap-4">
                            {icons.map((item, index) => (
                                <div
                                    key={item.id}
                                    ref={(el) => {
                                        iconsRef.current[index] = el;
                                    }}
                                    className={`h-14 w-14 ${item.bg} flex items-center justify-center rounded-2xl transition-all duration-300 hover:scale-110 ${item.shadow} cursor-pointer border border-gray-200/50 opacity-0 hover:shadow-lg`}
                                >
                                    <item.Icon
                                        className={`h-7 w-7 ${item.color}`}
                                    />
                                </div>
                            ))}
                        </div>

                        <Button
                            ref={buttonRef}
                            className="h-12 w-full py-0 text-xl opacity-0"
                            asChild
                        >
                            <a
                                href={`${import.meta.env.VITE_API_URL}/oauth2/authorization/google`}
                            >
                                단국대 Gmail로 로그인
                            </a>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default LoginPage;
