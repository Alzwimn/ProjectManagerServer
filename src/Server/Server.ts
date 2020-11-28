import {createServer, IncomingMessage, ServerResponse} from "http";
import { Authorizer } from "../Authorization/Authorizer";
import { UsersDBAccess } from "../User/UsersDBAccess";
import { LoginHandler } from "./LoginHandler";
import { UsersHandler } from "./UserHandler";
import {Utils} from "./Utils"
export class Server {

    private authorizer: Authorizer = new Authorizer()

    public createServer(){
        createServer(async (req: IncomingMessage, res: ServerResponse) => {
                console.log("got request from: " + req.url)
                this.addCorsHeader(res)
                const basePath = Utils.getUrlBasePath(req.url)

                switch (basePath) {
                    case "login":
                            await new LoginHandler(req, res, this.authorizer).handleRequest()
                        break

                    case "users":
                            await new UsersHandler(req, res, this.authorizer).handleRequest()
                        break
                
                    default:
                        break
                }

                res.end()
            }
        ).listen(8080)

        console.log("Server started")
    }

    private addCorsHeader(res: ServerResponse) {
        res.setHeader("access-control-allow-origin", "*")
        res.setHeader("access-control-allow-headers", "*")
        res.setHeader("access-control-allow-methods", "*")
    }
}