var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { createServer } from "http";
import { Authorizer } from "../Authorization/Authorizer";
import { LoginHandler } from "./LoginHandler";
import { Utils } from "./Utils";
export class Server {
    constructor() {
        this.authorizer = new Authorizer();
    }
    createServer() {
        createServer((req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log("got request from: " + req.url);
            const basePath = Utils.getUrlBasePath(req.url);
            switch (basePath) {
                case "login":
                    yield new LoginHandler(req, res, this.authorizer).handleRequest();
                    break;
                case "data":
                    break;
                default:
                    break;
            }
            res.end();
        })).listen(8080);
        console.log("Server started");
    }
}
