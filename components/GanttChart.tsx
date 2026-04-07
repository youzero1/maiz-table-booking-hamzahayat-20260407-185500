'use client';

import { Booking, Restaurant } from '@/lib/types';
import styles from './GanttChart.module.css';

interface GanttChartProps {
  bookings: Booking[];
  restaurant: Restaurant;
  date: string;
}

const TIME_SLOTS = [
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
  '20:00', '20:30', '21:00', '21:30',
];

const STATUS_COLORS: Record<string, string> = {
  confirmed: '#38a169',
  pending: '#d69e2e',
  cancelled: '#e53e3e',
};

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

export default function GanttChart({ bookings, restaurant, date }: GanttChartProps) {
  const minTime = timeToMinutes(TIME_SLOTS[0]);
  const maxTime = timeToMinutes(TIME_SLOTS[TIME_SLOTS.length - 1]) + 30;
  const totalMinutes = maxTime - minTime;

  if (bookings.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No bookings to display in Gantt view for the selected filters.</p>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.gantt}>
        <div className={styles.tableColumn}>
          <div className={styles.tableHeader}>Table</div>
          {restaurant.tables.map((table) => (
            <div key={table.id} className={styles.tableRow}>
              <div className={styles.tableName}>{table.name}</div>
              <div className={styles.tableLocation}>{table.location}</div>
            </div>
          ))}
        </div>

        <div className={styles.timelineColumn}>
          <div className={styles.timeHeader}>
            {TIME_SLOTS.map((slot) => (
              <div
                key={slot}
                className={styles.timeLabel}
                style={{
                  left: `${((timeToMinutes(slot) - minTime) / totalMinutes) * 100}%`,
                }}
              >
                {slot}
              </div>
            ))}
          </div>

          {restaurant.tables.map((table) => {
            const tableBookings = bookings.filter((b) => b.tableId === table.id);
            return (
              <div key={table.id} className={styles.timelineRow}>
                {tableBookings.map((booking) => {
                  const startMinutes = timeToMinutes(booking.time);
                  const durationMinutes = 90;
                  const left = ((startMinutes - minTime) / totalMinutes) * 100;
                  const width = (durationMinutes / totalMinutes) * 100;
                  return (
                    <div
                      key={booking.id}
                      className={styles.bookingBlock}
                      style={{
                        left: `${Math.max(0, left)}%`,
                        width: `${Math.min(width, 100 - Math.max(0, left))}%`,
                        background: STATUS_COLORS[booking.status] ?? '#c8a96e',
                      }}
                      title={`${booking.userName} - ${booking.partySize} guests${booking.allergies.length > 0 ? ` | Allergies: ${booking.allergies.join(', ')}` : ''}`}
                    >
                      <span className={styles.blockName}>{booking.userName}</span>
                      <span className={styles.blockInfo}>{booking.time} · {booking.partySize}p</span>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles.legend}>
        {Object.entries(STATUS_COLORS).map(([status, color]) => (
          <div key={status} className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: color }} />
            <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
