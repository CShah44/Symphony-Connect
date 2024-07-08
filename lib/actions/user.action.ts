"use server";

import { connect } from "../database";
import User from "../database/models/user.model";

export async function createUser(user: any) {
  try {
    await connect();

    const newUser = await User.create(user);

    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    throw new Error("Could not create the user in database");
  }
}
