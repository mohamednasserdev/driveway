import { useEffect, useState, useCallback } from "react";
import { carService } from "../services/carService";
import CarCard from "../components/car/CarCard";
import CarSkeleton from "../components/common/CarSkeleton";
import MainLayout from "../layouts/MainLayout";
import { SlidersHorizontal, Car, AlertTriangle, RefreshCw, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

const FloatingCar = () => (
  <motion.div
    animate={{ x: ["-300px", "110vw"] }}
    transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
    className="absolute bottom-20 left-0 pointer-events-none z-20"
  >
    <div className="relative flex items-center">
      <motion.div
        animate={{ opacity: [0, 1, 0], scaleX: [0.5, 1, 0.5] }}
        transition={{ duration: 0.6, repeat: Infinity }}
        className="absolute -left-20 top-1/2 -translate-y-1/2 flex flex-col gap-2 origin-right"
      >
        <div className="h-[2px] w-16 bg-gradient-to-r from-transparent to-blue-400/60 rounded-full" />
        <div className="h-[2px] w-10 bg-gradient-to-r from-transparent to-blue-400/40 rounded-full" />
        <div className="h-[2px] w-20 bg-gradient-to-r from-transparent to-blue-400/60 rounded-full" />
        <div className="h-[2px] w-8 bg-gradient-to-r from-transparent to-blue-400/30 rounded-full" />
      </motion.div>

      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="320" height="110" viewBox="0 0 280 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="140" cy="96" rx="110" ry="5" fill="rgba(0,0,0,0.35)" />
          <rect x="20" y="45" width="240" height="42" rx="10" fill="#1e40af" />
          <rect x="20" y="75" width="240" height="12" rx="6" fill="#1d4ed8" />
          <path d="M75 45 Q85 12 105 10 L180 10 Q200 10 208 45 Z" fill="#2563eb" />
          <path d="M90 43 Q96 18 108 15 L175 15 Q186 15 190 43 Z" fill="#bfdbfe" opacity="0.85" />
          <path d="M95 40 Q100 22 110 18 L130 18 Q122 28 118 40 Z" fill="white" opacity="0.2" />
          <line x1="152" y1="45" x2="152" y2="82" stroke="#1d4ed8" strokeWidth="2" />
          <rect x="118" y="60" width="18" height="4" rx="2" fill="#3b82f6" />
          <rect x="162" y="60" width="18" height="4" rx="2" fill="#3b82f6" />
          <rect x="248" y="52" width="18" height="10" rx="4" fill="#fef9c3" />
          <ellipse cx="262" cy="57" rx="14" ry="7" fill="#fef08a" opacity="0.4" />
          <rect x="14" y="52" width="12" height="10" rx="4" fill="#ef4444" />
          <ellipse cx="14" cy="57" rx="8" ry="5" fill="#ef4444" opacity="0.3" />
          <circle cx="210" cy="84" r="16" fill="#0f172a" />
          <circle cx="210" cy="84" r="11" fill="#1e293b" />
          <circle cx="210" cy="84" r="6" fill="#334155" />
          <circle cx="210" cy="84" r="3" fill="#94a3b8" />
          <line x1="210" y1="73" x2="210" y2="95" stroke="#475569" strokeWidth="1.5" />
          <line x1="199" y1="84" x2="221" y2="84" stroke="#475569" strokeWidth="1.5" />
          <line x1="202" y1="76" x2="218" y2="92" stroke="#475569" strokeWidth="1.5" />
          <line x1="218" y1="76" x2="202" y2="92" stroke="#475569" strokeWidth="1.5" />
          <circle cx="72" cy="84" r="16" fill="#0f172a" />
          <circle cx="72" cy="84" r="11" fill="#1e293b" />
          <circle cx="72" cy="84" r="6" fill="#334155" />
          <circle cx="72" cy="84" r="3" fill="#94a3b8" />
          <line x1="72" y1="73" x2="72" y2="95" stroke="#475569" strokeWidth="1.5" />
          <line x1="61" y1="84" x2="83" y2="84" stroke="#475569" strokeWidth="1.5" />
          <line x1="64" y1="76" x2="80" y2="92" stroke="#475569" strokeWidth="1.5" />
          <line x1="80" y1="76" x2="64" y2="92" stroke="#475569" strokeWidth="1.5" />
          <rect x="205" y="46" width="14" height="8" rx="3" fill="#1d4ed8" />
          <rect x="105" y="10" width="75" height="3" rx="1.5" fill="#1d4ed8" opacity="0.5" />
          <ellipse cx="140" cy="92" rx="100" ry="4" fill="#3b82f6" opacity="0.2" />
        </svg>
      </motion.div>

      <div className="absolute -left-4 bottom-10 flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0, 0.5, 0], y: [0, -10, -20], x: [0, -8, -16], scale: [0.5, 1, 1.5] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.3 }}
            className="w-2 h-2 bg-slate-400/30 rounded-full"
          />
        ))}
      </div>
    </div>
  </motion.div>
);

const HomePage = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState({ available: "", category: "" });

  const fetchCars = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (filter.available !== "") params.available = filter.available;
      if (filter.category) params.category = filter.category;
      const { data } = await carService.getAllCars(params);
      setCars(data.cars);
    } catch {
      setError("Failed to load cars. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [filter.available, filter.category]);

  useEffect(() => { fetchCars(); }, [fetchCars]);

  return (
    <MainLayout>
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" style={{ isolation: "isolate" }}>
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] bg-blue-500 rounded-full blur-3xl" />
        <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }} className="absolute bottom-[-150px] left-[-100px] w-[600px] h-[600px] bg-blue-600 rounded-full blur-3xl" />
        <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.08, 0.15, 0.08] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 4 }} className="absolute top-[30%] left-[30%] w-[400px] h-[400px] bg-indigo-500 rounded-full blur-3xl" />

        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "50px 50px" }} />

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-500/30 text-blue-400 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            Premium Car Rentals — Book Instantly
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="text-6xl md:text-7xl font-extrabold text-white leading-tight mb-6">
            Drive Your{" "}
            <span className="relative inline-block">
              <span className="text-blue-500">Adventure</span>
              <motion.span initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.8, delay: 0.9 }} className="absolute bottom-0 left-0 w-full h-1 bg-blue-500 rounded-full origin-left block" />
            </span>
            <br />Your Way
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="text-slate-400 text-xl leading-relaxed max-w-xl mx-auto mb-10">
            Choose from our premium fleet. No hidden fees, transparent pricing, instant booking.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} className="flex justify-center gap-8 mb-10">
            {[
              { value: "50+", label: "Premium Cars" },
              { value: "24/7", label: "Support" },
              { value: "100%", label: "Secure Booking" },
            ].map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: 0.6 + i * 0.1 }} className="text-center">
                <p className="text-3xl font-extrabold text-blue-400">{stat.value}</p>
                <p className="text-slate-500 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.7 }} className="flex justify-center gap-4">
            <a href="#fleet" className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-blue-500/30 hover:-translate-y-1 no-underline">Browse Fleet →</a>
            <a href="#fleet" className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all border border-white/20 hover:-translate-y-1 no-underline">How It Works</a>
          </motion.div>
        </div>

        <FloatingCar />

        <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-500 z-30">
          <ChevronDown size={28} />
        </motion.div>
      </div>

      <div id="fleet" className="max-w-6xl mx-auto px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-8">
          <p className="text-blue-500 font-semibold uppercase tracking-widest text-sm mb-2">Our Fleet</p>
          <h2 className="text-3xl font-extrabold text-slate-800">Find Your Perfect Ride</h2>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }} className="bg-white rounded-2xl px-6 py-4 shadow-sm border border-slate-100 flex flex-wrap gap-4 items-center mb-8">
          <span className="font-semibold text-slate-800 flex items-center gap-2">
            <SlidersHorizontal size={16} /> Filter:
          </span>
          <select value={filter.available} onChange={(e) => setFilter((f) => ({ ...f, available: e.target.value }))} className="px-4 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 text-sm cursor-pointer">
            <option value="">All Status</option>
            <option value="true">Available</option>
            <option value="false">Unavailable</option>
          </select>
          <select value={filter.category} onChange={(e) => setFilter((f) => ({ ...f, category: e.target.value }))} className="px-4 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 text-sm cursor-pointer">
            <option value="">All Categories</option>
            <option value="economy">Economy</option>
            <option value="standard">Standard</option>
            <option value="luxury">Luxury</option>
            <option value="suv">SUV</option>
            <option value="van">Van</option>
          </select>
          {(filter.available || filter.category) && (
            <button onClick={() => setFilter({ available: "", category: "" })} className="flex items-center gap-1 text-blue-500 hover:text-blue-600 text-sm font-medium bg-transparent border-none cursor-pointer">
              <RefreshCw size={14} /> Clear filters
            </button>
          )}
          <span className="ml-auto text-slate-500 text-sm flex items-center gap-2">
            <Car size={15} /> {cars.length} vehicle{cars.length !== 1 ? "s" : ""} found
          </span>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <CarSkeleton key={i} />)}
          </div>
        ) : error ? (
          <div className="text-center py-16 text-red-500">
            <AlertTriangle size={48} className="mx-auto mb-4" />
            <p className="text-lg">{error}</p>
            <button onClick={fetchCars} className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg cursor-pointer border-none font-medium flex items-center gap-2 mx-auto">
              <RefreshCw size={16} /> Try Again
            </button>
          </div>
        ) : cars.length === 0 ? (
          <div className="text-center py-16 text-slate-500">
            <Car size={64} className="mx-auto mb-4 text-slate-300" />
            <p className="text-xl font-bold text-slate-800">No cars found</p>
            <p>Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car, index) => (
              <motion.div key={car._id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: index * 0.08 }}>
                <CarCard car={car} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default HomePage;