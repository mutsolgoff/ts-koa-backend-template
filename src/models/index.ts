import { IsInt, IsString, Min } from "class-validator"

export class ListPaginationModel {
	@IsInt()
	@Min(0)
	per_page: number = 25
	@IsInt()
	@Min(0)
	current_page: number = 1
	@IsString()
	search: string
	@IsString()
	status: string
}

export class listReturnModel<T> {
	data: T[]
	meta: {
		total: number
		current_page: number
		per_page: number
	}
}

export enum Condition {
	EQUAL = "=",
	NOTEQUAL = "!=",
	LESS = "<",
	GREATER = ">",
	NONE = "",
}

export interface IMysqlWhereCondition {
	column: string
	condition: Condition
	value: unknown
}
