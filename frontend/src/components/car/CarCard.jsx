import { Link } from "react-router-dom";
import { Users, Settings, Tag, Star } from "lucide-react";

const CarCard = ({ car }) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-100">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={car.image}
          alt={car.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/400x200?text=Car+Image";
          }}
        />
        <span
          className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold text-white ${
            car.available ? "bg-emerald-500" : "bg-red-500"
          }`}
        >
          {car.available ? "✓ Available" : "✗ Unavailable"}
        </span>
        <span className="absolute top-3 left-3 bg-slate-800/80 text-blue-300 px-3 py-1 rounded-full text-xs font-semibold capitalize">
          {car.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-5">
        <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">
          {car.brand}
        </p>
        <h3 className="text-slate-800 text-lg font-bold mb-3">{car.name}</h3>

        {/* Specs */}
        <div className="flex gap-4 text-slate-500 text-sm mb-3">
          <span className="flex items-center gap-1">
            <Users size={13} /> {car.seats} seats
          </span>
          <span className="flex items-center gap-1">
            <Settings size={13} /> {car.transmission}
          </span>
          <span className="flex items-center gap-1">
            <Tag size={13} /> {car.category}
          </span>
        </div>

        {/* Features */}
        {car.features?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {car.features.slice(0, 3).map((f, i) => (
              <span
                key={i}
                className="bg-blue-50 text-blue-500 px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1"
              >
                <Star size={10} /> {f}
              </span>
            ))}
            {car.features.length > 3 && (
              <span className="text-slate-400 text-xs px-1">
                +{car.features.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Price & CTA */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-slate-800">
              ${car.pricePerDay}
            </span>
            <span className="text-slate-400 text-sm">/day</span>
          </div>
          <Link
            to={`/cars/${car._id}`}
            className={`px-4 py-2 rounded-lg text-sm font-semibold no-underline transition-colors ${
              car.available
                ? "bg-blue-500 hover:bg-blue-600 text-white"
                : "bg-slate-100 text-slate-400 pointer-events-none"
            }`}
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
