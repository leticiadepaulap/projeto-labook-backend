import { SignupInputDTO, SignupOutputDTO } from "../DTOs/user/signup.dto";
import { UserDatabase } from "../database/UserDatabase";
import { BadRequestError } from "../errors/BadRequestError";
import { TokenPayload, USER_ROLES, User } from "../models/User";
import { HashManager } from "../services/HashManager";
import { IdGenerator } from "..//idGenerator";
import { TokenManager } from "../services/TokenManager";

export class UserBusiness {
  constructor(
    private userDatabase: UserDatabase,
    private idGenerator: IdGenerator,
    private tokenManager: TokenManager,
    private hashManager: HashManager
  ) {}

  public getUsers = async (
    q: string,
    token: string
  ): Promise<User[]> => {
    // Verifica se o token é válido e se o usuário tem permissão de administrador
    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new BadRequestError("Token inválido");
    }

    if (payload.role !== USER_ROLES.ADMIN) {
      throw new BadRequestError(
        "Somente administradores podem acessar esse recurso"
      );
    }

    // Obtém os usuários do banco de dados com base na consulta 'q'
    const usersDB = await this.userDatabase.findUsersById(q);

    // Converte os usuários do formato de banco de dados para o formato de negócios
    const users = usersDB.map((userDB) => {
      const user = new User(
        userDB.id,
        userDB.name,
        userDB.email,
        userDB.password,
        userDB.role,
        userDB.created_at
      );

      return user.toBusinessModel();
    });

    return users;
  };

  public signup = async (
    input: SignupInputDTO
  ): Promise<SignupOutputDTO> => {
    // Extrai as informações de entrada
    const { name, email, password } = input;

    // Verifica se o email já está sendo usado por outro usuário
    const userDBExist = await this.userDatabase.findByEmail(email);
    if (userDBExist) {
      throw new BadRequestError("O email já existe");
    }

    // Gera um novo ID para o usuário
    const id = this.idGenerator.generate();

    // Criptografa a senha do usuário
    const hashedPassword = await this.hashManager.hash(password);

    // Cria um novo usuário com as informações fornecidas
    const newUser = new User(
      id,
      name,
      email,
      hashedPassword,
      USER_ROLES.NORMAL,
      new Date().toISOString()
    );

    // Converte o novo usuário para o formato de banco de dados
    const newUserDB = newUser.toDBModel();

    // Insere o novo usuário no banco de dados
    await this.userDatabase.insertUser(newUserDB);

    // Gera um token de autenticação para o novo usuário
    const payload: TokenPayload = {
      id: newUser.getId(),
      name: newUser.getName(),
      role: newUser.getRole(),
    };
    const token = this.tokenManager.createToken(payload);

    // Retorna o token gerado como saída
    const output: SignupOutputDTO = {
      token,
    };

    return output;
  };

  public login = async (
    email: string,
    password: string
  ): Promise<string> => {
    // Verifica se o usuário com o email fornecido existe no banco de dados
    const userDB = await this.userDatabase.findByEmail(email);

    if (!userDB) {
      throw new BadRequestError("Email e/ou senha inválidos");
    }

    // Cria uma instância de usuário com as informações do banco de dados
    const user = new User(
      userDB.id,
      userDB.name,
      userDB.email,
      userDB.password,
      userDB.role,
      userDB.created_at
    );

    // Verifica se a senha fornecida está correta
    const hashedPassword = user.getPassword();
    const isPasswordCorrect = await this.hashManager.compare(
      password,
      hashedPassword
    );

    if (!isPasswordCorrect) {
      throw new BadRequestError("Email e/ou senha inválidos");
    }

    // Gera um token de autenticação para o usuário
    const payload: TokenPayload = {
      id: user.getId(),
      name: user.getName(),
      role: user.getRole(),
    };
    const token = this.tokenManager.createToken(payload);

    return token;
  };
}
