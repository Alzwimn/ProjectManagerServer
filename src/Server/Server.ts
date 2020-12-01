import {createServer, IncomingMessage, ServerResponse} from "http";
import { Authorizer } from "../Authorization/Authorizer";
import { Monitor } from "../Shared/ObjectsCounter";
import { UsersDBAccess } from "../User/UsersDBAccess";
import { LoginHandler } from "./LoginHandler";
import { UsersHandler } from "./UserHandler";
import {Utils} from "./Utils"
export class Server {

    private authorizer: Authorizer = new Authorizer()
    private loginHandler: LoginHandler = new LoginHandler(this.authorizer)
    private userHandler: UsersHandler = new UsersHandler(this.authorizer)

    public createServer(){
        createServer(async (req: IncomingMessage, res: ServerResponse) => {
                console.log("got request from: " + req.url)
                this.addCorsHeader(res)
                const basePath = Utils.getUrlBasePath(req.url)

                switch (basePath) {
                    case "systemInfo":
                            res.write(Monitor.printInstances())
                        break
                    case "login":
                            this.loginHandler.setRequest(req)
                            this.loginHandler.setResponse(res)
                            await this.loginHandler.handleRequest()
                        break

                    case "users":
                            this.userHandler.setRequest(req)
                            this.userHandler.setResponse(res)
                            await this.userHandler.handleRequest()
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