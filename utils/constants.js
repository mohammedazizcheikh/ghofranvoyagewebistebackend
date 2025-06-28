// utils/constants.js

const CONSTANTS = {
  ROLES: {
    ADMIN: "admin",
    USER: "user",
    GUIDE: "guide",
    AGENT: "agent",
  },

  BOOKING_STATUS: {
    PENDING: "pending",
    CONFIRMED: "confirmed",
    CANCELED: "canceled",
    COMPLETED: "completed",
  },

  SERVICE_STATUS: {
    ACTIVE: "active",
    SOLD_OUT: "sold_out",
    UPCOMING: "upcoming",
    ARCHIVED: "archived",
    CANCELED: "canceled",
  },

  OMRA_STATUS: {
    PENDING: "pending",
    CONFIRMED: "confirmed",
    CANCELED: "canceled",
    REJECTED: "rejected",
  },

  TRIP_STATUS: {
    ACTIVE: "active",
    SOLD_OUT: "sold_out",
    UPCOMING: "upcoming",
    ARCHIVED: "archived",
    CANCELED: "canceled",
  },

  PAYMENT_STATUS: {
    UNPAID: "unpaid",
    PARTIALLY_PAID: "partially_paid",
    PAID: "paid",
    REFUNDED: "refunded",
  },

  TRIP_TYPE: {
    CULTURAL: "cultural",
    ADVENTURE: "adventure",
    BEACH: "beach",
  },

  TRANSPORT_TYPE: {
    FLIGHT: "flight",
    BUS: "bus",
    TRAIN: "train",
    CRUISE: "cruise",
  },

  DEPARTURE_OPTIONS: {
    GO_ONLY: "go_only",
    GO_AND_BACK: "go_and_back",
  },

  TRAVELER_TYPE: {
    ADULT: "adult",
    CHILD: "child",
    SENIOR: "senior",
    ANY: "any",
  },

  OMRA_PACKAGE_TYPE: {
    PREMIUM: "premium",
    STANDARD: "standard",
  },

  TRANSFER_TYPE: {
    BAGGAGE: "baggage",
    FAMILY: "family",
    GROUP: "group",
    OTHER: "other",
  },

  REGION: {
    TUNIS: "tunis",
    ARIANA: "ariana",
    BEN_AROUS: "ben-arous",
    MANOUBA: "manouba",
    NABEUL: "nabeul",
    ZAGHOUAN: "zaghouan",
    BIZERTE: "bizerte",
    BEJA: "beja",
    JENDOUBA: "jendouba",
    KEF: "kef",
    SILIANA: "siliana",
    KAIROUAN: "kairouan",
    KASSERINE: "kasserine",
    SIDI_BOUZID: "sidi-bouzid",
    SOUSSE: "sousse",
    MONASTIR: "monastir",
    MAHDIA: "mahdia",
    SFAX: "sfax",
    GABES: "gabes",
    MEDENINE: "medenine",
    TATAOUINE: "tataouine",
    GAFSA: "gafsa",
    TOZEUR: "tozeur",
    KEBILI: "kebili",
    OTHER: "other",
  },

  TRIP_DIRECTION: {
    ONE_WAY: "one-way",
    ROUND_TRIP: "round-trip",
  },

  FERRY_CLASS: {
    ECONOMY: "economy",
    BUSINESS: "business",
    FIRST_CLASS: "first_class",
  },

  FLIGHT_CLASS: {
    ECONOMY: "economy",
    BUSINESS: "business",
    FIRST_CLASS: "first_class",
  },

  HOTEL_ROOM_TYPE: {
    SINGLE: "single",
    DOUBLE: "double",
    SUITE: "suite",
    FAMILY: "family",
  },

  HOTEL_BOARD_TYPE: {
    ROOM_ONLY: "room_only",
    BED_AND_BREAKFAST: "bed_and_breakfast",
    HALF_BOARD: "half_board",
    FULL_BOARD: "full_board",
    ALL_INCLUSIVE: "all_inclusive",
  },
};

module.exports = CONSTANTS;
