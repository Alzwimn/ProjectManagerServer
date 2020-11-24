import { Account, SessionToken, TokenGenerator } from "../Server/Model";
import { SessionTokenDBAccess } from "./SessionTokenDBAccess";
import { UserCredentialsDBAccess } from "./UserCredentialsDBAccess";

export class Authorizer implements TokenGenerator {

    private userCredDBAccess: UserCredentialsDBAccess = new UserCredentialsDBAccess()
    private SessionTokenDBAccess: SessionTokenDBAccess = new SessionTokenDBAccess()
    
    public async generateToken(account: Account): Promise<SessionToken | undefined> {
        const resultAccount = await this.userCredDBAccess.getUserCredential(
            account.username, account.password
        )
        if(!resultAccount) return undefined

        const token: SessionToken = {
            accessRight: resultAccount.accessRights,
            expirationTime: this.generateExpirationTime(),
            username: resultAccount.username,
            valid: true,
            tokenId: this.generateRandomTokenId()
        }
        await this.SessionTokenDBAccess.storeSessionToken(token)
        return token
    }

    private generateExpirationTime() {
        return new Date(Date.now() + 60*60*1000)
    }

    private generateRandomTokenId() {
        return Math.random().toString(36).slice(2)
    }
}