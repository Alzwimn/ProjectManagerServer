import { IncomingMessage, ServerResponse } from "http";
import { HTTP_CODES } from "../Shared/Model";
import { Account, Handler, TokenGenerator } from "./Model";
export class LoginHandler implements Handler {

    private req: IncomingMessage
    private res: ServerResponse
    private tokenGenerator: TokenGenerator


    public constructor(req: IncomingMessage, res: ServerResponse, tokenGenerator: TokenGenerator){
        this.req = req
        this.res = res
        this.tokenGenerator = tokenGenerator
    }

    public async handleRequest(): Promise<void> {

        try {
            const body = await this.getRequestBody()
            const sessionToken = await this.tokenGenerator.generateToken(body)
            if(!sessionToken){
                this.res.statusCode = HTTP_CODES.NOT_FOUND
                this.res.write("Wrong username or password")
                return
            } 

            this.res.statusCode = HTTP_CODES.CREATED,
            this.res.writeHead(HTTP_CODES.CREATED, {
                "Content-Type": "application/json"
            })
            this.res.write(JSON.stringify(sessionToken))

        } catch (error) {
            this.res.write("error: "+ error.message)
        }
    }

    private async getRequestBody(): Promise<Account> {
        return new Promise((resolve, reject) => {
            let body = ""
            this.req.on("data", (data: string) => {
                body += data
            })
            this.req.on("end", () => {
                try {
                    resolve(JSON.parse(body))
                } catch (error) {
                    reject(error)
                }
            })
            this.req.on("error", (error: any) => {
                reject(error)
            })
        })
    }
}