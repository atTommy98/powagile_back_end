const sampleMeeting =
{
\_id:5fec54666b9c0d07aca67c48
type: "StandUp",
userName: String,
hasHadTurn: true,
timeLeft: number
pauses: [number]
totalSpeekingTime:number
cards: {
yesterday:"String",
today:"String",
blockers:"String"
\_v:0
}

users:
{
userName: String,
signUp: Boolean,
hasHadTurn: Boolean,
timeLeft: Number,
pauses: Boolean
totalSpeekingTime: Number
}

meeting:
{
type: String (StandUp/Retro),
cards: Array of Objects
[{yesterday:String}, {today: String}, {blockers: String}, {Millestones: String}, {WentWell:String}, {toImprove: String}, {Actions: String}],
totalMeetingTime: Number,
userName:String,
hasHadTurn: Boolean
}

teams:
{
users: Array

}
