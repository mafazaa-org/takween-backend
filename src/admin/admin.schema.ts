import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';

export type AdminDocument = Admin & Document;

@Schema({ timestamps: true })
export class Admin {
  @Prop({ required: true, minlength: 3, maxlength: 50 })
  name: string;

  @Prop({
    required: true,
    index: true,
    unique: true,
    minlength: 7,
    maxlength: 15,
  })
  phone: string;

  @Prop({ required: true, minlength: 8 })
  password: string;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);

// Hash password before saving
AdminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Remove password from JSON responses
AdminSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};
