import { RowDataPacket } from "mysql2";
import {
  ListPaginationModel,
  listReturnModel,
  IMysqlWhereCondition,
} from "../../models";
import { BaseRepository } from "../base.repository";
import connection from "@/database";
import {
  createCountQuery,
  createDeleteQuery,
  createInsertQuery,
  createSearchConditionQuery,
  createSelectQuery,
  createUpdateQuery,
  createWhereClause,
} from "@/utilities/db.utilities";

export class BaseMysqlRepository<T> implements BaseRepository<T> {
  findById(tableName: string, id: number): Promise<T> {
    return new Promise((resolve, reject) => {
      const query = `select * from ${tableName} where id = ${id}`;
      connection.query(query, (err, res: RowDataPacket[]) => {
        if (err) reject(err);

        resolve(res[0] as T);
      });
    });
  }

  findSome(
    tableName: string,
    pagination: ListPaginationModel,
    conditions: IMysqlWhereCondition[],
    searchColumns: string[]
  ): Promise<listReturnModel<T>> {
    return new Promise((resolve, reject) => {
      const offset = pagination.per_page * (pagination.current_page - 1);
      const where = createWhereClause(conditions);
      const like = createSearchConditionQuery(searchColumns, pagination.search);
      const query = createSelectQuery(
        tableName,
        where,
        like,
        pagination.per_page,
        offset
      );
      const countQuery = createCountQuery(tableName, where, like);

      connection.query<any>(countQuery, function (error, results) {
        if (!results[0] || error) reject(error?.message);

        connection.query(query, function (error, res) {
          if (error) reject(error.message);

          resolve({
            data: res as T[],
            meta: {
              total: results[0]?.count,
              per_page: pagination.per_page,
              current_page: pagination.current_page,
            },
          });
        });
      });
    });
  }

  add(tableName: string, entry: T): Promise<number> {
    return new Promise((resolve, reject) => {
      const filtered: Partial<T> = Object.assign({}, entry);
      Object.keys(filtered).forEach(
        (key) =>
          filtered[key as keyof typeof filtered] == null &&
          delete filtered[key as keyof typeof filtered]
      );
      const columns: string[] = Object.keys(filtered);
      columns.pop();
      const query = createInsertQuery(tableName, columns);
      connection.query<any>(
        query,
        [...Object.values(filtered)],
        function (error, results) {
          if (error) {
            reject(error);
          }
          resolve(results.insertId);
        }
      );
    });
  }

  update(
    tableName: string,
    values: Partial<any>,
    conditions: IMysqlWhereCondition[]
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const query = createUpdateQuery(
        tableName,
        Object.keys(values),
        conditions
      );
      connection.query<any>(
        query,
        Object.values(values),
        function (error, results) {
          if (error) {
            reject(error);
          }
          resolve(results);
        }
      );
    });
  }

  remove(tableName: string, id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const query = createDeleteQuery(tableName, id);
      connection.query<any>(query, function (error, results) {
        if (error) {
          reject(error);
        }
        resolve(results);
      });
    });
  }
}
