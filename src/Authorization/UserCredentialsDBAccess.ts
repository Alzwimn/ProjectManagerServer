import { UserCredentials } from "../Shared/Model";
import Nedb from "nedb";
import { delayResponse } from "../Shared/MethodDecorators";

export class UserCredentialsDBAccess {

    private nedb: Nedb 

    constructor(){
        this.nedb = new Nedb("database/UserCredentials.db")
        this.nedb.loadDatabase()
    }
    
    public async putUserCredential(userCredentials: UserCredentials): Promise<any>{
        return new Promise((resolve, reject) => {
            this.nedb.insert(userCredentials, (err, docs: any) => {
                if(err) reject(err)
                resolve(docs)
            })
        })
    }
    // @delayResponse(5000)
    public async getUserCredential(username: string, password: string): Promise<UserCredentials | undefined>{
        return new Promise((resolve, reject) => {
            this.nedb.find({username:username, password: password}, 
                (err: Error, docs: UserCredentials[]) => {
                if(err){
                    reject(err)
                    return
                } 

                if(docs.length === 0) {
                    resolve(undefined)
                    return
                } 
                console.log("method finished");
                resolve(docs[0])
            })
        })
    }
}