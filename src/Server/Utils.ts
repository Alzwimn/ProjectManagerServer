import {parse, UrlWithParsedQuery} from "url"

export class Utils {

    public static getUrlBasePath(url: string | undefined): string{
        if(!url) return ""

        const parsedUrl = parse(url);
        return parsedUrl.pathname!.split("/")[1]
    }

    public static getUrlParameters(url: string | undefined): UrlWithParsedQuery | undefined {
        if(!url) return undefined
        return parse(url, true)
    }
}