import { useEffect, useState } from 'react';
import { bookingService } from '../services/bookingService';
import Spinner from '../components/common/Spinner';
import MainLayout from '../layouts/MainLayout';
import toast from 'react-hot-toast';
import { CalendarDays, ClipboardList, Car, XCircle, DollarSign } from 'lucide-react';

const statusColors = {
  pending: { bg: '#fef3c7', text: '#92400e' },
  confirmed: { bg: '#d1fae5', text: '#065f46' },
  cancelled: { bg: '#fee2e2', text: '#991b1b' },
  completed: { bg: '#ede9fe', text: '#5b21b6' },
};

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);

  const fetchBookings = async () => {
    try {
      const { data } = await bookingService.getMyBookings();
      setBookings(data.bookings);
    } catch {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleCancel = async (id) => {
    if (!confirm('Cancel this booking?')) return;
    setCancelling(id);
    try {
      await bookingService.updateBookingStatus(id, 'cancelled');
      toast.success('Booking cancelled');
      setBookings(prev => prev.map(b => b._id === id ? { ...b, status: 'cancelled' } : b));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel');
    } finally {
      setCancelling(null);
    }
  };

  return (
    <MainLayout>
      <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '0 2rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1e293b', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ClipboardList size={28} color="#3b82f6" />
          My Bookings
        </h1>

        {loading ? (
          <Spinner />
        ) : bookings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <ClipboardList size={64} style={{ color: '#cbd5e1', marginBottom: '1rem' }} />
            <p style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1e293b' }}>No bookings yet</p>
            <p style={{ color: '#64748b' }}>Book a car to see your reservations here.</p>
            <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '1rem', padding: '0.7rem 1.5rem', background: '#3b82f6', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: 600 }}>
              <Car size={16} /> Browse Fleet
            </a>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {bookings.map(booking => {
              const colors = statusColors[booking.status] || statusColors.pending;
              const isPending = booking.status === 'pending';
              const start = new Date(booking.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
              const end = new Date(booking.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

              return (
                <div key={booking._id} style={{
                  background: '#fff', borderRadius: '16px', padding: '1.5rem',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0',
                  display: 'grid', gridTemplateColumns: '80px 1fr auto', gap: '1.25rem', alignItems: 'center',
                }}>
                  <img
                    src={booking.car?.image}
                    alt={booking.car?.name}
                    style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '10px' }}
                    onError={e => { e.target.src = 'https://via.placeholder.com/80x60?text=Car'; }}
                  />

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                      <span style={{ fontWeight: 700, color: '#1e293b', fontSize: '1.05rem' }}>
                        {booking.car?.brand} {booking.car?.name}
                      </span>
                      <span style={{
                        background: colors.bg, color: colors.text,
                        padding: '2px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'capitalize',
                      }}>
                        {booking.status}
                      </span>
                    </div>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CalendarDays size={14} /> {start} → {end}
                    </p>
                    <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.85rem' }}>
                      ID: <code style={{ fontSize: '0.8rem', background: '#f1f5f9', padding: '1px 6px', borderRadius: '4px' }}>{booking._id.slice(-8)}</code>
                    </p>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: '0 0 0.5rem', fontSize: '1.3rem', fontWeight: 800, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
                      <DollarSign size={18} color="#3b82f6" />{booking.totalPrice}
                    </p>
                    {isPending && (
                      <button
                        onClick={() => handleCancel(booking._id)}
                        disabled={cancelling === booking._id}
                        style={{
                          padding: '0.4rem 1rem', background: '#fff', border: '1px solid #fca5a5',
                          color: '#ef4444', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
                          display: 'flex', alignItems: 'center', gap: '4px',
                        }}
                      >
                        <XCircle size={14} />
                        {cancelling === booking._id ? '...' : 'Cancel'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default MyBookingsPage;