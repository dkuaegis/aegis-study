import { Label } from "@radix-ui/react-label";
import {
    Controller,
    type ControllerRenderProps,
    type FieldError,
    get,
    type RegisterOptions,
    useFormContext,
} from "react-hook-form";

interface IProps {
    name: string;
    label: string;
    required?: boolean;
    rules?: RegisterOptions;
    children: (
        field: ControllerRenderProps & { id: string },
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
                    children(
                        { ...field, id: name },
                        {
                            hasError: !!get(errors, name),
                            isDirty: !!get(dirtyFields, name),
                        }
                    )
                }
            />
            {get(errors, name) && (
                <span className="mt-1 block text-red-500 text-xs">
                    {(get(errors, name) as FieldError).message}
                </span>
            )}
        </div>
    );
};

export default FormField;
