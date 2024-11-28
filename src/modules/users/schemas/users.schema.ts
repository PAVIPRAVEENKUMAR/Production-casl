import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument ,Schema as MongooseSchema} from 'mongoose';


export type UserDocument = HydratedDocument<User>;
@Schema()
export class User  {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  role: MongooseSchema.Types.ObjectId;
}
export const UserSchema = SchemaFactory.createForClass(User);