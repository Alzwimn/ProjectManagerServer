import { parse } from "url";
export class Utils {
    static getUrlBasePath(url) {
        if (!url)
            return "";
        const parsedUrl = parse(url);
        return parsedUrl.pathname.split("/")[1];
    }
}
