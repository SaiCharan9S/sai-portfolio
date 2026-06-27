export {
  buildStaticPortfolio,
  staticPortfolio,
  derivedStats,
} from "./static-portfolio";

// Back-compat for modules that still import portfolio directly
export { staticPortfolio as portfolio } from "./static-portfolio";
