import { IEnvKeys } from "../../definitions/IEnv";
import * as dotenv from "dotenv";
import * as process from "process";

if (window === undefined) dotenv.config();

export const getEnv = (
    key: IEnvKeys,
    type?: StringConstructor | NumberConstructor | BooleanConstructor
) => {
    const envStore = (window === undefined) ? process.env : import.meta.env;
    return (type ?? (String as any))(envStore[`VITE_${key}`]);
}