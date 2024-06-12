import {
  ListPaginationModel,
  listReturnModel,
  IMysqlWhereCondition,
} from "../models";

export interface BaseRepository<T> {
  findById(tableName: string, id: number): Promise<T>;
  findSome(
    tableName: string,
    pagination: ListPaginationModel,
    conditions: IMysqlWhereCondition[],
    searchColumns: string[]
  ): Promise<listReturnModel<T>>;
  add(tableName: string, entry: T): Promise<number>;
  update(
    tableName: string,
    values: Partial<any>,
    conditions: IMysqlWhereCondition[]
  ): Promise<void>;
  remove(tableName: string, id: number): Promise<void>;
}
