import { Service } from "typedi"
import { createUserModel, credentialsModel } from "./user.model"
import bcrypt from "bcrypt"
import { UserRepository } from "./user.repository"
import { type Context } from "koa"
import jwt, { JwtPayload } from "jsonwebtoken"
import { verifyPassword } from "./user.utilities"

@Service()
export class UserService {
	constructor(private userRepository: UserRepository) {}

	async create(newUser: createUserModel, ctx: Context) {
		const { password, first_name, last_name, ...rest } = newUser
		const salt = bcrypt.genSaltSync(10)
		const hash = bcrypt.hashSync(password, salt)
		const full_name = `${first_name} ${last_name}`

		try {
			const createdUserId = await this.userRepository.create({
				password: hash,
				full_name,
				salt,
				...rest,
			})

			return {
				message: "Пользователь успешно создан",
				created_user_id: createdUserId,
			}
		} catch (error) {
			ctx.status = 500
			return { message: error }
		}
	}

	async login(credentials: credentialsModel, ctx: Context) {
		try {
			const user = await this.userRepository.findByUsername(credentials.username)

			if (!user) {
				ctx.status = 401
				return {
					message: "Invalid email or password",
				}
			}

			const correctPassword = verifyPassword({
				candidatePassword: credentials.password,
				salt: user.salt,
				hash: user.password,
			})

			if (!correctPassword) {
				ctx.status = 401
				return {
					message: "Invalid email or password",
				}
			}

			const { password, salt, ...rest } = user
			const accessToken = jwt.sign(rest, Bun.env.JWT_ACCESS_SECRET_KEY, {
				expiresIn: "15min",
			})
			const refreshToken = jwt.sign(rest, Bun.env.JWT_REFRESH_SECRET_KEY, {
				expiresIn: "2d",
			})
			ctx.cookies.set("jwt", refreshToken, {
				httpOnly: false,
				maxAge: 1000 * 60 * 60 * 24 * 2,
			})
			console.log(ctx.cookies.get("jwt"))
			return {
				accessToken,
			}
		} catch (error) {
			ctx.status = 500
			return error
		}
	}

	logout(token: string) {
		return jwt.verify(token, Bun.env.JWT_ACCESS_SECRET_KEY)
	}

	async refresh(token: string, ctx: Context) {
		const refreshToken = ctx.cookies.get("jwt")
		if (!refreshToken) {
			ctx.status = 401
			return { message: "No refresh token", failed: true }
		}

		const credentials: any = jwt.verify(refreshToken, Bun.env.JWT_REFRESH_SECRET_KEY)

		if (!credentials) {
			ctx.status = 401
			return { message: "No credentials", failed: true }
		}

		const user = await this.userRepository.findByUsername(credentials.username)
		const accessToken = jwt.sign(
			{
				username: user.username,
				full_name: user.full_name,
				role: user.role,
			},
			Bun.env.JWT_ACCESS_SECRET_KEY,
			{
				expiresIn: "15min",
			}
		)

		return {
			accessToken,
		}
	}
}
