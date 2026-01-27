import mongoose from "mongoose";

const bedSchema = new mongoose.Schema(
  {
    totalBeds: {
      type: Number,
      required: true,
    },

    occupiedBeds: {
      type: Number,
      default: 0,
    },

    bedTypes: {
      general: {
        total: { type: Number, default: 0 },
        occupied: { type: Number, default: 0 },
      },
      icu: {
        total: { type: Number, default: 0 },
        occupied: { type: Number, default: 0 },
      },
      emergency: {
        total: { type: Number, default: 0 },
        occupied: { type: Number, default: 0 },
      },

    },
    bedRanges: {
      general: {
        start: { type: Number, required: true },
      },
      icu: {
        start: { type: Number, required: true },
      },
      emergency: {
        start: { type: Number, required: true },
      }
    },

    occupiedNumbers: {
      type: [Number],
      default: [],
    },
  },
  { timestamps: true }
);

bedSchema.virtual("availableBeds").get(function () {
  return this.totalBeds - this.occupiedBeds;
});

bedSchema.virtual("availableBedTypes").get(function () {
  return {
    general: this.bedTypes.general.total - this.bedTypes.general.occupied,
    icu: this.bedTypes.icu.total - this.bedTypes.icu.occupied,
    emergency: this.bedTypes.emergency.total - this.bedTypes.emergency.occupied,
  };
});

bedSchema.set("toJSON", { virtuals: true });
bedSchema.set("toObject", { virtuals: true });

export default mongoose.model("Bed", bedSchema);
