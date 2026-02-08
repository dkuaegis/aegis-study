import { ArrowLeft } from "lucide-react";
import type React from "react";
import { Button } from "./button";

interface HeaderProps {
    onBack?: () => void;
    right?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ onBack, right }) => (
    <header className="sticky top-0 z-50 border-gray-200 border-b bg-white px-6 py-4">
        <div className="flex items-center">
            {onBack && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onBack}
                    className="mr-4 text-gray-600 hover:text-gray-900"
                >
                    <ArrowLeft className="mr-1 h-4 w-4" />
                    뒤로가기
                </Button>
            )}
            <div className="flex items-center">
                <span
                    className="font-bold text-2xl text-gray-900"
                    style={{ fontFamily: '"Stack Sans Notch", sans-serif' }}
                >
                    AEGIS
                </span>
            </div>
            {right && <div className="ml-auto">{right}</div>}
        </div>
    </header>
);

export default Header;
