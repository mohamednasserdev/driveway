import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { carService } from '../services/carService';
import { bookingService } from '../services/bookingService';
import Spinner from '../components/common/Spinner';
import MainLayout from '../layouts/MainLayout';
import toast from 'react-hot-toast';
import { CalendarDays, DollarSign, Clock, CheckCircle, ArrowLeft } from 'lucide-react';

const BookingPage = () => {
  const { carId } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ startDate: '', endDate: '', notes: '' });
  const [totalPrice, setTotalPrice] = useState(0);
  const [days, setDays] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await carService.getCarById(carId);
        setCar(data.car);
      } catch {
        toast.error('Car not found');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [carId]);

  useEffect(() => {
    if (form.startDate && form.endDate && car) {
      const start = new Date(form.startDate);
      const end = new Date(form.endDate);
      if (end > start) {
        const d = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        setDays(d);
        setTotalPrice(d * car.pricePerDay);
      } else {
        setDays(0);
        setTotalPrice(0);
      }
    }
  }, [form.startDate, form.endDate, car]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.startDate || !form.endDate) return toast.error('Please select dates');
    if (new Date(form.endDate) <= new Date(form.startDate)) return toast.error('End date must be after start date');

    setSubmitting(true);
    try {
      await bookingService.createBooking({ carId, ...form });
      toast.success('Booking confirmed!');
      navigate('/my-bookings');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  if (loading) return <MainLayout><Spinner /></MainLayout>;

  return (
    <MainLayout>
      <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '0 2rem' }}>
        <Link to={`/cars/${carId}`} style={{ color: '#3b82f6', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '1.5rem' }}>
          <ArrowLeft size={16} /> Back to Car Details
        </Link>

        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1e293b', marginBottom: '1.5rem' }}>
          Complete Your Booking
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '2rem' }}>
          {/* Car Summary */}
          <div>
            <div style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0', position: 'sticky', top: '90px' }}>
              <img src={car?.image} alt={car?.name} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
              <div style={{ padding: '1.25rem' }}>
                <p style={{ color: '#64748b', fontSize: '0.8rem', margin: '0 0 2px', textTransform: 'uppercase' }}>{car?.brand}</p>
                <h3 style={{ margin: '0 0 1rem', fontSize: '1.2rem', fontWeight: 700 }}>{car?.name}</h3>

                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                    <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <DollarSign size={13} /> Rate per day
                    </span>
                    <span style={{ fontWeight: 600 }}>${car?.pricePerDay}</span>
                  </div>

                  {days > 0 && (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                        <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={13} /> Duration
                        </span>
                        <span style={{ fontWeight: 600 }}>{days} days</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9', fontWeight: 700, color: '#1e293b', alignItems: 'center' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <DollarSign size={15} color="#3b82f6" /> Total
                        </span>
                        <span style={{ color: '#3b82f6', fontSize: '1.2rem' }}>${totalPrice}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div style={{ background: '#fff', borderRadius: '16px', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CalendarDays size={20} color="#3b82f6" /> Select Your Dates
            </h2>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={labelStyle}>
                  <CalendarDays size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                  Pick-up Date
                </label>
                <input
                  type="date" min={today} value={form.startDate}
                  onChange={e => setForm(f => ({ ...f, startDate: e.target.value, endDate: f.endDate < e.target.value ? '' : f.endDate }))}
                  required style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={labelStyle}>
                  <CalendarDays size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                  Return Date
                </label>
                <input
                  type="date" min={form.startDate || today} value={form.endDate}
                  onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))}
                  required style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={labelStyle}>Special Requests (optional)</label>
                <textarea
                  value={form.notes}
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  placeholder="Any special requests or notes..."
                  rows={3}
                  style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
                />
              </div>

              {totalPrice > 0 && (
                <div style={{ background: 'linear-gradient(135deg, #eff6ff, #dbeafe)', borderRadius: '10px', padding: '1rem', marginBottom: '1.5rem' }}>
                  <p style={{ margin: 0, color: '#3b82f6', fontWeight: 700, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <DollarSign size={16} /> Total Charge: ${totalPrice}
                  </p>
                  <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.85rem' }}>
                    Charged upon pickup. Free cancellation.
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting || !totalPrice}
                style={{
                  width: '100%', padding: '1rem',
                  background: submitting || !totalPrice ? '#e2e8f0' : 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  color: submitting || !totalPrice ? '#94a3b8' : '#fff',
                  border: 'none', borderRadius: '12px', fontSize: '1.05rem', fontWeight: 700,
                  cursor: submitting || !totalPrice ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                }}
              >
                <CheckCircle size={18} />
                {submitting ? 'Processing...' : 'Confirm Booking'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

const labelStyle = { display: 'block', fontWeight: 600, color: '#374151', fontSize: '0.9rem', marginBottom: '0.5rem' };
const inputStyle = {
  width: '100%', padding: '0.75rem 1rem', border: '2px solid #e2e8f0',
  borderRadius: '10px', fontSize: '0.95rem', color: '#1e293b',
  boxSizing: 'border-box', outline: 'none', background: '#f8fafc',
};

export default BookingPage;