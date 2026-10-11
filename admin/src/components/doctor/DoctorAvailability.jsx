
import { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { DoctorContext } from "../../context/DoctorContext";

const DoctorAvailability = ({
    doctorId,
    backendUrl,
    docSlots = [],
    unavailableSlots = [],
    unavailableDates = [],
    onRefresh,
}) => {
    const { dToken } = useContext(DoctorContext);
    const [selectedDayIndex, setSelectedDayIndex] = useState(0);
    const [loadingKey, setLoadingKey] = useState("");

    const selectedDay = docSlots[selectedDayIndex];

    const formatDate = (date) => {
        const d = new Date(date);

        return `${d.getDate()}_${d.getMonth() + 1
            }_${d.getFullYear()}`;
    };

    const selectedDate = selectedDay
        ? formatDate(selectedDay.fullDate)
        : "";

    const isDayBlocked = unavailableDates.some(
        (item) => item.date === selectedDate
    );

    const isSlotBlocked = (time) =>
        unavailableSlots.some(
            (slot) =>
                slot.date === selectedDate && slot.time === time
        );

    const sendRequest = async (method, path, payload, key) => {
        if (!doctorId || !dToken || loadingKey) return;
        setLoadingKey(key);

        try {
            const url =
                `${backendUrl}/api/doctor/` +
                `${doctorId}/${path}`;

            const config = {
                headers: { dtoken: dToken },
            };

            const response =
                method === "post"
                    ? await axios.post(url, payload, config)
                    : await axios.delete(url, {
                        ...config,
                        data: payload,
                    });

            if (!response.data.success) {
                toast.error(
                    response.data.message || "Could not update availability"
                );
                return;
            }

            toast.success(response.data.message || "Availability updated");

            // Reload the profile so MongoDB changes appear in the UI.
            await onRefresh?.();
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Could not update availability"
            );
        } finally {
            setLoadingKey("");
        }
    };

    const toggleSlot = (time) => {
        const blocked = isSlotBlocked(time);

        

        sendRequest(
            blocked ? "delete" : "post",
            "block-slot",
            { date: selectedDate, time },
            `slot-${time}`
        );
    };

    const toggleDay = () => {
        sendRequest(
            isDayBlocked ? "delete" : "post",
            "block-date",
            { date: selectedDate },
            "day"
        );
    };

    if (!selectedDay) {
        return (
            <p className="text-gray-500">
                No appointment dates available to manage.
            </p>
        );
    }

    return (
        <section className="max-w-5xl mx-auto bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-800">
                Manage Appointment Availability
            </h2>

            {/* Select date */}
            <div className="flex gap-3 overflow-x-auto py-5">
                {docSlots.map((day, index) => {
                    const date = formatDate(day.fullDate);
                    const blocked = unavailableDates.some(
                        (item) => item.date === date
                    );

                    return (
                        <button
                            type="button"
                            key={date}
                            onClick={() => setSelectedDayIndex(index)}
                            className={`shrink-0 rounded-xl border px-4 py-3 ${selectedDayIndex === index
                                ? "bg-primary text-white"
                                : "bg-white text-gray-700"
                                }`}
                        >
                            <span className="block">{day.day}</span>
                            <span className="block">{day.date}</span>

                            {blocked && (
                                <span className="block text-xs mt-1">
                                    Full day blocked
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Full-day control */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                <p className="font-medium text-gray-700">
                    Selected date: {selectedDate.replaceAll("_", "/")}
                </p>

                <button
                    type="button"
                    disabled={Boolean(loadingKey)}
                    onClick={toggleDay}
                    className="rounded-lg bg-primary text-white px-4 py-2 disabled:opacity-50"
                >
                    {loadingKey === "day"
                        ? "Updating..."
                        : isDayBlocked
                            ? "Restore Full Day"
                            : "Block Full Day"}
                </button>
            </div>

            {isDayBlocked && (
                <p className="mb-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
                    This date is blocked. Restore the date before managing
                    individual slots.
                </p>
            )}

            {/* Individual slots */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {selectedDay.timeSlots.map((time) => {
                    const blocked = isSlotBlocked(time);
                    const busy =
                        loadingKey === `slot-${time}` ||
                        loadingKey === "day";

                    return (
                        <button
                            type="button"
                            key={time}
                            disabled={isDayBlocked || Boolean(loadingKey)}
                            onClick={() => toggleSlot(time)}
                            className={`rounded-lg border px-3 py-3 text-sm disabled:opacity-50 ${blocked
                                ? "bg-red-50 border-red-300 text-red-700"
                                : "bg-green-50 border-green-300 text-green-700"
                                }`}
                        >
                            <span className="block font-medium">{time}</span>
                            <span className="block mt-1">
                                {busy && loadingKey === `slot-${time}`
                                    ? "Updating..."
                                    : blocked
                                        ? "Blocked — Restore"
                                        : "Available — Block"}
                            </span>
                        </button>
                    );
                })}
            </div>
        </section>
    );
};

export default DoctorAvailability;