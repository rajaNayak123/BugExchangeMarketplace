import mongoose, { Schema, model, models } from "mongoose";
import { IUser } from "./User";

export type BugStatus = "open" | "claimed" | "fixed" | "rejected";

export interface IBug {
  _id: string;
  title: string;
  description: string;
  stackTrace?: string;
  codeSnippet?: string;
  repoLink?: string;
  screenshots?: string[];
  bountyAmount: number;
  tags: string[];
  status: BugStatus;
  poster: Schema.Types.ObjectId | IUser;
  claimer?: Schema.Types.ObjectId | IUser;
  fixDescription?: string;
  fixLink?: string;
  isPaymentReleased: boolean;
  createdAt: Date;
  updatedAt: Date;
  claimedAt?: Date;
  fixedAt?: Date;
}

const BugSchema = new Schema<IBug>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    stackTrace: String,
    codeSnippet: String,
    repoLink: String,
    screenshots: [String],
    bountyAmount: {
      type: Number,
      required: true,
      min: 5,
    },
    tags: {
      type: [String],
      required: true,
    },
    status: {
      type: String,
      enum: ["open", "claimed", "fixed", "rejected"],
      default: "open",
    },
    poster: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    claimer: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    fixDescription: String,
    fixLink: String,
    isPaymentReleased: {
      type: Boolean,
      default: false,
    },
    claimedAt: Date,
    fixedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Create text index for search
BugSchema.index({
  title: "text",
  description: "text",
  tags: "text",
});

export const Bug = models.Bug || model<IBug>("Bug", BugSchema);
