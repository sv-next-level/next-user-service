import mongoose from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import { USER_SCHEMA_NAME, User } from "@/db/mongo/model";
import { BROKER_STATUS, BROKER } from "@/constants";
import { PORTAL } from "@/common/server/portal";

@Schema({
  timestamps: true,
})
export class Broker {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: USER_SCHEMA_NAME,
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

export const BROKER_SCHEMA_NAME = Broker.name;

export const BrokerSchema = SchemaFactory.createForClass(Broker);

export type BrokerDocument = Broker & Document & { _id: string };
