import { Request, Response } from "express";
import AddressValidator from "../../../validation/Address";
import addressService from "../../../libs/services/Address";
import NotFoundError from "../../../utils/exceptions/NotFoundError";
import userService from "../../../libs/services/Users";
import InvariantError from "../../../utils/exceptions/InvariantError";

interface CreateAddressRequest extends Request {
  body: {
    user_id: number;
    street: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
}

export const createAddress = async (
  req: CreateAddressRequest,
  res: Response
): Promise<Response> => {
  const { user_id, street, city, state, postal_code, country } = req.body;
  AddressValidator.validateCreateAddress({
    user_id,
    street,
    city,
    state,
    postal_code,
    country,
  });

  const checkUserId = await userService.getUserById(user_id);

  if (!checkUserId) {
    throw new NotFoundError("User Id Not Found");
  }

  const checkAddressUser = await addressService.getAddressByUserId(user_id);
  if (checkAddressUser && checkAddressUser.id) {
    throw new InvariantError("User id already address");
  }

 const response =  await addressService.createAddress(
    user_id,
    street,
    city,
    state,
    postal_code,
    country
  );

  return res.status(200).json({
    status: true,
    message: "Successfully create address!",
    data: response,
  });
};
