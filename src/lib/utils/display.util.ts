import chalk from "chalk";

export const displayInfo = (message: string) => {
    console.log(chalk.yellowBright(`[Info] ${message}`));
}

export const doSomeWorkButMakeItPretty = async (
    name: string,
    callback: () => Promise<any>
) => {
    try {
        console.log(chalk.cyan(`[Working] ${name}...`));
        const data = await callback();
        console.log(chalk.greenBright(`[Done] ${name}.`));
        return data;
    } catch (e) {
        console.log(chalk.red(`[Error] ${name}.`));
        console.error(e);
        process.exit(1);
    }
};