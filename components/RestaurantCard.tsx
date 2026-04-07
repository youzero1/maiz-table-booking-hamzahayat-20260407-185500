'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Restaurant } from '@/lib/types';
import StarRating from './StarRating';
import styles from './RestaurantCard.module.css';
import { FaMapMarkerAlt, FaClock, FaUsers } from 'react-icons/fa';

interface RestaurantCardProps {
  restaurant: Restaurant;
  selectedDate: string;
  partySize: number;
}

export default function RestaurantCard({ restaurant, selectedDate, partySize }: RestaurantCardProps) {
  return (
    <Link href={`/consumer/restaurant/${restaurant.id}`} className={styles.card}>
      <div className={styles.imageWrapper}>
        <Image
          src={restaurant.image}
          alt={restaurant.name}
          fill
          style={{ objectFit: 'cover' }}
          sizes="(max-width: 768px) 100vw, 400px"
        />
        <div className={styles.priceTag}>{restaurant.priceRange}</div>
        <div className={styles.cuisineTag}>{restaurant.cuisine}</div>
      </div>
      <div className={styles.body}>
        <div className={styles.titleRow}>
          <h3 className={styles.name}>{restaurant.name}</h3>
          <div className={styles.ratingPill}>
            <StarRating rating={restaurant.rating} compact />
            <span className={styles.ratingText}>{restaurant.rating}</span>
          </div>
        </div>
        <p className={styles.description}>{restaurant.description}</p>
        <div className={styles.meta}>
          <div className={styles.metaItem}>
            <FaMapMarkerAlt className={styles.metaIcon} />
            <span>{restaurant.address.split(',')[0]}</span>
          </div>
          <div className={styles.metaItem}>
            <FaClock className={styles.metaIcon} />
            <span>{restaurant.openingHours}</span>
          </div>
          <div className={styles.metaItem}>
            <FaUsers className={styles.metaIcon} />
            <span>{restaurant.reviewCount} reviews</span>
          </div>
        </div>
        <div className={styles.footer}>
          <span className={styles.footerInfo}>
            {selectedDate} &middot; {partySize} {partySize === 1 ? 'Guest' : 'Guests'}
          </span>
          <span className={styles.reserveBtn}>Reserve &rarr;</span>
        </div>
      </div>
    </Link>
  );
}
