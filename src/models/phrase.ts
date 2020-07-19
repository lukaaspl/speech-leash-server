import { Schema, model, Document, Model } from "mongoose";

export interface IPhrase extends Document {
  userId: string;
  phrase: string;
  creationDate: number;
}

const phraseSchema = new Schema<IPhrase>({
  userId: { type: String, required: true },
  phrase: { type: String, required: true },
  creationDate: { type: Number, required: true },
});

export default model<IPhrase>("Phrase", phraseSchema);
