import { Types } from "mongoose";
import { hash, genSalt, compare } from "bcrypt";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import { USER_MODEL, User } from "@/schemas";

@Schema({
  timestamps: true,
  methods: {
    async isValidPassword(
      this: any,
      candidatePassword: string
    ): Promise<boolean> {
      const hashedPassword: string = this.password;
      const isMatched: boolean = await compare(
        candidatePassword,
        hashedPassword
      );
      return isMatched;
    },
  },
})
export class Password {
  @Prop({
    type: Types.ObjectId,
    ref: USER_MODEL,
    required: true,
  })
  user_id: Types.ObjectId | User;

  @Prop({ type: String, required: true })
  password: string;

  isValidPassword: (candidatePassword: string) => Promise<boolean>;
}

export const passwordSchema = SchemaFactory.createForClass(Password);

export type passwordDocument = Password & Document & { _id: string };

export const PASSWORD_MODEL = Password.name;

passwordSchema.pre("save", async function (next: () => void) {
  const salt = await genSalt(10);
  const hashedPassword = await hash(this.password, salt);
  this.password = hashedPassword;

  next();
});
