import { Document, model, Schema, Types } from "mongoose";
import { USER_MODEL_NAME } from "./user";

export const PHRASE_MODEL_NAME = "Phrase";

export interface IPhrase extends Document {
  userId: string;
  phrase: string;
  translations: string[];
  creationDate: number;
}

const phraseSchema = new Schema({
  userId: { type: Types.ObjectId, required: true, ref: USER_MODEL_NAME },
  phrase: { type: String, required: true },
  translations: [{ type: String, required: true }],
  creationDate: { type: Number, required: true },
});

export default model<IPhrase>(PHRASE_MODEL_NAME, phraseSchema);
