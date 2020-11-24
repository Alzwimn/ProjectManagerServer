var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { SessionTokenDBAccess } from "./SessionTokenDBAccess";
import { UserCredentialsDBAccess } from "./UserCredentialsDBAccess";
export class Authorizer {
    constructor() {
        this.userCredDBAccess = new UserCredentialsDBAccess();
        this.SessionTokenDBAccess = new SessionTokenDBAccess();
    }
    generateToken(account) {
        return __awaiter(this, void 0, void 0, function* () {
            const resultAccount = yield this.userCredDBAccess.getUserCredential(account.username, account.password);
            if (!resultAccount)
                return undefined;
            const token = {
                accessRight: resultAccount.accessRights,
                expirationTime: this.generateExpirationTime(),
                username: resultAccount.username,
                valid: true,
                tokenId: this.generateRandomTokenId()
            };
            yield this.SessionTokenDBAccess.storeSessionToken(token);
            return token;
        });
    }
    generateExpirationTime() {
        return new Date(Date.now() + 60 * 60 * 1000);
    }
    generateRandomTokenId() {
        return Math.random().toString(36).slice(2);
    }
}
