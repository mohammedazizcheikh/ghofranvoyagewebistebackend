function generateBookingReference(prefix) {
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
  const timestamp = Date.now().toString().slice(-6);
  return `${prefix}${randomPart}${timestamp}`;
}

function bookingReferencePlugin(schema, options) {
  const prefix = options && options.prefix ? options.prefix : "BK-";

  schema.pre("save", function (next) {
    if (!this.bookingReference) {
      this.bookingReference = generateBookingReference(prefix);
    }
    this.updatedAt = Date.now();
    next();
  });
}

module.exports = bookingReferencePlugin;
