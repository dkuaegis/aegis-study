import { ArrowLeft, Calendar, Crown, Mail, User, UserX } from "lucide-react";
import { useState } from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StudyMember {
    id: string;
    name: string;
    email: string;
    joinedAt: string;
    role: "스터디원" | "스터디장";
    status?: "active";
}

interface StudyMembersProps {
    studyId: number;
    onBack: () => void;
}

const studyMembersData: Record<
    number,
    {
        studyTitle: string;
        owner: StudyMember;
        members: StudyMember[];
    }
> = {
    1: {
        studyTitle: "Spring과 함께 백엔드 개발자 되기",
        owner: {
            id: "user123",
            name: "김스터디",
            email: "kim.study@example.com",
            joinedAt: "2024-01-01",
            role: "스터디장",
        },
        members: [
            {
                id: "user456",
                name: "이자바",
                email: "lee.java@example.com",
                joinedAt: "2024-01-15",
                role: "스터디원",
                status: "active",
            },
            {
                id: "user789",
                name: "박스프링",
                email: "park.spring@example.com",
                joinedAt: "2024-01-16",
                role: "스터디원",
                status: "active",
            },
            {
                id: "user101",
                name: "최코딩",
                email: "choi.coding@example.com",
                joinedAt: "2024-01-18",
                role: "스터디원",
                status: "active",
            },
            {
                id: "user202",
                name: "정개발",
                email: "jung.dev@example.com",
                joinedAt: "2024-01-20",
                role: "스터디원",
                status: "active",
            },
        ],
    },
};

export default function StudyMembers({ studyId, onBack }: StudyMembersProps) {
    const [members, setMembers] = useState(
        studyMembersData[studyId as keyof typeof studyMembersData]?.members ||
            []
    );

    const studyInfo =
        studyMembersData[studyId as keyof typeof studyMembersData];

    if (!studyInfo) {
        return <div>스터디를 찾을 수 없습니다.</div>;
    }

    const handleKickMember = (memberId: string) => {
        setMembers((prev) => prev.filter((member) => member.id !== memberId));
        alert("스터디원이 추방되었습니다.");
    };

    const allMembers = [studyInfo.owner, ...members];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="border-gray-200 border-b bg-white px-6 py-4">
                <div className="flex items-center">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onBack}
                        className="mr-4 text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeft className="mr-1 h-4 w-4" />
                        뒤로가기
                    </Button>
                    <div className="flex items-center">
                        <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-black">
                            <span className="font-bold text-sm text-white">
                                A
                            </span>
                        </div>
                        <span className="font-bold text-gray-900 text-xl">
                            Aegis
                        </span>
                    </div>
                </div>
            </header>

            <div className="mx-auto max-w-4xl p-6">
                <div className="mb-6">
                    <h1 className="mb-2 font-bold text-3xl text-gray-900">
                        스터디원 관리
                    </h1>
                    <p className="text-gray-600">{studyInfo.studyTitle}</p>
                </div>

                <Card className="border-gray-200">
                    <CardHeader>
                        <CardTitle className="font-semibold text-gray-900 text-lg">
                            스터디원 목록
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {allMembers.map((member) => (
                                <MemberCard
                                    key={member.id}
                                    member={member}
                                    onKick={handleKickMember}
                                    isOwner={member.role === "스터디장"}
                                />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function MemberCard({
    member,
    onKick,
    isOwner,
}: {
    member: StudyMember;
    onKick: (memberId: string) => void;
    isOwner: boolean;
}) {
    return (
        <Card className="border-gray-200">
            <CardContent className="p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                            {isOwner ? (
                                <Crown className="h-6 w-6 text-blue-600" />
                            ) : (
                                <User className="h-6 w-6 text-gray-600" />
                            )}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-gray-900">
                                    {member.name}
                                </h3>
                                <Badge
                                    variant="secondary"
                                    className={
                                        isOwner
                                            ? "bg-blue-100 text-blue-800"
                                            : "bg-gray-100 text-gray-800"
                                    }
                                >
                                    {member.role}
                                </Badge>
                            </div>
                            <div className="mt-1 flex items-center text-gray-500 text-sm">
                                <Mail className="mr-1 h-4 w-4" />
                                {member.email}
                            </div>
                            <div className="mt-1 flex items-center text-gray-500 text-sm">
                                <Calendar className="mr-1 h-4 w-4" />
                                가입일: {member.joinedAt}
                            </div>
                        </div>
                    </div>

                    {!isOwner && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-red-600 bg-transparent text-red-600 hover:bg-red-50"
                                >
                                    <UserX className="mr-1 h-4 w-4" />
                                    추방
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        스터디원 추방
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        {member.name}님을 스터디에서
                                        추방하시겠습니까? 이 작업은 되돌릴 수
                                        없습니다.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>취소</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() => onKick(member.id)}
                                        className="bg-red-600 hover:bg-red-700"
                                    >
                                        추방하기
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
