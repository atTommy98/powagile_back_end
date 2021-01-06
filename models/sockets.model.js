const { Timestamp } = require("mongodb");

module.exports = (mongoose) => {
  const Sockets = mongoose.model(
    "sockets",
    mongoose.Schema(
      {
        name: String,
        message: String,
      },
      { timestamps: true }
    )
  );

  return Sockets;
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
