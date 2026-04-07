'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { restaurants, reviews, generateTimeSlots } from '@/lib/data';
import { ALLERGIES } from '@/lib/types';
import Header from '@/components/Header';
import StarRating from '@/components/StarRating';
import BookingModal from '@/components/BookingModal';
import styles from './restaurant.module.css';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaUsers, FaStar, FaLeaf } from 'react-icons/fa';

export default function RestaurantDetailPage() {
  const params = useParams();
  const router = useRouter();
  const restaurantId = params.id as string;

  const restaurant = restaurants.find((r) => r.id === restaurantId);
  const restaurantReviews = reviews.filter((r) => r.restaurantId === restaurantId);

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [partySize, setPartySize] = useState(2);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'location'>('overview');

  if (!restaurant) {
    return (
      <div style={{ textAlign: 'center', padding: '100px' }}>
        <h2>Restaurant not found</h2>
        <button className="btn-primary" onClick={() => router.push('/consumer')}>Back to Home</button>
      </div>
    );
  }

  const timeSlots = generateTimeSlots(restaurantId, selectedDate);

  const handleSlotSelect = (slotId: string) => {
    setSelectedSlot(slotId);
    setShowBookingModal(true);
  };

  const selectedTimeSlot = timeSlots.find((ts) => ts.id === selectedSlot);

  return (
    <div className={styles.page}>
      <Header role="consumer" />

      <div className={styles.heroImage}>
        <Image
          src={restaurant.image}
          alt={restaurant.name}
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
        <div className={styles.heroOverlay} />
        <div className={styles.heroInfo}>
          <div className="container">
            <button className={styles.backBtn} onClick={() => router.push('/consumer')}>
              ← Back to Restaurants
            </button>
            <h1 className={styles.restaurantName}>{restaurant.name}</h1>
            <div className={styles.metaRow}>
              <span className={styles.cuisine}>{restaurant.cuisine}</span>
              <span className={styles.price}>{restaurant.priceRange}</span>
              <div className={styles.ratingBadge}>
                <FaStar style={{ color: '#f6c90e' }} />
                <span>{restaurant.rating}</span>
                <span style={{ opacity: 0.8 }}>({restaurant.reviewCount} reviews)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className={styles.content}>
          <div className={styles.mainContent}>
            <div className={styles.tabs}>
              {(['overview', 'reviews', 'location'] as const).map((tab) => (
                <button
                  key={tab}
                  className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {activeTab === 'overview' && (
              <div>
                <h2 className={styles.sectionHeading}>About</h2>
                <p className={styles.description}>{restaurant.description}</p>

                <h2 className={styles.sectionHeading}>Table Locations</h2>
                <div className={styles.tablesGrid}>
                  {restaurant.tables.map((table) => (
                    <div key={table.id} className={styles.tableCard}>
                      <div className={styles.tableIcon}>
                        <FaUsers />
                      </div>
                      <div>
                        <div className={styles.tableName}>{table.name}</div>
                        <div className={styles.tableLocation}>{table.location}</div>
                        <div className={styles.tableCapacity}>Up to {table.capacity} guests</div>
                      </div>
                    </div>
                  ))}
                </div>

                <h2 className={styles.sectionHeading}>Allergy Information</h2>
                <div className={styles.allergyGrid}>
                  {ALLERGIES.map((allergy) => (
                    <div key={allergy} className={styles.allergyTag}>
                      <FaLeaf style={{ fontSize: '12px' }} />
                      {allergy.charAt(0).toUpperCase() + allergy.slice(1)}
                    </div>
                  ))}
                </div>
                <p className={styles.allergyNote}>
                  You can specify your allergies when making a booking. Our kitchen will be notified.
                </p>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className={styles.reviewsList}>
                <h2 className={styles.sectionHeading}>Customer Reviews</h2>
                {restaurantReviews.length === 0 ? (
                  <p style={{ color: 'var(--text-secondary)' }}>No reviews yet. Be the first to review!</p>
                ) : (
                  restaurantReviews.map((review) => (
                    <div key={review.id} className={styles.reviewCard}>
                      <div className={styles.reviewHeader}>
                        <div className={styles.reviewerInfo}>
                          <Image
                            src={review.userAvatar}
                            alt={review.userName}
                            width={44}
                            height={44}
                            style={{ borderRadius: '50%', objectFit: 'cover' }}
                          />
                          <div>
                            <div className={styles.reviewerName}>{review.userName}</div>
                            <div className={styles.reviewDate}>{review.date}</div>
                          </div>
                        </div>
                        <StarRating rating={review.rating} />
                      </div>
                      <p className={styles.reviewComment}>{review.comment}</p>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'location' && (
              <div>
                <h2 className={styles.sectionHeading}>Location & Contact</h2>
                <div className={styles.contactGrid}>
                  <div className={styles.contactItem}>
                    <FaMapMarkerAlt className={styles.contactIcon} />
                    <div>
                      <div className={styles.contactLabel}>Address</div>
                      <div className={styles.contactValue}>{restaurant.address}</div>
                    </div>
                  </div>
                  <div className={styles.contactItem}>
                    <FaPhone className={styles.contactIcon} />
                    <div>
                      <div className={styles.contactLabel}>Phone</div>
                      <div className={styles.contactValue}>{restaurant.phone}</div>
                    </div>
                  </div>
                  <div className={styles.contactItem}>
                    <FaEnvelope className={styles.contactIcon} />
                    <div>
                      <div className={styles.contactLabel}>Email</div>
                      <div className={styles.contactValue}>{restaurant.email}</div>
                    </div>
                  </div>
                  <div className={styles.contactItem}>
                    <FaClock className={styles.contactIcon} />
                    <div>
                      <div className={styles.contactLabel}>Hours</div>
                      <div className={styles.contactValue}>{restaurant.openingHours}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className={styles.sidebar}>
            <div className={styles.bookingWidget}>
              <h3 className={styles.widgetTitle}>Make a Reservation</h3>

              <div className="form-group">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={selectedDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Party Size</label>
                <select
                  className="form-select"
                  value={partySize}
                  onChange={(e) => setPartySize(Number(e.target.value))}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                    <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                  ))}
                </select>
              </div>

              <div className={styles.timeSlotsLabel}>Available Times</div>
              <div className={styles.timeSlots}>
                {timeSlots.map((slot) => (
                  <button
                    key={slot.id}
                    className={`${styles.timeSlot} ${!slot.available ? styles.timeSlotUnavailable : ''} ${selectedSlot === slot.id ? styles.timeSlotSelected : ''}`}
                    onClick={() => slot.available && handleSlotSelect(slot.id)}
                    disabled={!slot.available}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showBookingModal && selectedTimeSlot && (
        <BookingModal
          restaurant={restaurant}
          timeSlot={selectedTimeSlot}
          partySize={partySize}
          onClose={() => setShowBookingModal(false)}
        />
      )}
    </div>
  );
}
