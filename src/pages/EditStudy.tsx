import { ArrowLeft, Calendar, Plus, Users, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface EditStudyProps {
    studyId: number;
    onBack: () => void;
}

// 기존 스터디 데이터 (실제로는 API에서 가져올 데이터)
const existingStudyData = {
    1: {
        title: "Spring과 함께 백엔드 개발자 되기",
        category: "WEB",
        difficulty: "중급",
        introduction: `Spring Framework를 활용한 백엔드 개발 스터디입니다. 
실무에서 사용되는 Spring Boot, Spring Security, JPA 등을 학습하며 
실제 프로젝트를 통해 백엔드 개발 역량을 키워나갑니다.

초보자도 참여할 수 있도록 기초부터 차근차근 진행하며, 
팀 프로젝트를 통해 협업 경험도 쌓을 수 있습니다.`,
        recruitmentMethod: "지원서",
        maxParticipants: "20",
        schedule: "매주 화, 목 19:00-21:00",
        curriculum: [
            "1주차: Spring Boot 기초 및 환경 설정",
            "2주차: Spring MVC 패턴과 REST API",
            "3주차: 데이터베이스 연동 (JPA, Hibernate)",
            "4주차: Spring Security 인증/인가",
            "5주차: 테스트 코드 작성 (JUnit, Mockito)",
            "6주차: 팀 프로젝트 기획 및 설계",
            "7주차: 팀 프로젝트 개발",
            "8주차: 프로젝트 발표 및 코드 리뷰",
        ],
        requirements: [
            "Java 기초 문법을 알고 있는 분",
            "객체지향 프로그래밍에 대한 기본 이해",
            "데이터베이스 기초 지식 (SQL)",
            "Git 사용 경험 (기초 수준)",
            "매주 정기 모임 참석 가능한 분",
        ],
    },
};

export default function EditStudy({ studyId, onBack }: EditStudyProps) {
    const [formData, setFormData] = useState({
        title: "",
        category: "",
        difficulty: "",
        introduction: "",
        recruitmentMethod: "선착순",
        maxParticipants: "",
        schedule: "",
    });

    const [curriculum, setCurriculum] = useState<string[]>([""]);
    const [requirements, setRequirements] = useState<string[]>([""]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const categories = [
        { value: "WEB", label: "웹 개발" },
        { value: "MOBILE", label: "모바일" },
        { value: "AI", label: "AI/ML" },
        { value: "DATA", label: "데이터" },
        { value: "BACKEND", label: "백엔드" },
        { value: "FRONTEND", label: "프론트엔드" },
        { value: "DEVOPS", label: "DevOps" },
        { value: "DESIGN", label: "디자인" },
    ];

    const difficulties = [
        { value: "입문", label: "입문" },
        { value: "초급", label: "초급" },
        { value: "중급", label: "중급" },
        { value: "고급", label: "고급" },
    ];

    // 기존 데이터 로드
    useEffect(() => {
        const loadStudyData = async () => {
            setIsLoading(true);
            // API 호출 시뮬레이션
            await new Promise((resolve) => setTimeout(resolve, 500));

            const existingData =
                existingStudyData[studyId as keyof typeof existingStudyData];
            if (existingData) {
                setFormData({
                    title: existingData.title,
                    category: existingData.category,
                    difficulty: existingData.difficulty,
                    introduction: existingData.introduction,
                    recruitmentMethod: existingData.recruitmentMethod,
                    maxParticipants: existingData.maxParticipants,
                    schedule: existingData.schedule,
                });
                setCurriculum(existingData.curriculum);
                setRequirements(existingData.requirements);
            }
            setIsLoading(false);
        };

        loadStudyData();
    }, [studyId]);

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const addCurriculumItem = () => {
        setCurriculum((prev) => [...prev, ""]);
    };

    const updateCurriculumItem = (index: number, value: string) => {
        setCurriculum((prev) =>
            prev.map((item, i) => (i === index ? value : item))
        );
    };

    const removeCurriculumItem = (index: number) => {
        setCurriculum((prev) => prev.filter((_, i) => i !== index));
    };

    const addRequirementItem = () => {
        setRequirements((prev) => [...prev, ""]);
    };

    const updateRequirementItem = (index: number, value: string) => {
        setRequirements((prev) =>
            prev.map((item, i) => (i === index ? value : item))
        );
    };

    const removeRequirementItem = (index: number) => {
        setRequirements((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // 폼 검증
        const filteredCurriculum = curriculum.filter(
            (item) => item.trim() !== ""
        );
        const filteredRequirements = requirements.filter(
            (item) => item.trim() !== ""
        );

        if (
            !formData.title ||
            !formData.category ||
            !formData.difficulty ||
            !formData.introduction
        ) {
            alert("필수 항목을 모두 입력해주세요.");
            setIsSubmitting(false);
            return;
        }

        // 스터디 수정 시뮬레이션
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const studyData = {
            ...formData,
            curriculum: filteredCurriculum,
            requirements: filteredRequirements,
        };

        console.log("수정된 스터디:", studyData);
        alert("스터디가 성공적으로 수정되었습니다!");
        setIsSubmitting(false);
        onBack();
    };

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                    <p className="text-gray-600">
                        스터디 정보를 불러오는 중...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
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
                            <img
                                src="/aegis-logo-2500w-opti.png"
                                alt="Aegis Logo"
                                width={56}
                                height={56}
                                className="rounded-full"
                            />
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
                        스터디 수정하기
                    </h1>
                    <p className="text-gray-600">
                        스터디 정보를 수정하고 업데이트하세요.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card className="border-gray-200">
                        <CardHeader>
                            <CardTitle className="font-semibold text-gray-900 text-lg">
                                기본 정보
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label
                                    htmlFor="title"
                                    className="font-medium text-gray-900 text-sm"
                                >
                                    스터디명 *
                                </Label>
                                <Input
                                    id="title"
                                    placeholder="스터디 제목을 입력하세요"
                                    value={formData.title}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "title",
                                            e.target.value
                                        )
                                    }
                                    className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <Label className="font-medium text-gray-900 text-sm">
                                        카테고리 *
                                    </Label>
                                    <Select
                                        value={formData.category}
                                        onValueChange={(value) =>
                                            handleInputChange("category", value)
                                        }
                                    >
                                        <SelectTrigger className="mt-1 border-gray-300 focus:border-blue-500">
                                            <SelectValue placeholder="카테고리를 선택하세요" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem
                                                    key={category.value}
                                                    value={category.value}
                                                >
                                                    {category.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label className="font-medium text-gray-900 text-sm">
                                        난이도 *
                                    </Label>
                                    <Select
                                        value={formData.difficulty}
                                        onValueChange={(value) =>
                                            handleInputChange(
                                                "difficulty",
                                                value
                                            )
                                        }
                                    >
                                        <SelectTrigger className="mt-1 border-gray-300 focus:border-blue-500">
                                            <SelectValue placeholder="난이도를 선택하세요" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {difficulties.map((difficulty) => (
                                                <SelectItem
                                                    key={difficulty.value}
                                                    value={difficulty.value}
                                                >
                                                    {difficulty.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div>
                                <Label
                                    htmlFor="introduction"
                                    className="font-medium text-gray-900 text-sm"
                                >
                                    스터디 소개 *
                                </Label>
                                <Textarea
                                    id="introduction"
                                    placeholder="스터디에 대한 자세한 소개를 작성해주세요"
                                    value={formData.introduction}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "introduction",
                                            e.target.value
                                        )
                                    }
                                    className="mt-1 min-h-[120px] border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                    required
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recruitment Settings */}
                    <Card className="border-gray-200">
                        <CardHeader>
                            <CardTitle className="font-semibold text-gray-900 text-lg">
                                모집 설정
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label className="mb-3 block font-medium text-gray-900 text-sm">
                                    모집 방법
                                </Label>
                                <RadioGroup
                                    value={formData.recruitmentMethod}
                                    onValueChange={(value) =>
                                        handleInputChange(
                                            "recruitmentMethod",
                                            value
                                        )
                                    }
                                    className="flex gap-6"
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem
                                            value="선착순"
                                            id="first-come"
                                        />
                                        <Label
                                            htmlFor="first-come"
                                            className="cursor-pointer text-gray-700 text-sm"
                                        >
                                            선착순 모집
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem
                                            value="지원서"
                                            id="application"
                                        />
                                        <Label
                                            htmlFor="application"
                                            className="cursor-pointer text-gray-700 text-sm"
                                        >
                                            지원서 심사
                                        </Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            <div>
                                <Label
                                    htmlFor="maxParticipants"
                                    className="font-medium text-gray-900 text-sm"
                                >
                                    모집 인원
                                </Label>
                                <div className="mt-1 flex items-center">
                                    <Users className="mr-2 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="maxParticipants"
                                        type="number"
                                        placeholder="최대 인원수"
                                        value={formData.maxParticipants}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "maxParticipants",
                                                e.target.value
                                            )
                                        }
                                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                        min="1"
                                        max="50"
                                    />
                                    <span className="ml-2 text-gray-500 text-sm">
                                        명
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Schedule */}
                    <Card className="border-gray-200">
                        <CardHeader>
                            <CardTitle className="font-semibold text-gray-900 text-lg">
                                일정 정보
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label
                                    htmlFor="schedule"
                                    className="font-medium text-gray-900 text-sm"
                                >
                                    스터디 일정
                                </Label>
                                <div className="mt-1 flex items-center">
                                    <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="schedule"
                                        placeholder="예: 매주 화, 목 19:00-21:00"
                                        value={formData.schedule}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "schedule",
                                                e.target.value
                                            )
                                        }
                                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Curriculum */}
                    <Card className="border-gray-200">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="font-semibold text-gray-900 text-lg">
                                    커리큘럼
                                </CardTitle>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={addCurriculumItem}
                                    className="border-blue-600 bg-transparent text-blue-600 hover:bg-blue-50"
                                >
                                    <Plus className="mr-1 h-4 w-4" />
                                    추가
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {curriculum.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-2"
                                >
                                    <span className="w-8 text-gray-500 text-sm">
                                        {index + 1}.
                                    </span>
                                    <Input
                                        placeholder={`${index + 1}주차 내용을 입력하세요`}
                                        value={item}
                                        onChange={(e) =>
                                            updateCurriculumItem(
                                                index,
                                                e.target.value
                                            )
                                        }
                                        className="flex-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    {curriculum.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                                removeCurriculumItem(index)
                                            }
                                            className="text-gray-400 hover:text-red-500"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Requirements */}
                    <Card className="border-gray-200">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="font-semibold text-gray-900 text-lg">
                                    지원 자격
                                </CardTitle>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={addRequirementItem}
                                    className="border-blue-600 bg-transparent text-blue-600 hover:bg-blue-50"
                                >
                                    <Plus className="mr-1 h-4 w-4" />
                                    추가
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {requirements.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-2"
                                >
                                    <span className="text-gray-500 text-sm">
                                        •
                                    </span>
                                    <Input
                                        placeholder="지원 자격 조건을 입력하세요"
                                        value={item}
                                        onChange={(e) =>
                                            updateRequirementItem(
                                                index,
                                                e.target.value
                                            )
                                        }
                                        className="flex-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    {requirements.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                                removeRequirementItem(index)
                                            }
                                            className="text-gray-400 hover:text-red-500"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Submit Buttons */}
                    <div className="flex justify-end gap-3 pt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onBack}
                            className="border-gray-300 bg-transparent text-gray-700"
                        >
                            취소
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="min-w-[120px] bg-blue-600 text-white hover:bg-blue-700"
                        >
                            {isSubmitting ? "수정 중..." : "수정 완료"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
