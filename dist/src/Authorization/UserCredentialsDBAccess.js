var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Nedb from "nedb";
export class UserCredentialsDBAccess {
    constructor() {
        this.nedb = new Nedb("database/UserCredentials.db");
        this.nedb.loadDatabase();
    }
    putUserCredential(userCredentials) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.nedb.insert(userCredentials, (err, docs) => {
                    if (err)
                        reject(err);
                    resolve(docs);
                });
            });
        });
    }
    getUserCredential(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.nedb.find({ username: username, password: password }, (err, docs) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    if (docs.length === 0) {
                        resolve(undefined);
                        return;
                    }
                    resolve(docs[0]);
                });
            });
        });
    }
}
