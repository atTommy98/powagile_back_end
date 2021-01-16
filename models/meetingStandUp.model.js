const { Timestamp } = require("mongodb");

module.exports = (mongoose) => {
  const MeetingStandUp = mongoose.model(
    "meetingStandUp",
    mongoose.Schema(
      {
        userId: String,
        type: String,
        meetingParticipants: Array,
        meetingStartTime: Date,
        meetingEndTime: Date,
      },
      { timestamps: true }
    )
  );

  return MeetingStandUp;
};
