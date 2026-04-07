'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import BookingTable from '@/components/BookingTable';
import GanttChart from '@/components/GanttChart';
import { bookings, restaurants } from '@/lib/data';
import { Booking } from '@/lib/types';
import styles from './restaurant.module.css';
import { FaTable, FaChartBar, FaFilter } from 'react-icons/fa';

export default function RestaurantDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [view, setView] = useState<'table' | 'gantt'>('table');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterStatus, setFilterStatus] = useState<'all' | 'confirmed' | 'pending' | 'cancelled'>('all');
  const [localBookings, setLocalBookings] = useState<Booking[]>(bookings);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?role=restaurant');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div className={styles.loader} />
      </div>
    );
  }

  if (!session) return null;

  const restaurantId = (session.user as { restaurantId?: string }).restaurantId ?? '1';
  const restaurant = restaurants.find((r) => r.id === restaurantId);

  const filteredBookings = localBookings.filter((b) => {
    const matchesDate = b.date === selectedDate;
    const matchesStatus = filterStatus === 'all' || b.status === filterStatus;
    const matchesRestaurant = b.restaurantId === restaurantId;
    return matchesDate && matchesStatus && matchesRestaurant;
  });

  const handleStatusChange = (bookingId: string, newStatus: 'confirmed' | 'pending' | 'cancelled') => {
    setLocalBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
    );
  };

  const stats = {
    total: filteredBookings.length,
    confirmed: filteredBookings.filter((b) => b.status === 'confirmed').length,
    pending: filteredBookings.filter((b) => b.status === 'pending').length,
    cancelled: filteredBookings.filter((b) => b.status === 'cancelled').length,
    withAllergies: filteredBookings.filter((b) => b.allergies.length > 0).length,
  };

  return (
    <div className={styles.page}>
      <Header role="restaurant" />
      <div className="container">
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.pageTitle}>{restaurant?.name ?? 'Restaurant'} Dashboard</h1>
            <p className={styles.pageSubtitle}>Manage your reservations and table assignments</p>
          </div>
          <div className={styles.dateFilter}>
            <label className={styles.filterLabel}>Date</label>
            <input
              type="date"
              className="form-input"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>{stats.total}</div>
            <div className={styles.statLabel}>Total Bookings</div>
          </div>
          <div className={`${styles.statCard} ${styles.statConfirmed}`}>
            <div className={styles.statNumber}>{stats.confirmed}</div>
            <div className={styles.statLabel}>Confirmed</div>
          </div>
          <div className={`${styles.statCard} ${styles.statPending}`}>
            <div className={styles.statNumber}>{stats.pending}</div>
            <div className={styles.statLabel}>Pending</div>
          </div>
          <div className={`${styles.statCard} ${styles.statCancelled}`}>
            <div className={styles.statNumber}>{stats.cancelled}</div>
            <div className={styles.statLabel}>Cancelled</div>
          </div>
          <div className={`${styles.statCard} ${styles.statAllergies}`}>
            <div className={styles.statNumber}>{stats.withAllergies}</div>
            <div className={styles.statLabel}>With Allergies</div>
          </div>
        </div>

        <div className={styles.toolbar}>
          <div className={styles.viewToggle}>
            <button
              className={`${styles.viewBtn} ${view === 'table' ? styles.viewBtnActive : ''}`}
              onClick={() => setView('table')}
            >
              <FaTable /> Table View
            </button>
            <button
              className={`${styles.viewBtn} ${view === 'gantt' ? styles.viewBtnActive : ''}`}
              onClick={() => setView('gantt')}
            >
              <FaChartBar /> Gantt View
            </button>
          </div>

          <div className={styles.statusFilter}>
            <FaFilter style={{ color: 'var(--text-secondary)', fontSize: '14px' }} />
            <select
              className="form-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'confirmed' | 'pending' | 'cancelled')}
              style={{ width: 'auto', minWidth: '160px' }}
            >
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {view === 'table' ? (
          <BookingTable
            bookings={filteredBookings}
            onStatusChange={handleStatusChange}
          />
        ) : (
          <GanttChart
            bookings={filteredBookings}
            restaurant={restaurant ?? restaurants[0]}
            date={selectedDate}
          />
        )}
      </div>
    </div>
  );
}
