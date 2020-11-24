import { Account, SessionToken, TokenGenerator } from "../Server/Model";
import { UserCredentialsDBAccess } from "./UserCredentialsDBAccess";

export class Authorizer implements TokenGenerator {

    private userCredDBAccess: UserCredentialsDBAccess = new UserCredentialsDBAccess()
    
    public async generateToken(account: Account): Promise<SessionToken | undefined> {
        const resultAccount = await this.userCredDBAccess.getUserCredential(
            account.username, account.password
        )
        if(!resultAccount) return undefined
        return {
            tokenId: "someTokenId"
        }    
    }
}