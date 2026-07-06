import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { carService } from "../services/carService";
import Spinner from "../components/common/Spinner";
import MainLayout from "../layouts/MainLayout";
import { useAuth } from "../context/AuthContext";
import {
  Users,
  Settings,
  Tag,
  DollarSign,
  ArrowLeft,
  CheckCircle,
  Star,
} from "lucide-react";

const CarDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await carService.getCarById(id);
        setCar(data.car);
      } catch {
        setError("Car not found.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (loading)
    return (
      <MainLayout>
        <Spinner />
      </MainLayout>
    );
  if (error || !car)
    return (
      <MainLayout>
        <div style={{ textAlign: "center", padding: "4rem" }}>
          <p style={{ fontSize: "1.2rem", color: "#ef4444" }}>
            {error || "Car not found"}
          </p>
          <Link to="/" style={{ color: "#3b82f6" }}>
            ← Back to Fleet
          </Link>
        </div>
      </MainLayout>
    );

  const specs = [
    {
      icon: <Users size={18} color="#3b82f6" />,
      label: "Seats",
      value: car.seats,
    },
    {
      icon: <Settings size={18} color="#3b82f6" />,
      label: "Transmission",
      value: car.transmission,
    },
    {
      icon: <Tag size={18} color="#3b82f6" />,
      label: "Category",
      value: car.category,
    },
    {
      icon: <DollarSign size={18} color="#3b82f6" />,
      label: "Price",
      value: `$${car.pricePerDay}/day`,
    },
  ];

  return (
    <MainLayout>
      <div
        style={{ maxWidth: "1100px", margin: "2rem auto", padding: "0 2rem" }}
      >
        <Link
          to="/"
          style={{
            color: "#3b82f6",
            textDecoration: "none",
            fontSize: "0.95rem",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            marginBottom: "1.5rem",
          }}
        >
          <ArrowLeft size={16} /> Back to Fleet
        </Link>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "2.5rem",
            background: "#fff",
            borderRadius: "20px",
            overflow: "hidden",
            boxShadow: "0 8px 40px rgba(0,0,0,0.1)",
            border: "1px solid #e2e8f0",
          }}
        >
          {/* Image */}
          <div style={{ position: "relative" }}>
            <img
              src={car.image}
              alt={car.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                minHeight: "350px",
              }}
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/600x400?text=Car+Image";
              }}
            />
            <span
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                background: car.available
                  ? "rgba(16,185,129,0.92)"
                  : "rgba(239,68,68,0.92)",
                color: "#fff",
                padding: "6px 14px",
                borderRadius: "20px",
                fontWeight: 700,
                fontSize: "0.85rem",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <CheckCircle size={14} />
              {car.available ? "Available" : "Unavailable"}
            </span>
          </div>

          {/* Details */}
          <div style={{ padding: "2.5rem" }}>
            <p
              style={{
                color: "#3b82f6",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                fontSize: "0.8rem",
                margin: "0 0 0.5rem",
              }}
            >
              {car.brand} · {car.category}
            </p>
            <h1
              style={{
                fontSize: "2rem",
                fontWeight: 800,
                color: "#1e293b",
                margin: "0 0 1.5rem",
              }}
            >
              {car.name}
            </h1>

            {/* Specs */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
                marginBottom: "1.5rem",
              }}
            >
              {specs.map(({ icon, label, value }) => (
                <div
                  key={label}
                  style={{
                    background: "#f8fafc",
                    borderRadius: "10px",
                    padding: "1rem",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.75rem",
                      color: "#64748b",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    {icon} {label}
                  </p>
                  <p
                    style={{
                      margin: "4px 0 0",
                      fontWeight: 700,
                      color: "#1e293b",
                      textTransform: "capitalize",
                    }}
                  >
                    {value}
                  </p>
                </div>
              ))}
            </div>

            {/* Features */}
            {car.features?.length > 0 && (
              <div style={{ marginBottom: "2rem" }}>
                <p
                  style={{
                    fontWeight: 700,
                    color: "#1e293b",
                    marginBottom: "0.5rem",
                  }}
                >
                  Features
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {car.features.map((f, i) => (
                    <span
                      key={i}
                      style={{
                        background: "#eff6ff",
                        color: "#3b82f6",
                        padding: "4px 12px",
                        borderRadius: "6px",
                        fontSize: "0.85rem",
                        fontWeight: 500,
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <Star size={11} /> {f}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Price */}
            <div
              style={{
                background: "linear-gradient(135deg, #eff6ff, #dbeafe)",
                borderRadius: "12px",
                padding: "1.25rem",
                marginBottom: "1.5rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <p
                  style={{
                    margin: 0,
                    color: "#3b82f6",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <DollarSign size={14} /> Daily Rate
                </p>
                <p
                  style={{
                    margin: "4px 0 0",
                    fontSize: "2rem",
                    fontWeight: 800,
                    color: "#1e293b",
                  }}
                >
                  ${car.pricePerDay}
                  <span
                    style={{
                      fontSize: "1rem",
                      color: "#64748b",
                      fontWeight: 400,
                    }}
                  >
                    /day
                  </span>
                </p>
              </div>
            </div>

            {/* CTA */}
            {car.available ? (
              user ? (
                <button
                  onClick={() => navigate(`/book/${car._id}`)}
                  style={{
                    width: "100%",
                    padding: "1rem",
                    background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "12px",
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    boxShadow: "0 4px 15px rgba(59,130,246,0.4)",
                  }}
                >
                  <CheckCircle size={20} /> Book Now
                </button>
              ) : (
                <Link
                  to="/login"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    padding: "1rem",
                    background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                    color: "#fff",
                    borderRadius: "12px",
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    textDecoration: "none",
                  }}
                >
                  <CheckCircle size={20} /> Login to Book
                </Link>
              )
            ) : (
              <button
                disabled
                style={{
                  width: "100%",
                  padding: "1rem",
                  background: "#e2e8f0",
                  color: "#94a3b8",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "1.1rem",
                  fontWeight: 700,
                }}
              >
                Currently Unavailable
              </button>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CarDetailPage;
