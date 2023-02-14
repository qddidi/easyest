import run from "../utils/run";
import { pkgPath } from "../utils/paths";
export const buildComponent = async () => {
  run("pnpm run release", `${pkgPath}/easyest`);
};
