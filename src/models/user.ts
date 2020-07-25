import { Document, model, Schema, Types } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import { PHRASE_MODEL_NAME } from "./phrase";

export const USER_MODEL_NAME = "User";
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phrases: Types.ObjectId[];
}

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phrases: [{ type: Types.ObjectId, required: true, ref: PHRASE_MODEL_NAME }],
});

userSchema.plugin(uniqueValidator);

export default model<IUser>(USER_MODEL_NAME, userSchema);
