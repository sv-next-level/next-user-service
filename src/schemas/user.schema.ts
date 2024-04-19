import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import { PORTAL, USER_STATUS } from "@/constants";

@Schema({
  timestamps: true,
})
export class User {
  @Prop({ type: String, unique: true, required: true })
  email: string;

  @Prop({ type: [String], enum: PORTAL, required: true })
  portal: PORTAL[];

  @Prop({
    type: String,
    enum: USER_STATUS,
    default: USER_STATUS.ACTIVE,
  })
  status: USER_STATUS;
}

export const userSchema = SchemaFactory.createForClass(User);

export type userDocument = User & Document & { _id: string };

export const USER_MODEL = User.name;
