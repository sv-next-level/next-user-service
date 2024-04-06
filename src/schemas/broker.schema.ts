import mongoose from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import { USER_MODEL, User } from "@/schemas/user.schema";
import { PORTAL, BROKER_STATUS, BROKER } from "@/constants";

@Schema({
  timestamps: true,
})
export class Broker {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: USER_MODEL,
    required: true,
  })
  user_id: User;

  @Prop({
    type: String,
    enum: BROKER,
    required: true,
  })
  broker: BROKER;

  @Prop({
    type: String,
    enum: BROKER_STATUS,
    default: BROKER_STATUS.ACTIVE,
  })
  status: BROKER_STATUS;

  @Prop({ type: String, enum: PORTAL, required: true })
  portal: PORTAL;
}

export const brokerSchema = SchemaFactory.createForClass(Broker);

export type brokerDocument = Broker & Document & { _id: string };

export const BROKER_MODEL = Broker.name;
