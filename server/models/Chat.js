import { Schema, model } from "mongoose";

// const chatSchema = new Schema(
//   {
//     userID: {
//       type: Number,
//     },
//     chatContent: {
//       type: String,
//       unique: true,
//     },
//     sharedUsers: {
//       type: Array,
//     }
//   },
//   {
//     toJSON: {
//       getters: true,
//     },
//     collection: "Chat",
//   }
// );

// // initalize
// const Chat = model("Chat", chatSchema);

// // error handling
// const handleError = (err) => console.log(err);

// // seed?
// Chat.create({
//   userID: 3,
//   chatContent: "Back Squat",
//   sharedUsers: [1]
// })
//   .then((result) => console.log("New Chat log: ", result))
//   .catch((err) => handleError(err));

// //export
// export default Chat;



const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  userID: { type: Number, required: true },
  chatContent: { type: String, required: true },
  collabUsers: { type: [String], default: [] },
});


const Chat = mongoose.model('Chat', chatSchema);

const stud = new Chat({
  roll_no: 1001,
  name: 'Merel Hyde',
  year: 3,
  subjects: ['DBMS', 'OS', 'Graph Theory', 'Internet Programming']
});
stud
  .save()
  .then(
      () => console.log("One entry added"), 
      (err) => console.log(err)
  );

  //export
export default Chat;
module.exports = Chat;