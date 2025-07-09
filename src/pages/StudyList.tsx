import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import Header from "@/components/ui/Header"
import { Users, User } from "lucide-react"

interface Study {
    id: number
    title: string
    instructor: string
    introduction: string
    recruitMethod: "FCFS" | "APPLICATION"
    maxMember: string
    schedule: string
    curriculum: string
    qualification: string
    category: "LANGUAGE" | "CS" | "SECURITY" | "GAME" | "WEB"
    closed: boolean
}

function StudyList() {
    const studies: Study[] = [
        {
            id: 1,
            title: "알고리즘 문제풀이 스터디",
            instructor: "42",
            introduction: "매주 알고리즘 문제를 함께 풀며 사고력을 키우는 스터디입니다.",
            recruitMethod: "FCFS",
            maxMember: "10명 이하",
            schedule: "매주 금요일 오후 6시",
            curriculum: "1주차: 그리디, 2주차: DFS/BFS, 3주차: DP...",
            qualification: "기초적인 Python 또는 Java 사용 가능자",
            category: "CS",
            closed: false,
        },
        {
            id: 2,
            title: "Spring과 함께 백엔드 개발자 되기",
            instructor: "42",
            introduction: "매주 알고리즘 문제를 함께 풀며 사고력을 키우는 스터디입니다.",
            recruitMethod: "FCFS",
            maxMember: "10명 이하",
            schedule: "매주 금요일 오후 6시",
            curriculum: "1주차: 그리디, 2주차: DFS/BFS, 3주차: DP...",
            qualification: "기초적인 Python 또는 Java 사용 가능자",
            category: "WEB",
            closed: true,
        }
    ]

    return (
        <div className="min-h-screen bg-[#F2F3F8]">
            <Header />
            <div className="container mx-auto max-w-4xl px-4">
                <div className="mb-8 text-center">
                    <h1 className="mt-8 mb-2 font-bold text-3xl text-gray-900">스터디 목록</h1>
                    <p className="text-gray-600">함께 성장할 스터디를 찾아보세요</p>
                </div>

                <div className="grid gap-4 md:gap-6">
                    {studies.map((study) => (
                        <Card key={study.id} className="cursor-pointer transition-shadow hover:shadow-md">
                            <CardContent className="p-6">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex-1">
                                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                                            <h3 className="font-semibold text-gray-900 text-lg">{study.title}</h3>
                                            <Badge
                                                variant={study.closed ? "destructive" : "default"}
                                                className={
                                                    study.closed
                                                        ? "bg-gray-100 text-gray-800 hover:bg-gray-300"
                                                        : "bg-green-100 text-green-800 hover:bg-green-300"
                                                }
                                            >
                                                {study.closed ? "모집완료" : "모집중"}
                                            </Badge>
                                        </div>

                                        <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <User className="h-4 w-4" />
                                                <span className="text-sm">스터디장: {study.instructor}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Users className="h-4 w-4" />
                                                <span className="text-sm">
                                                    인원 제한: {study.maxMember}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {studies.length === 0 && (
                    <div className="py-12 text-center">
                        <p className="text-gray-500">등록된 스터디가 없습니다.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default StudyList;