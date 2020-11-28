import { IncomingMessage, ServerResponse } from "http";
import { AccessRight, HTTP_CODES, HTTP_METHODS, User } from "../Shared/Model";
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
                break
            case HTTP_METHODS.OPTIONS:
                this.res.writeHead(HTTP_CODES.OK)
                break    
            case HTTP_METHODS.PUT:
                await this.handlePut()
                break
            case HTTP_METHODS.DELETE:
            await this.handleDelete()
            break
            default:
                this.handleNotFound()
                break
        }
    }

    private async handleDelete(): Promise<any> {
        const operationAuthorized = await this.operationAuthorized(AccessRight.DELETE)
        if(!operationAuthorized) {
            this.respondUnauthorized("Missing or invalid authentication")
            return
        }
        const parsedUrl = Utils.getUrlParameters(this.req.url)
        if(!parsedUrl) {
            this.respondBadRequest("User id not present in request")
            return
        }
        if(parsedUrl.query.id){
            const deleteResult = await this.usersDBAccess.deleteUser(parsedUrl.query.id as string)
            if(!deleteResult) {
                this.respondText(HTTP_CODES.NOT_FOUND, `User ${parsedUrl.query.id} was not delete`)
                return
            }
            this.respondText(HTTP_CODES.OK, `User ${parsedUrl.query.id} delete`)
            return
        }
    }

    private async handlePut(): Promise<any> {
        const operationAuthorized = await this.operationAuthorized(AccessRight.CREATE)
        if(!operationAuthorized) {
            this.respondUnauthorized("Missing or invalid authentication")
            return
        }
        try {
            const user: User = await this.getRequestBody()
            await this.usersDBAccess.putUser(user)
            this.respondText(HTTP_CODES.CREATED, `User ${user.name} created`)
        } catch (error) {
            this.respondBadRequest(error.message)
        }
    }

    private async handleGet(): Promise<any> {
        const operationAuthorized = await this.operationAuthorized(AccessRight.READ)
        if(!operationAuthorized) {
            this.respondUnauthorized("Missing or invalid authentication")
            return
        }

        const parsedUrl = Utils.getUrlParameters(this.req.url)
        if(!parsedUrl) {
            this.respondBadRequest("User id not present in request")
            return
        }
        let user: User | undefined
        if(parsedUrl.query.id){
            user = await this.usersDBAccess.getUserById(parsedUrl.query.id as string)
        }
        if(parsedUrl.query.name) {
            user = await this.usersDBAccess.getUserByName(parsedUrl.query.name as string)
        }
        if(user){
            this.respondJsonObjects(HTTP_CODES.OK, user)
            return
        }
        this.handleNotFound()
    }
    
    public async operationAuthorized(operation: AccessRight): Promise<boolean> {
        const token = this.req.headers.authorization
        if(!token) return false;
        const tokenRights = await this.tokenValidator.validateToken(token)
        if(!tokenRights.accessRight.includes(operation)) return false
        return true
    }
}