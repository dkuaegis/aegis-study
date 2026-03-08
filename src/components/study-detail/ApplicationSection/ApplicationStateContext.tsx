import { createContext, useContext } from "react";
import type { ApplicationState } from "@/types/application";

const ApplicationStateContext = createContext<ApplicationState | null>(null);

export const useApplicationState = () => {
    const context = useContext(ApplicationStateContext);
    if (!context) {
        throw new Error(
            "useApplicationState must be used within an ApplicationStateProvider"
        );
    }
    return context;
};

export default ApplicationStateContext;
