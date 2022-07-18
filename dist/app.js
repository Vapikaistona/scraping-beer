"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// import { pages } from './utils/PagesInfo';
const scraping_birrapedia_1 = require("./catalog/breweries/scraping-birrapedia");
(() => __awaiter(void 0, void 0, void 0, function* () {
    const page = yield scraping_birrapedia_1.getBreweryInfo.startBrowser();
    // for (let index = 2; index < 225; index++) {
    //     await getBreweryInfo.getBreweries(index, page);
    // }
    //await getBreweryInfo.getAllBreweryDetails('https://birrapedia.com/laugar-brewery/e-52f1f0cbd187e42463000010',page);
    yield scraping_birrapedia_1.getBreweryInfo.getBreweries(3, page);
    yield scraping_birrapedia_1.getBreweryInfo.endBrowser();
    console.info('finished!!!');
    function handle(signal) {
        console.log(`Received ${signal}`);
        process.exit();
    }
    process.on('SIGINT', handle);
    process.on('SIGTERM', handle);
}))();
//# sourceMappingURL=app.js.map