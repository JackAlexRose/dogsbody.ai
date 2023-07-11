// import { pushToContentful } from "./lib/contentful";
// import { fetchFromGPT, transformGPTResponse } from "./lib/gpt";
import { transformArticle } from "../lib/cli";
// import { getEnv, writeToFile } from "./lib/utils";

const run = async () => {
  // await pushToContentful({
  //   title: "Haydns Test",
  //   url: "https://haydncomley.com/test-page/url-path",
  //   description: "This is a test page!!",
  // });
  await transformArticle(
    "http://www.clearscore.com/learn/managing-money/a-guide-to-debt-consolidation-loans"
  );
};

run();
