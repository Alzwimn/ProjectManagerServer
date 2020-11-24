import { AccessRight } from "../Shared/Model";

export interface Account {
    username: string,
    password: string
}

export interface SessionToken {
    tokenId: string,
    username: string,
    valid: boolean,
    expirationTime: Date,
    accessRight: AccessRight[]
}

export enum TokenState {
    VALID,
    INVALID,
    EXPIRED
}
export interface TokenRigths {
    accessRight: AccessRight[],
    state: TokenState
}

export interface TokenGenerator {
    generateToken(account: Account): Promise<SessionToken | undefined>
}

export interface TokenValidator {
    validateToken(tokenId: string): Promise<TokenRigths>
}