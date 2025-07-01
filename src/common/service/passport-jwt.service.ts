import bcrypt from "bcrypt";
import dayjs from "dayjs";
import { type Request } from "express";
import createError from "http-errors";
import jwt, { SignOptions } from "jsonwebtoken";
import passport from "passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Strategy as LocalStrategy } from "passport-local";
import { type IUser } from "../../user/user.dto";
import * as userService from "../../user/user.service";
import { createResponse } from "../helper/response.helper";

export const isValidPassword = async function (
  value: string,
  password: string
) {
  const compare = await bcrypt.compare(value, password);
  return compare;
};

export const initPassport = (): void => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) throw new Error("JWT_SECRET not defined");
  passport.use(
    new Strategy(
      {
        secretOrKey: jwtSecret,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      },
      async (token: { user: Request["user"] }, done) => {
        try {
          done(null, token.user);
        } catch (error) {
          done(error);
        }
      }
    )
  );

  // user login
  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          const user = await userService.getUserByEmail(email, {
            password: true,
            name: true,
            email: true,
            active: true,
            role: true,
            provider: true,
          });
          if (user == null) {
            done(createError(401, "User not found!"), false);
            return;
          }

          if (!user.active) {
            done(createError(401, "User is inactive"), false);
            return;
          }

          if (user.blocked) {
            done(createError(401, "User is blocked, Contact to admin"), false);
            return;
          }

          const validate = await isValidPassword(password, user.password!);
          if (!validate) {
            done(createError(401, "Invalid email or password"), false);
            return;
          }
          const { password: _p, ...rest } = user;
          const result = {
            ...rest,
            provider: user.provider ?? undefined, // ✅ convert null → undefined
          };
          done(null, result, { message: "Logged in Successfully" });
        } catch (error: any) {
          done(createError(500, error.message));
        }
      }
    )
  );
};

export const createUserTokens = (user: Omit<IUser, "password">) => {
  const jwtSecret = process.env.JWT_SECRET as string;
  if (!jwtSecret) throw new Error("JWT_SECRET not defined");

  const payload = {
    userId: user.id, // <- Make sure this is included
    role: user.role,
    name: user.name,
    email: user.email,
    active: user.active,
  };

  const accessToken = jwt.sign(payload, jwtSecret, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY ?? "30m",
  } as SignOptions);

  const refreshToken = jwt.sign(payload, jwtSecret, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY ?? "2d",
  } as SignOptions);

  return { accessToken, refreshToken };
};

export const decodeToken = (token: string) => {
  // const jwtSecret = process.env.JWT_SECRET ?? "";
  const decode = jwt.decode(token) as jwt.JwtPayload;
  const expired = dayjs.unix(decode.exp!).isBefore(dayjs());
  return { ...decode, expired } as IUser & {
    iat: number;
    exp: number;
    expired: boolean;
  };
};

export const verifyToken = (token: string) => {
  const jwtSecret = process.env.JWT_SECRET ?? "";
  const decode = jwt.verify(token, jwtSecret);
  return decode as IUser;
};
