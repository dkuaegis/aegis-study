import { Button } from "@/components/ui/button";
import StudyFormFields from "@/components/study/StudyFormFields";
import { useStudyFormContext } from "@/hooks/useStudyForm";

interface StudyFormContentProps {
  onCancel: () => void;
  submitText: string;
  submittingText: string;
}

const StudyFormContent = ({ onCancel, submitText, submittingText }: StudyFormContentProps) => {
  const { form, onSubmit } = useStudyFormContext();
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <StudyFormFields />
      <div className="flex justify-end gap-3 pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="border-gray-300 bg-transparent text-gray-700"
        >
          취소
        </Button>
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="min-w-[120px] bg-blue-600 text-white hover:bg-blue-700"
        >
          {form.formState.isSubmitting ? submittingText : submitText}
        </Button>
      </div>
    </form>
  );
};

export default StudyFormContent;