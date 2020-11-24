import { IncomingMessage, ServerResponse } from "http";
import { AccessRight, HTTP_CODES, HTTP_METHODS } from "../Shared/Model";
import { UsersDBAccess } from "../User/UsersDBAccess";
import { BaseRequestHandler } from "./BaseRequestHandler";
import { TokenValidator } from "./Model";
import { Utils } from "./Utils";


export class UsersHandler extends BaseRequestHandler {

    private usersDBAccess: UsersDBAccess = new UsersDBAccess()
    private tokenValidator: TokenValidator

    public constructor(req: IncomingMessage, res: ServerResponse, tokenValidator: TokenValidator){
        super(req, res)
        this.tokenValidator = tokenValidator
    }
    
    async handleRequest(): Promise<void> {
        switch (this.req.method) {
            case HTTP_METHODS.GET:
                await this.handleGet()
                break;
        
            default:
                this.handleNotFound()
                break;
        }
    }

    private async handleGet(): Promise<any> {
        const parsedUrl = Utils.getUrlParameters(this.req.url)
        if(!parsedUrl) {
            this.respondBadRequest("User id not present in request")
            return
        }
    
        const userId = parsedUrl.query.id
        if(userId){
            const user = await this.usersDBAccess.getUserById(userId as string)
            if(user){
                this.respondJsonObjects(HTTP_CODES.OK, user)
                return
            }
            this.handleNotFound()
        }
    }
    
    public async operationAuthorized(operation: AccessRight): Promise<boolean> {
        const token = this.req.headers.authorization
        if(!token) return false;
        const tokenRights = await this.tokenValidator.validateToken(token)
        if(!tokenRights.accessRight.includes(operation)) return false
        return true
    }
}