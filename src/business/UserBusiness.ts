import { HashManager } from "../services/HashManager";
import { IdGenerator } from "../services/idGenerator";
import { UserDatabase } from "../database/UserDatabase";
import { TokenManager } from "../services/TokenManager";

export class UserBusiness {
    constructor(
        private userDatabase: UserDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager,
        private hashManager: HashManager
    ){}
}