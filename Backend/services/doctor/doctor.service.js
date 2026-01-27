import doctorModel from "../../models/doctorModel.js";

export const doctorListService = async () => {
  const doctors = await doctorModel
    .find({})
    .select("-password -email");

  return {
    success: true,
    doctors,
  };
};
