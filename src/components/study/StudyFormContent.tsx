import { useState } from "react";
import StudyConfirmationDialog from "@/components/study/StudyConfirmationDialog";
import StudyFormFields from "@/components/study/StudyFormFields";
import { Button } from "@/components/ui/button";
import { useStudyFormContext } from "@/hooks/useStudyForm";

interface StudyFormContentProps {
    onCancel: () => void;
    submitText: string;
    submittingText: string;
}

const StudyFormContent = ({
    onCancel,
    submitText,
    submittingText,
}: StudyFormContentProps) => {
    const { form, onSubmit } = useStudyFormContext();
    const [confirmOpen, setConfirmOpen] = useState(false);

    return (
        <form
            className="space-y-6"
            onSubmit={form.handleSubmit(() => setConfirmOpen(true))}
        >
            <StudyFormFields />
            <div className="flex justify-end gap-3 pt-6">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    className="group relative min-w-[120px] overflow-hidden border-gray-200 bg-transparent text-gray-700 transition-colors hover:bg-gray-200"
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
                    <span className="relative z-10">취소</span>
                </Button>
                <StudyConfirmationDialog
                    onConfirm={form.handleSubmit(onSubmit)}
                    isSubmitting={form.formState.isSubmitting}
                    submitText={submitText}
                    submittingText={submittingText}
                    open={confirmOpen}
                    onOpenChange={setConfirmOpen}
                >
                    <Button
                        type="button"
                        disabled={form.formState.isSubmitting}
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
                            {form.formState.isSubmitting
                                ? submittingText
                                : submitText}
                        </span>
                    </Button>
                </StudyConfirmationDialog>
            </div>
        </form>
    );
};

export default StudyFormContent;
