import { SessionToken } from "../Server/Model"
import Nedb from "nedb";

export class SessionTokenDBAccess {

    private nedb: Nedb 

    constructor(){
        this.nedb = new Nedb("database/SesssionToken.db")
        this.nedb.loadDatabase()
    }

    public async storeSessionToken(token: SessionToken): Promise<void> {
        return new Promise ((resolve, reject) => {
            this.nedb.insert(token, (err) => {
                if(err){
                    reject(err)
                    return
                }
                resolve()
            })
        })
    }
}