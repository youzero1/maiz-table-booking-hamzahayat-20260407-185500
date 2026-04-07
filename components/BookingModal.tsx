'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Restaurant, TimeSlot, ALLERGIES } from '@/lib/types';
import styles from './BookingModal.module.css';
import { FaTimes, FaCheck } from 'react-icons/fa';

interface BookingModalProps {
  restaurant: Restaurant;
  timeSlot: TimeSlot;
  partySize: number;
  onClose: () => void;
}

export default function BookingModal({ restaurant, timeSlot, partySize, onClose }: BookingModalProps) {
  const { data: session } = useSession();
  const [name, setName] = useState(session?.user?.name ?? '');
  const [email, setEmail] = useState(session?.user?.email ?? '');
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
  const [specialRequests, setSpecialRequests] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const toggleAllergy = (allergy: string) => {
    setSelectedAllergies((prev) =>
      prev.includes(allergy) ? prev.filter((a) => a !== allergy) : [...prev, allergy]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurantId: restaurant.id,
          timeSlotId: timeSlot.id,
          date: timeSlot.date,
          time: timeSlot.time,
          partySize,
          userName: name,
          userEmail: email,
          allergies: selectedAllergies,
          specialRequests,
        }),
      });
      if (res.ok) {
        setSuccess(true);
      } else {
        setError('Failed to create booking. Please try again.');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className={styles.successState}>
            <div className={styles.successIcon}>
              <FaCheck />
            </div>
            <h2 className={styles.successTitle}>Booking Confirmed!</h2>
            <p className={styles.successDesc}>
              Your reservation at <strong>{restaurant.name}</strong> on{' '}
              <strong>{timeSlot.date}</strong> at <strong>{timeSlot.time}</strong> for{' '}
              <strong>{partySize} guests</strong> is confirmed.
            </p>
            {selectedAllergies.length > 0 && (
              <p className={styles.successDesc}>
                Allergies noted: {selectedAllergies.join(', ')}
              </p>
            )}
            <button className="btn-primary" onClick={onClose}>
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div>
            <h2 className={styles.modalTitle}>Complete Reservation</h2>
            <p className={styles.modalSubtitle}>
              {restaurant.name} &middot; {timeSlot.date} at {timeSlot.time} &middot; {partySize} guests
            </p>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className={styles.errorMsg}>{error}</div>}

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Your full name"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Allergies (select all that apply)</label>
            <div className={styles.allergyGrid}>
              {ALLERGIES.map((allergy) => (
                <button
                  key={allergy}
                  type="button"
                  className={`${styles.allergyBtn} ${selectedAllergies.includes(allergy) ? styles.allergyBtnActive : ''}`}
                  onClick={() => toggleAllergy(allergy)}
                >
                  {allergy.charAt(0).toUpperCase() + allergy.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Special Requests</label>
            <textarea
              className="form-input"
              rows={3}
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              placeholder="Any special requests, dietary needs, or occasion details..."
              style={{ resize: 'vertical' }}
            />
          </div>

          <div className={styles.actions}>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Confirming...' : 'Confirm Reservation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
