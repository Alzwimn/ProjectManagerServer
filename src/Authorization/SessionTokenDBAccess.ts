import { SessionToken } from "../Server/Model"
import Nedb from "nedb";
import { logInvocation } from "../Shared/MethodDecorators";

export class SessionTokenDBAccess {

    private nedb: Nedb 

    constructor(){
        this.nedb = new Nedb("database/SesssionToken.db")
        this.nedb.loadDatabase()
    }

    @logInvocation
    public async storeSessionToken(token: SessionToken): Promise<void> {
        return new Promise ((resolve, reject) => {
            this.nedb.insert(token, (err: Error | null) => {
                if(err){
                    reject(err)
                    return
                }
                resolve()
            })
        })
    }
    
    @logInvocation
    public async getToken(tokenId: string): Promise<SessionToken | undefined> {
        return new Promise ((resolve, reject) => {
            this.nedb.find({tokenId:tokenId}, (err: Error, docs: any[]) => {
                if(err){
                    reject(err)
                    return
                }
                if(docs.length === 0) {
                    resolve(undefined)
                    return
                }
                resolve(docs[0])
            })
        })
    }
}