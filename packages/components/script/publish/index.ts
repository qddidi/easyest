import run from "../utils/run";
import { pkgPath } from "../utils/paths";
import { series } from "gulp";
export const publishComponent = async () => {
  run("pnpm run release", `${pkgPath}/easyest`);
};
export default series(async () => publishComponent());
