import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import { PORTAL } from "@/common/server/portal";
import { USER_ACCOUNT_STATUS } from "@/common/status/user";

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
    enum: USER_ACCOUNT_STATUS,
    default: USER_ACCOUNT_STATUS.ACTIVE,
  })
  status: USER_ACCOUNT_STATUS;
}

export const USER_SCHEMA_NAME = User.name;

export const UserSchema = SchemaFactory.createForClass(User);

export type UserDocument = User & Document & { _id: string };
