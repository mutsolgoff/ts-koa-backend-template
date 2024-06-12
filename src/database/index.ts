import mysql from "mysql2"

export default mysql.createPool({
	host: Bun.env.DB_HOST,
	user: Bun.env.DB_USER,
	port: Bun.env.DB_PORT,
	password: Bun.env.DB_PASSWORD,
	database: Bun.env.DB_NAME,
})
