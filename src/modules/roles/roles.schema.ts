import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RoleDocument = Role & Document;
export type ClaimDocument = Claim & Document;

@Schema()
export class Claim {
  @Prop({ required: true })
  action!: string;

  @Prop({ required: true })
  subject!: string;

  @Prop({ type: Object, default: null })
  conditions?: Record<string, any>;
}

@Schema()
export class Role {
  @Prop({ required: true, unique: true })
  name!: string;

  @Prop({ type: [SchemaFactory.createForClass(Claim)], default: [] })
  claims!: Claim[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);
export const ClaimSchema = SchemaFactory.createForClass(Claim);