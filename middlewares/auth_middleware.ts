import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from '../models/user_schema';


User.schema.pre('save', async function(this: any){
  if (!this.isModified('password')) return;

  this.password = await bcrypt.hash(this.password, 10);
});

