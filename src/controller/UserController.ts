import { UserBusiness } from "../business/UserBusiness";
import { ZodError } from "zod";
import { Request, Response } from "express";
import { BaseError } from "../errors/BaseError";

export class UserController {
  constructor(private userBusiness: UserBusiness) {}

  public signUp = async (req: Request, res: Response) => {
    try {
      const input = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      };

      const result = await this.userBusiness.signup(input);

      res.status(201).send(result);
    } catch (error) {
      console.log(error);

      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("Erro");
      }
    }
  };

  public login = async (req: Request, res: Response) => {
    try {
      const input = {
        email: req.body.email,
        password: req.body.password,
      };

    const username = "usuario"; 
    const password = "senha"; 

const result = await this.userBusiness.login(username, password);


      res.status(200).send(result);
    } catch (error) {
      console.log(error);

      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("Erro");
      }
    }
  };
}
