import { UserCredentialsDBAccess } from "../src/Authorization/UserCredentialsDBAccess";
import { UsersDBAccess } from "../src/User/UsersDBAccess";



class DbTest {
    
    public dbAccess: UserCredentialsDBAccess = new UserCredentialsDBAccess()
    public userDbAccess: UsersDBAccess = new UsersDBAccess()
}

// new DbTest().dbAccess.putUserCredential({
//     username: "sirleno",
//     password: "123456",
//     accessRights: [0,1,2,3]
// })

// new DbTest().userDbAccess.putUser({
//     age:24,
//     email: "sirleno@gmail.com",
//     id: "fod3",
//     name: "Sirleno Junior",
//     workingPosition: 3
// })