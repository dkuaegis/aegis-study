import type React from "react";
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

interface StudyConfirmationDialogProps {
    children: React.ReactNode;
    onConfirm: () => void;
    isSubmitting: boolean;
    submitText: string;
    submittingText: string;
    title?: string;
    description?: string;
}

const StudyConfirmationDialog = ({
    children,
    onConfirm,
    isSubmitting,
    submitText,
    submittingText,
    title = "스터디 개설 확인",
    description = "정말로 개설하시겠습니까?",
}: StudyConfirmationDialogProps) => {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="group relative min-w-[120px] overflow-hidden bg-gray-200 text-gray-700 transition-colors hover:bg-gray-300">
                        <span
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center"
                        >
                            <span
                                aria-hidden="true"
                                className="h-56 w-56 scale-0 transform rounded-full bg-white opacity-0 transition-opacity transition-transform duration-500 ease-out group-hover:scale-100 group-hover:opacity-20 motion-reduce:transform-none motion-reduce:transition-none"
                            />
                        </span>
                        <span className="relative z-10">취소</span>
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        disabled={isSubmitting}
                        className="group relative min-w-[120px] overflow-hidden bg-blue-600 text-white transition-colors hover:bg-blue-700"
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
                        <span className="relative z-10">
                            {isSubmitting ? submittingText : submitText}
                        </span>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default StudyConfirmationDialog;
