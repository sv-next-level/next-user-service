import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import { PORTAL } from "@/constants";

@Schema({
  timestamps: true,
})
export class User {
  @Prop({ type: String, unique: true, required: true })
  email: string;

  @Prop({ type: [String], enum: PORTAL, required: true })
  portal: PORTAL[];
}

export const userSchema = SchemaFactory.createForClass(User);

export type userDocument = User & Document & { _id: string };

export const USER_MODEL = User.name;
