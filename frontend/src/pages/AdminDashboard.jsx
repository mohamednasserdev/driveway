import { useEffect, useState } from "react";
import { bookingService } from "../services/bookingService";
import { carService } from "../services/carService";
import Spinner from "../components/common/Spinner";
import MainLayout from "../layouts/MainLayout";
import toast from "react-hot-toast";
import {
  Car,
  ClipboardList,
  Users,
  DollarSign,
  Pencil,
  Trash2,
  Plus,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import StatsCard from "../components/admin/StatsCard";

const statusColors = {
  pending: { bg: "#fef3c7", text: "#92400e" },
  confirmed: { bg: "#d1fae5", text: "#065f46" },
  cancelled: { bg: "#fee2e2", text: "#991b1b" },
  completed: { bg: "#ede9fe", text: "#5b21b6" },
};

const AdminDashboard = () => {
  const [tab, setTab] = useState("bookings");
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [carForm, setCarForm] = useState({
    name: "",
    brand: "",
    pricePerDay: "",
    image: "",
    features: "",
    category: "standard",
    seats: 5,
    transmission: "automatic",
    available: true,
  });
  const [editingCar, setEditingCar] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [statsRes, bookingsRes, carsRes] = await Promise.all([
          bookingService.getStats(),
          bookingService.getAllBookings(),
          carService.getAllCars(),
        ]);
        setStats(statsRes.data.stats);
        setBookings(bookingsRes.data.bookings);
        setCars(carsRes.data.cars);
      } catch {
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await bookingService.updateBookingStatus(id, status);
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status } : b))
      );
      toast.success("Status updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update");
    }
  };

  const handleCarSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...carForm,
      features: carForm.features
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean),
      pricePerDay: Number(carForm.pricePerDay),
      seats: Number(carForm.seats),
    };
    try {
      if (editingCar) {
        await carService.updateCar(editingCar._id, payload);
        toast.success("Car updated");
        setCars((prev) =>
          prev.map((c) => (c._id === editingCar._id ? { ...c, ...payload } : c))
        );
        setEditingCar(null);
      } else {
        const { data } = await carService.createCar(payload);
        setCars((prev) => [data.car, ...prev]);
        toast.success("Car added");
      }
      setCarForm({
        name: "",
        brand: "",
        pricePerDay: "",
        image: "",
        features: "",
        category: "standard",
        seats: 5,
        transmission: "automatic",
        available: true,
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save car");
    }
  };

  const deleteCar = async (id) => {
    if (!confirm("Delete this car?")) return;
    try {
      await carService.deleteCar(id);
      setCars((prev) => prev.filter((c) => c._id !== id));
      toast.success("Car deleted");
    } catch {
      toast.error("Failed to delete car");
    }
  };

  const startEdit = (car) => {
    setEditingCar(car);
    setCarForm({ ...car, features: (car.features || []).join(", ") });
    setTab("cars");
    window.scrollTo(0, 0);
  };

  if (loading)
    return (
      <MainLayout>
        <Spinner />
      </MainLayout>
    );

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-extrabold text-slate-800 mb-1">
          Admin Dashboard
        </h1>
        <p className="text-slate-500 mb-8">
          Manage your fleet, bookings, and revenue
        </p>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-4 gap-4 mb-8">
            {[
              {
                label: "Total Cars",
                value: stats.totalCars,
                icon: <Car size={24} color="#3b82f6" />,
                color: "#3b82f6",
              },
              {
                label: "Total Bookings",
                value: stats.totalBookings,
                icon: <ClipboardList size={24} color="#8b5cf6" />,
                color: "#8b5cf6",
              },
              {
                label: "Total Users",
                value: stats.totalUsers,
                icon: <Users size={24} color="#10b981" />,
                color: "#10b981",
              },
              {
                label: "Total Revenue",
                value: `$${stats.totalRevenue?.toLocaleString()}`,
                icon: <DollarSign size={24} color="#f59e0b" />,
                color: "#f59e0b",
              },
            ].map((st, i) => (
              <StatsCard key={st.label} {...st} index={i} />
            ))}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b-2 border-slate-200">
          {[
            {
              key: "bookings",
              label: "Bookings",
              icon: <ClipboardList size={16} />,
              count: bookings.length,
            },
            {
              key: "cars",
              label: "Fleet",
              icon: <Car size={16} />,
              count: cars.length,
            },
          ].map(({ key, label, icon, count }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-6 py-3 font-bold text-sm border-none cursor-pointer transition-colors -mb-0.5 ${
                tab === key
                  ? "text-blue-500 border-b-2 border-blue-500 bg-transparent"
                  : "text-slate-500 bg-transparent"
              }`}
            >
              {icon} {label} ({count})
            </button>
          ))}
        </div>

        {/* Bookings Tab */}
        {tab === "bookings" && (
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
            {bookings.length === 0 ? (
              <p className="text-center py-12 text-slate-500">
                No bookings found.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b-2 border-slate-200">
                      {[
                        "Customer",
                        "Car",
                        "Dates",
                        "Price",
                        "Status",
                        "Actions",
                      ].map((h) => (
                        <th
                          key={h}
                          className="px-4 py-3 text-left font-bold text-slate-700"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b, i) => {
                      const colors =
                        statusColors[b.status] || statusColors.pending;
                      return (
                        <tr
                          key={b._id}
                          className={`border-b border-slate-50 ${
                            i % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                          }`}
                        >
                          <td className="px-4 py-3">
                            <p className="font-semibold text-slate-800">
                              {b.user?.name}
                            </p>
                            <p className="text-slate-400 text-xs">
                              {b.user?.email}
                            </p>
                          </td>
                          <td className="px-4 py-3 font-semibold">
                            {b.car?.brand} {b.car?.name}
                          </td>
                          <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                            {new Date(b.startDate).toLocaleDateString()} →<br />
                            {new Date(b.endDate).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 font-bold">
                            ${b.totalPrice}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className="px-3 py-1 rounded-full text-xs font-bold capitalize"
                              style={{
                                background: colors.bg,
                                color: colors.text,
                              }}
                            >
                              {b.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={b.status}
                              onChange={(e) =>
                                updateStatus(b._id, e.target.value)
                              }
                              className="px-2 py-1 border border-slate-200 rounded-lg text-xs cursor-pointer"
                            >
                              {[
                                "pending",
                                "confirmed",
                                "cancelled",
                                "completed",
                              ].map((s) => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Cars Tab */}
        {tab === "cars" && (
          <div
            className="grid gap-6"
            style={{ gridTemplateColumns: "1fr 1.5fr" }}
          >
            {/* Car Form */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 h-fit">
              <h2 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
                {editingCar ? (
                  <>
                    <Pencil size={18} className="text-blue-500" /> Edit Car
                  </>
                ) : (
                  <>
                    <Plus size={18} className="text-blue-500" /> Add New Car
                  </>
                )}
              </h2>
              <form onSubmit={handleCarSubmit} className="space-y-4">
                {[
                  {
                    field: "name",
                    label: "Car Name",
                    type: "text",
                    placeholder: "Camry XSE",
                  },
                  {
                    field: "brand",
                    label: "Brand",
                    type: "text",
                    placeholder: "Toyota",
                  },
                  {
                    field: "pricePerDay",
                    label: "Price Per Day ($)",
                    type: "number",
                    placeholder: "65",
                  },
                  {
                    field: "image",
                    label: "Image URL",
                    type: "url",
                    placeholder: "https://...",
                  },
                  {
                    field: "features",
                    label: "Features (comma-separated)",
                    type: "text",
                    placeholder: "Bluetooth, GPS",
                  },
                  {
                    field: "seats",
                    label: "Seats",
                    type: "number",
                    placeholder: "5",
                  },
                ].map(({ field, label, type, placeholder }) => (
                  <div key={field}>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      {label}
                    </label>
                    <input
                      type={type}
                      value={carForm[field]}
                      onChange={(e) =>
                        setCarForm((f) => ({ ...f, [field]: e.target.value }))
                      }
                      placeholder={placeholder}
                      required={[
                        "name",
                        "brand",
                        "pricePerDay",
                        "image",
                      ].includes(field)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 outline-none focus:border-blue-500"
                    />
                  </div>
                ))}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Category
                    </label>
                    <select
                      value={carForm.category}
                      onChange={(e) =>
                        setCarForm((f) => ({ ...f, category: e.target.value }))
                      }
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50"
                    >
                      {["economy", "standard", "luxury", "suv", "van"].map(
                        (c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Transmission
                    </label>
                    <select
                      value={carForm.transmission}
                      onChange={(e) =>
                        setCarForm((f) => ({
                          ...f,
                          transmission: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50"
                    >
                      <option value="automatic">Automatic</option>
                      <option value="manual">Manual</option>
                    </select>
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-slate-700">
                  {carForm.available ? (
                    <ToggleRight size={22} className="text-emerald-500" />
                  ) : (
                    <ToggleLeft size={22} className="text-slate-400" />
                  )}
                  <input
                    type="checkbox"
                    checked={carForm.available}
                    onChange={(e) =>
                      setCarForm((f) => ({ ...f, available: e.target.checked }))
                    }
                    className="hidden"
                  />
                  Available for booking
                </label>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-bold text-sm cursor-pointer border-none flex items-center justify-center gap-2"
                  >
                    {editingCar ? (
                      <>
                        <Pencil size={15} /> Update Car
                      </>
                    ) : (
                      <>
                        <Plus size={15} /> Add Car
                      </>
                    )}
                  </button>
                  {editingCar && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingCar(null);
                        setCarForm({
                          name: "",
                          brand: "",
                          pricePerDay: "",
                          image: "",
                          features: "",
                          category: "standard",
                          seats: 5,
                          transmission: "automatic",
                          available: true,
                        });
                      }}
                      className="px-4 py-2.5 bg-slate-100 text-slate-600 rounded-xl font-semibold text-sm cursor-pointer border-none"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Car List */}
            <div className="flex flex-col gap-3">
              {cars.map((car) => (
                <div
                  key={car._id}
                  className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex gap-4 items-center"
                >
                  <img
                    src={car.image}
                    alt={car.name}
                    className="w-20 h-14 object-cover rounded-lg flex-shrink-0"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/80x60?text=Car";
                    }}
                  />
                  <div className="flex-1">
                    <p className="font-bold text-slate-800">
                      {car.brand} {car.name}
                    </p>
                    <p className="text-slate-500 text-sm">
                      ${car.pricePerDay}/day · {car.category} · {car.seats}{" "}
                      seats
                    </p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        car.available
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {car.available ? "Available" : "Unavailable"}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(car)}
                      className="flex items-center gap-1 px-3 py-2 bg-blue-50 text-blue-500 rounded-lg font-semibold text-sm cursor-pointer border-none"
                    >
                      <Pencil size={13} /> Edit
                    </button>
                    <button
                      onClick={() => deleteCar(car._id)}
                      className="flex items-center gap-1 px-3 py-2 bg-red-50 text-red-500 rounded-lg font-semibold text-sm cursor-pointer border-none"
                    >
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default AdminDashboard;
