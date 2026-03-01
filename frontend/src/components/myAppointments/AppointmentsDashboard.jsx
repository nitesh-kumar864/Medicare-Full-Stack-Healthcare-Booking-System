import React from "react";
import { Calendar, Sparkles } from "lucide-react";

import AppointmentCard from "./AppointmentCard";
import { StatsCard, EmptyState } from "./AppointmentsCommon";

const AppointmentsDashboard = ({
  stats,
  filter,
  setFilter,
  filteredAppointments,
  navigate,
  slotDateFormat,
  cancelAppointment,
  handleDownloadPrescription,
  downloadingId,
  handlePayNow,
  getAppointmentStatus,
  unreadMap,
}) => {
  return (
    <>
      {/* HEADER */}
      <div className="mb-8 flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Calendar className="text-primary" size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            My Appointments
          </h1>
          <p className="text-gray-600">
            Manage and track all your medical appointments
          </p>
        </div>
      </div>

      {/* --------------STATS -----------------*/}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatsCard
          count={stats.total}
          label="Total Appointments"
          icon={<Calendar />}
          color="blue"
        />

        <StatsCard
          count={stats.completed}
          label="Completed"
          icon={<Calendar />}
          color="green"
        />

        <StatsCard
          count={stats.cancelled}
          label="Cancelled"
          icon={<Calendar />}
          color="red"
        />
      </div>

      {/* --------------------FILTER BAR---------------------*/}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <Sparkles size={20} className="text-gray-500" />
            <h3 className="font-semibold text-gray-900">
              Filter Appointments
            </h3>
          </div>

          <div className="flex flex-wrap gap-2">
            <FilterBtn
              active={filter === "all"}
              onClick={() => setFilter("all")}
              label={`All (${stats.total})`}
            />
            <FilterBtn
              active={filter === "completed"}
              onClick={() => setFilter("completed")}
              label={`Completed (${stats.completed})`}
            />
            <FilterBtn
              active={filter === "cancelled"}
              onClick={() => setFilter("cancelled")}
              label={`Cancelled (${stats.cancelled})`}
            />
          </div>
        </div>
      </div>

      {/*-----------------------APPOINTMENT LIST  ------------------*/}
      {filteredAppointments.length === 0 ? (
        <EmptyState filter={filter} navigate={navigate} />
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((item, i) => {
            const doc = item.doctorData || {};
            const status = getAppointmentStatus(item);

            return (
              <AppointmentCard
                key={i}
                item={item}
                doc={doc}
                status={status}
                slotDateFormat={slotDateFormat}
                cancelAppointment={cancelAppointment}
                handleDownloadPrescription={handleDownloadPrescription}
                downloadingId={downloadingId}
                handlePayNow={handlePayNow}
                navigate={navigate}
                unreadMap={unreadMap}
              />
            );
          })}
        </div>
      )}
    </>
  );
};

/* ------------------- FILTER BUTTON --------------------- */
const FilterBtn = ({ active, onClick, label }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-xl transition-all ${active
      ? "bg-primary text-white"
      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
  >
    {label}
  </button>
);

export default AppointmentsDashboard;
