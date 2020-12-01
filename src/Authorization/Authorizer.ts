import { Account, SessionToken, TokenGenerator, TokenRigths, TokenState, TokenValidator } from "../Server/Model";
import { logInvocation } from "../Shared/MethodDecorators";
import { countInstances } from "../Shared/ObjectsCounter";
import { SessionTokenDBAccess } from "./SessionTokenDBAccess";
import { UserCredentialsDBAccess } from "./UserCredentialsDBAccess";
@countInstances
export class Authorizer implements TokenGenerator, TokenValidator {

    private userCredDBAccess: UserCredentialsDBAccess = new UserCredentialsDBAccess()
    private SessionTokenDBAccess: SessionTokenDBAccess = new SessionTokenDBAccess()
    
    @logInvocation
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

    public async validateToken(tokenId: string): Promise<TokenRigths> {
        const token = await this.SessionTokenDBAccess.getToken(tokenId)
        if(!token || !token.valid) {
            return {
                accessRight: [],
                state: TokenState.INVALID
            }
        } 
        if(token.expirationTime < new Date()) {
            return {
                accessRight: [],
                state: TokenState.EXPIRED
            }
        }
        return {
            accessRight: token.accessRight,
            state: TokenState.VALID
        }
    }

    private generateExpirationTime() {
        return new Date(Date.now() + 60*60*1000)
    }

    private generateRandomTokenId() {
        return Math.random().toString(36).slice(2)
    }
}