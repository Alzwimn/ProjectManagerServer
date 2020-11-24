import { UserCredentialsDBAccess } from "../src/Authorization/UserCredentialsDBAccess";
import { UsersDBAccess } from "../src/User/UsersDBAccess";
class DbTest {
    constructor() {
        this.dbAccess = new UserCredentialsDBAccess();
        this.userDbAccess = new UsersDBAccess();
    }
}
// new DbTest().dbAccess.putUserCredential({
//     username: "user1",
//     password: "password1",
//     accessRights: [1,2,3]
// })
new DbTest().userDbAccess.putUser({
    age: 30,
    email: "teste@teste.com",
    id: "isajd1",
    name: "John Abc",
    workingPosition: 3
});
