import { type IMysqlWhereCondition } from "@/models"

export const createSearchConditionQuery = (columns: string[], search: string): string => {
	let ret = `AND (${columns[0]} LIKE '%${search}%'`

	columns.slice(1).forEach((column) => {
		ret += ` OR ${column} LIKE '%${search}%'`
	})
	ret += ")"

	return ret
}

export const createSelectQuery = (
	tableName: string,
	condition: string,
	like: string,
	per_page: number,
	offset: number
) => {
	return `SELECT * FROM ${tableName} ${condition} ${like} ORDER BY id DESC LIMIT ${per_page} OFFSET ${offset}`
}

export const createCountQuery = (tableName: string, condition: string, like: string) => {
	return `SELECT COUNT(*) as count FROM ${tableName} ${condition} ${like}`
}

export const createInsertQuery = (table: string, columns: string[]): string => {
	return `INSERT INTO ${table}(${columns.join(",")}) VALUES(${new Array(columns.length).fill("?")})`
}

export const createWhereClause = (conditions: IMysqlWhereCondition[]) => {
	if (!conditions) return ``

	const condition: string | string[] = []
	for (const c of conditions) {
		condition.push(createCondition(c))
	}
	return `WHERE ${condition.join(" AND ")}`
}

const createCondition = (c: { value: any; column: any; condition: any }) => {
	try {
		let result: string[] | string = []
		if (Array.isArray(c.value)) {
			for (const v of c.value) result.push(`${c.column} ${c.condition} ${v}`)
			return `(${result.join(" OR ")})`
		} else return `${c.column} ${c.condition} ${c.value}`
	} catch (error) {
		console.log(error)
		return ""
	}
}

export const createUpdateQuery = (
	table: string,
	columns: string[],
	conditions: IMysqlWhereCondition[]
): string => {
	columns = columns.map((el) => el + " = ?")

	const condition: string | string[] = createWhereClause(conditions)
	return `UPDATE ${table} SET ${columns.join(",")} ${condition}`
}

export const createDeleteQuery = (table: string, id: number) => {
	return `DELETE from ${table} WHERE id = ${id}`
}

export const toMysqlDateTimeString = (date: Date) => {
	return date.toISOString().slice(0, 19).replace("T", " ")
}
