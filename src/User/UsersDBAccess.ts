import Nedb from "nedb";
import { User } from "../Shared/Model";

export class UsersDBAccess {

    private nedb: Nedb 

    constructor(){
        this.nedb = new Nedb("database/User.db")
        this.nedb.loadDatabase()
    }

    public async putUser(user: User): Promise<void> {
        if(!user.id) {
            user.id = this.generateUserId()
        }
        return new Promise((resolve, reject) => {
            this.nedb.insert(user, (err) => {
                if(err){
                    reject(err)
                    return
                }
                resolve()
            })
        })
    }

    public async getUserById(userId: string): Promise<User | undefined> {
        return new Promise((resolve, reject) => {
            this.nedb.find({id: userId}, (error: Error, docs: any)=> {
                if(error) {
                    reject(error)
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

    public async getUserByName(name: string): Promise<User | undefined> {
        const regEx = new RegExp(name)
        return new Promise((resolve, reject) => {
            this.nedb.find({name: regEx}, (error: Error, docs: any)=> {
                if(error) {
                    reject(error)
                    return
                }
                resolve(docs)
            })
        })
    }

    public async deleteUser(userId: string): Promise<boolean> {
        const operationSuccess = await this.deleteUserFromDb(userId)
        this.nedb.loadDatabase()
        return operationSuccess
    }

    private async deleteUserFromDb(userId: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.nedb.remove({id: userId}, (error: Error | null, numRemoved: number)=> {
                if(error) {
                    reject(error)
                    return
                }
                if(numRemoved === 0) {
                    resolve(false)
                    return
                }
                resolve(true)
            })
        })
    }

    private generateUserId(): string {
        return Math.random().toString(36).slice(2)
    }
}