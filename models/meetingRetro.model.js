const { Timestamp } = require("mongodb");

module.exports = (mongoose) => {
  const MeetingRetro = mongoose.model(
    "meetingRetro",
    mongoose.Schema(
      {
        roomId: String,
        title: String,
        type: String,
        subtype: String,
        columns: Array,
        cards: Array,
        meetingParticipants: {},
        meetingStarted: Boolean,
        meetingFinished: Boolean,
        meetingStartTime: Date,
        meetingEndTime: Date,
      },
      { timestamps: true }
    )
  );

  return MeetingRetro;
};
