// import mongoose from 'mongoose';

// const scoreSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//   },
//   score: {
//     type: Number,
//     required: true,
//   },
//   genre: {
//     type: String,
//     required: true,
//   },
//   correctAnswers: {
//     type: Number,
//     required: true,
//   },
//   totalQuestions: {
//     type: Number,
//     required: true,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// scoreSchema.index({ genre: 1, score: -1 });

// export default mongoose.models.Score || mongoose.model('Score', scoreSchema); 