var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { HTTP_CODES, HTTP_METHODS } from "../Shared/Model";
export class LoginHandler {
    constructor(req, res, tokenGenerator) {
        this.req = req;
        this.res = res;
        this.tokenGenerator = tokenGenerator;
    }
    handleRequest() {
        return __awaiter(this, void 0, void 0, function* () {
            switch (this.req.method) {
                case HTTP_METHODS.POST:
                    yield this.handlePost();
                    break;
                default:
                    this.handleNotFound();
                    break;
            }
        });
    }
    getRequestBody() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                let body = "";
                this.req.on("data", (data) => {
                    body += data;
                });
                this.req.on("end", () => {
                    try {
                        resolve(JSON.parse(body));
                    }
                    catch (error) {
                        reject(error);
                    }
                });
                this.req.on("error", (error) => {
                    reject(error);
                });
            });
        });
    }
    handlePost() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = yield this.getRequestBody();
                const sessionToken = yield this.tokenGenerator.generateToken(body);
                if (!sessionToken) {
                    this.res.statusCode = HTTP_CODES.NOT_FOUND;
                    this.res.write("Wrong username or password");
                    return;
                }
                this.res.statusCode = HTTP_CODES.CREATED,
                    this.res.writeHead(HTTP_CODES.CREATED, {
                        "Content-Type": "application/json"
                    });
                this.res.write(JSON.stringify(sessionToken));
            }
            catch (error) {
                this.res.write("error: " + error.message);
            }
        });
    }
    handleNotFound() {
        return __awaiter(this, void 0, void 0, function* () {
            this.res.statusCode = HTTP_CODES.NOT_FOUND;
            this.res.write("Not Found");
        });
    }
}
