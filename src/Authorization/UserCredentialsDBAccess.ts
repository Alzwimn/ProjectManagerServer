import { UserCredentials } from "../Shared/Model";
import Nedb from "nedb";
import { rejects } from "assert";

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

    public async getUserCredential(username: string, password: string): Promise<UserCredentials | undefined>{
        throw ""
    }
}