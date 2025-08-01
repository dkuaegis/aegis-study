import { ArrowLeft } from "lucide-react";
import { Button } from "./button";
import React from "react";

interface HeaderProps {
  title: string;
  onBack?: () => void;
  right?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title, onBack, right }) => (
  <header className="border-gray-200 border-b bg-white px-6 py-4">
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
        <span className="font-bold text-gray-900 text-xl">{title}</span>
      </div>
      {right && <div className="ml-auto">{right}</div>}
    </div>
  </header>
);

export default Header;
