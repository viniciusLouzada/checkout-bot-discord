import mongoose, { Schema } from "mongoose";

const CheckouterSchema = new Schema({
  name: { type: String, required: true },
  discordId: { type: String, required: true, unique: true },
  tegaCount: { type: Number, default: 0 },
});

const Checkouter = mongoose.model("Checkouter", CheckouterSchema);

export default Checkouter;
