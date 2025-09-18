import ky, { type Options } from "ky";
export const apiClient = ky.create({
    prefixUrl: import.meta.env.VITE_API_URL,
    credentials: "include",
    hooks: {
        afterResponse: [async (_request: Request, _options: Options, response: Response) => {
            if (response.status === 401) {
                try {
                    window.dispatchEvent(new CustomEvent("unauthorized"));
                } catch {
                    window.location.replace("/");
                }
            }
            return response;
        }],
    },
});
