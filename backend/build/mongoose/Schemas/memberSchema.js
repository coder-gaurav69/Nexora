import mongoose from "mongoose";
const memberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });
const MemberModel = mongoose.models.Member || mongoose.model("Member", memberSchema);
export default MemberModel;
