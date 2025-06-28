const mongoose = require("mongoose");

const CountrySchema = new mongoose.Schema(
  {
    Id: { type: Number, default: 219 },
    Name: { type: String, default: "Tunisie" },
  },  
  { _id: false }
);

const CitySchema = new mongoose.Schema({
  Id: { type: Number },
  Name: { type: String },
  images :{type :String, default :null},
  Region: { type: String },
  Country: { type: CountrySchema, default: () => ({}) }, // default is an empty object, so default values in CountrySchema apply
});

const City = mongoose.model("City", CitySchema);
module.exports = City;