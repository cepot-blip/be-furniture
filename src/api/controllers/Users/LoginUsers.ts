import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import cryptojs from "crypto-js";
import dotenv from "dotenv";
import userService from "../../../libs/services/Users";
import AuthenticationError from "../../../utils/exceptions/AuthenticationError";
import NotFoundError from "../../../utils/exceptions/NotFoundError";
import UserValidation from "../../../validation/Users";

dotenv.config();

const salt = bcrypt.genSaltSync(10);

export const loginUsers = async (
  req: Request,
  res: Response
): Promise<Response | any> => {
  const { email, phone_number, password } = req.body;

  if (!email && !phone_number) {
    throw new NotFoundError("Email or Phone Number must be provided!");
  }

  if (email) {
    UserValidation.validateLoginUser({ email, password });
  } else if (phone_number) {
    UserValidation.validateLoginUser({ phone_number, password });
  }

  const where: { email?: string; phone_number?: string } = {};
  if (email) {
    where.email = email;
  } else if (phone_number) {
    where.phone_number = phone_number;
  }

  const usersCheck = await userService.getUserByCredentials(where);

  if (!usersCheck) {
    throw new NotFoundError(
      `${where.email ? "Email" : "Phone Number"} not found!`
    );
  }

  const comparePassword = bcrypt.compareSync(password, usersCheck.password);
  if (!comparePassword) {
    throw new AuthenticationError("Incorrect Password");
  }

  // Buat JWT token
  const token = jwt.sign(
    {
      app_name: process.env.APP_NAME,
      id: usersCheck.id,
      email: usersCheck.email,
      role: usersCheck.role,
    },
    process.env.API_SECRET as string,
    {
      expiresIn: "1d",
    }
  );

  const hashToken = cryptojs.AES.encrypt(
    token,
    process.env.API_SECRET as string
  ).toString();

  return res.status(200).json({
    success: true,
    token: hashToken,
  });
};
