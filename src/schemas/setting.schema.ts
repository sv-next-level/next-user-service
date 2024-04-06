import mongoose from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import { PORTAL } from "@/constants";
import { USER_MODEL, User } from "@/schemas/user.schema";

@Schema({
  timestamps: true,
})
export class Password {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: USER_MODEL,
    required: true,
  })
  user_id: User;

  @Prop({ type: Object })
  setting: object;

  @Prop({ type: String, enum: PORTAL, required: true })
  portal: PORTAL;
}

export const passwordSchema = SchemaFactory.createForClass(Password);

export type passwordDocument = Password & Document & { _id: string };

export const PASSWORD_MODEL = Password.name;