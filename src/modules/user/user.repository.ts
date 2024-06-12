import "reflect-metadata";
import connection from "../../database";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { Service } from "typedi";

interface IUser {
  username: string;
  password: string;
  full_name: string;
  role: number;
  salt: string;
}

@Service()
export class UserRepository {
  create(user: IUser): Promise<number> {
    return new Promise((resolve, reject) => {
      connection.query<ResultSetHeader>(
        `INSERT INTO users(username,password,full_name,role,salt) VALUES(?,?,?,?,?)`,
        [user.username, user.password, user.full_name, user.role, user.salt],
        (err, res) => {
          if (err) reject(err);
          else {
            console.log("user succesfully created");
            resolve(res.insertId);
          }
        }
      );
    });
  }

  findByUsername(username: string): Promise<IUser> {
    return new Promise((resolve, reject) => {
      connection.query<RowDataPacket[]>(
        `select username,password,full_name,role,salt from users where username=?`,
        [username],
        (err, res) => {
          if (err) reject(err);
          else {
            resolve(res?.[0] as IUser);
          }
        }
      );
    });
  }
}
