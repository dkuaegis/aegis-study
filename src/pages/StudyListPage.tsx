import { BarChart3, Clock, User, Users } from "lucide-react";
import { memo, useCallback } from "react";
import { useStudyListQuery } from "@/api/studyListApi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/ui/Header";
import {
  StudyCategoryLabels,
  StudyLevelLabels,
  type StudyListItem,
} from "@/types/study";

interface StudyCardProps {
  study: StudyListItem;
  onViewStudyDetail: (studyId: number) => void;
}

const StudyCard = memo(({ study, onViewStudyDetail }: StudyCardProps) => {
  const isOpen =
    study.participantCount < study.maxParticipants ||
    study.maxParticipants === 0;

  const handleClick = useCallback(() => {
    onViewStudyDetail(study.id);
  }, [onViewStudyDetail, study.id]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onViewStudyDetail(study.id);
      }
    },
    [onViewStudyDetail, study.id]
  );

  return (
    <Card
      className="w-full min-w-[250px] cursor-pointer border-gray-200 transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={study.title}
    >
      <CardContent className="p-6">
        <div className="space-y-3">
          <div>
            <Badge
              variant="secondary"
              className={
                isOpen
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-800"
              }
            >
              {isOpen ? "모집중" : "모집완료"}
            </Badge>
          </div>

          <h3 className="font-semibold text-gray-900 text-lg leading-tight">
            {study.title}
          </h3>

          <div className="space-y-3 text-gray-600 text-sm">
            <div className="flex items-center">
              <BarChart3 className="mr-2 h-4 w-4" />
              <span>{StudyLevelLabels[study.level]}</span>
            </div>
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              <span>{study.schedule}</span>
            </div>
            <div className="flex items-center">
              <Users className="mr-2 h-4 w-4" />
              <span>
                {study.maxParticipants === 0
                  ? "제한 없음"
                  : `${study.participantCount}/${study.maxParticipants}명`}
              </span>
            </div>
            <div className="flex items-center">
              <User className="mr-2 h-4 w-4" />
              <span>{study.instructor}</span>
            </div>
          </div>

          <div className="flex justify-end">
            <Badge variant="outline" className="border-gray-300 text-gray-600">
              #{StudyCategoryLabels[study.category]}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

StudyCard.displayName = "StudyCard";

interface StudyListMainProps {
  onCreateStudy: () => void;
  onViewStudyDetail: (studyId: number) => void;
}

const StudyList = memo(
  ({ onCreateStudy, onViewStudyDetail }: StudyListMainProps) => {
    const {
      data: studies = [],
      isLoading: loading,
      error,
    } = useStudyListQuery();

    return (
      <div className="flex min-h-screen flex-col bg-gray-50">
        <Header />
        <div className="mb-6 flex w-full justify-end px-6 pt-6">
          <Button
            onClick={onCreateStudy}
            className="group relative overflow-hidden bg-blue-600 text-white transition-colors hover:bg-blue-700"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center"
            >
              <span
                aria-hidden="true"
                className="h-56 w-56 scale-0 transform rounded-full bg-white opacity-0 transition-opacity transition-transform duration-500 ease-out group-hover:scale-100 group-hover:opacity-20 motion-reduce:transform-none motion-reduce:transition-none"
              />
            </span>
            <span className="relative z-10">스터디 개설하기</span>
          </Button>
        </div>
        <main className="mx-auto max-w-none items-center px-6 pb-6 md:px-12 lg:px-24">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              <div className="col-span-full grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={`skeleton-${String(i)}`}
                    className="w-full min-w-[250px] rounded-xl border bg-card py-6 shadow-sm"
                  >
                    <div className="px-6">
                      <div className="space-y-3">
                        <div className="h-5 w-16 rounded-md bg-gray-200 animate-pulse" />
                        <div className="h-6 w-3/4 rounded-md bg-gray-200 animate-pulse" />
                        <div className="space-y-3 text-sm">
                          <div className="flex items-center">
                            <div className="mr-2 h-4 w-4 rounded bg-gray-200 animate-pulse" />
                            <div className="h-4 w-20 rounded bg-gray-200 animate-pulse" />
                          </div>
                          <div className="flex items-center">
                            <div className="mr-2 h-4 w-4 rounded bg-gray-200 animate-pulse" />
                            <div className="h-4 w-32 rounded bg-gray-200 animate-pulse" />
                          </div>
                          <div className="flex items-center">
                            <div className="mr-2 h-4 w-4 rounded bg-gray-200 animate-pulse" />
                            <div className="h-4 w-16 rounded bg-gray-200 animate-pulse" />
                          </div>
                          <div className="flex items-center">
                            <div className="mr-2 h-4 w-4 rounded bg-gray-200 animate-pulse" />
                            <div className="h-4 w-24 rounded bg-gray-200 animate-pulse" />
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <div className="h-5 w-20 rounded border bg-gray-100 animate-pulse" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="col-span-full flex items-center justify-center py-8">
                <div className="text-red-500">
                  스터디 목록을 불러오는데 실패했습니다.
                </div>
              </div>
            ) : studies.length === 0 ? (
              <div className="col-span-full flex items-center justify-center py-8">
                <div className="text-gray-500">개설된 스터디가 없습니다.</div>
              </div>
            ) : (
              studies.map((study: StudyListItem) => (
                <StudyCard
                  key={study.id}
                  study={study}
                  onViewStudyDetail={onViewStudyDetail}
                />
              ))
            )}
          </div>
        </main>
      </div>
    );
  }
);

StudyList.displayName = "StudyList";

export default StudyList;
