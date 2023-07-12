import { IEnvKeys } from "../../definitions/IEnv";
import * as dotenv from "dotenv";
import * as process from "process";

if (typeof window === "undefined") dotenv.config();

export const getEnv = (
    key: IEnvKeys,
    type?: StringConstructor | NumberConstructor | BooleanConstructor
) => {
    const envStore = (typeof window === "undefined") ? process.env : import.meta.env;
    return (type ?? (String as any))(envStore[`VITE_${key}`]);
}