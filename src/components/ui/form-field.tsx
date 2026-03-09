import { Label } from "@radix-ui/react-label";
import {
    Controller,
    type ControllerRenderProps,
    type FieldError,
    type RegisterOptions,
    useFormContext,
} from "react-hook-form";

interface IProps {
    name: string;
    label: string;
    required?: boolean;
    rules?: RegisterOptions;
    children: (
        field: ControllerRenderProps,
        meta: {
            hasError: boolean;
            isDirty: boolean;
        }
    ) => React.ReactElement;
}

const FormField = ({ name, label, required, children, rules }: IProps) => {
    const {
        control,
        formState: { errors, dirtyFields },
    } = useFormContext();

    return (
        <div>
            <Label htmlFor={name} className="font-medium text-gray-900 text-sm">
                {label} {required && "*"}
            </Label>
            <Controller
                name={name}
                control={control}
                rules={rules}
                render={({ field }) =>
                    children(field, {
                        hasError: !!errors[name],
                        isDirty: !!dirtyFields[name],
                    })
                }
            />
            {errors[name] && (
                <span className="mt-1 block text-red-500 text-xs">
                    {(errors[name] as FieldError).message}
                </span>
            )}
        </div>
    );
};

export default FormField;
