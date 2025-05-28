import mongoose, { Schema, model, models } from "mongoose";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  image?: string;
  emailVerified?: Date;
  reputation: number;
  bugsPosted: number;
  bugsFixed: number;
  bio?: string;
  github?: string;
  website?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    image: String,
    emailVerified: Date,
    reputation: {
      type: Number,
      default: 0,
    },
    bugsPosted: {
      type: Number,
      default: 0,
    },
    bugsFixed: {
      type: Number,
      default: 0,
    },
    bio: String,
    github: String,
    website: String,
  },
  {
    timestamps: true,
  }
);

// Create text index for search
UserSchema.index({ name: "text", bio: "text" });

export const User = models.User || model<IUser>("User", UserSchema);
