const { Timestamp } = require("mongodb");

module.exports = (mongoose) => {
  const Meeting = mongoose.model(
    "meeting",
    mongoose.Schema(
      {
        userId: String,
        type: String,
        meetingParticipants: Array,
        meetingStartTime: Number,
        meetingEndTime: Number,
      },
      { timestamps: true }
    )
  );

  return Meeting;
};
//This Mongoose Model represents tutorials collection in MongoDB database.

/* if we want to obtain id instead of _id we should use, but it didnt worked: 
  module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        title: String,
        description: String,
        published: Boolean
      },
      { timestamps: true }
    );
  
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const Tutorial = mongoose.model("tutorial", schema);
    return Tutorial;
  };*/
