'use client';

import { Booking } from '@/lib/types';
import styles from './BookingTable.module.css';
import { FaLeaf } from 'react-icons/fa';

interface BookingTableProps {
  bookings: Booking[];
  onStatusChange: (id: string, status: 'confirmed' | 'pending' | 'cancelled') => void;
}

export default function BookingTable({ bookings, onStatusChange }: BookingTableProps) {
  if (bookings.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No bookings found for the selected filters.</p>
      </div>
    );
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Guest</th>
            <th>Table</th>
            <th>Time</th>
            <th>Party</th>
            <th>Allergies</th>
            <th>Special Requests</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id} className={styles.row}>
              <td>
                <div className={styles.guestName}>{booking.userName}</div>
                <div className={styles.guestEmail}>{booking.userEmail}</div>
              </td>
              <td>
                <div className={styles.tableName}>{booking.tableName}</div>
                <div className={styles.tableLocation}>{booking.tableLocation}</div>
              </td>
              <td className={styles.time}>{booking.time}</td>
              <td className={styles.partySize}>{booking.partySize}</td>
              <td>
                {booking.allergies.length > 0 ? (
                  <div className={styles.allergiesList}>
                    {booking.allergies.map((a) => (
                      <span key={a} className={styles.allergyTag}>
                        <FaLeaf style={{ fontSize: '10px' }} />
                        {a}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className={styles.none}>None</span>
                )}
              </td>
              <td>
                <div className={styles.specialRequests}>
                  {booking.specialRequests || <span className={styles.none}>None</span>}
                </div>
              </td>
              <td>
                <span className={`badge ${
                  booking.status === 'confirmed' ? 'badge-success' :
                  booking.status === 'pending' ? 'badge-warning' : 'badge-error'
                }`}>
                  {booking.status}
                </span>
              </td>
              <td>
                <div className={styles.actionBtns}>
                  {booking.status !== 'confirmed' && (
                    <button
                      className={styles.confirmBtn}
                      onClick={() => onStatusChange(booking.id, 'confirmed')}
                    >
                      Confirm
                    </button>
                  )}
                  {booking.status !== 'cancelled' && (
                    <button
                      className={styles.cancelBtn}
                      onClick={() => onStatusChange(booking.id, 'cancelled')}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
