const mongoose = require("mongoose");
const { BOOKING_STATUS, PAYMENT_STATUS } = require("../utils/constants");

const bookingReferencePlugin = require("../utils/bookingReference");

const customerSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  nationality: String,
  passportNumber: String,
  address: String,
  contactPreference: String,
});

const bookingSchema = new mongoose.Schema(
  {
    bookingReference: { type: String, unique: true },
    customer: customerSchema,
    serviceType: { type: String, required: true },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    serviceName: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    adults: { type: Number, default: 1 },
    children: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    paidAmount: { type: Number, default: 0 },
    remainingAmount: { type: Number },
    currency: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(BOOKING_STATUS),
      default: BOOKING_STATUS.PENDING,
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.UNPAID,
    },
    specialRequests: String,
  },
  { timestamps: true }
);


// For 'save' hook
bookingSchema.pre("save", function (next) {
  if (
    typeof this.totalAmount === "number" &&
    typeof this.paidAmount === "number"
  ) {
    this.remainingAmount = this.totalAmount - this.paidAmount;
  } else {
    this.remainingAmount = this.totalAmount;
  }
  next();
});

// For 'findOneAndUpdate' hook
bookingSchema.pre("findOneAndUpdate", async function (next) {
  console.log("pre findOneAndUpdate hook");
  const update = this.getUpdate();

  if (!update) return next();

  try {
    // Fetch the current document
    const docToUpdate = await this.model.findOne(this.getQuery());
    if (!docToUpdate) return next();

    const totalAmount = docToUpdate.totalAmount;
    const paidAmount = update.paidAmount;


    if (typeof totalAmount === "number" && typeof paidAmount === "number") {
      update.remainingAmount = totalAmount - paidAmount;
    } else if (typeof totalAmount === "number") {
      update.remainingAmount = totalAmount;
    }

    this.setUpdate(update);
    next();
  } catch (err) {
    next(err);
  }
});


bookingSchema.plugin(bookingReferencePlugin, { prefix: "BK-S-" });

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
