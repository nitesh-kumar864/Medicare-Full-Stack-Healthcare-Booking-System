export const doctorListService = async () => {

  const doctors = await doctorModel
    .find({})
    .select("-password -email")
    .limit(20)
    .lean();

  return {
    success: true,
    doctors,
  };
};