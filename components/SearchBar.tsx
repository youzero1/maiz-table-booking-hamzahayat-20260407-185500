'use client';

import styles from './SearchBar.module.css';
import { FaSearch, FaCalendarAlt, FaUsers } from 'react-icons/fa';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  selectedDate: string;
  setSelectedDate: (v: string) => void;
  partySize: number;
  setPartySize: (v: number) => void;
}

export default function SearchBar({
  searchQuery,
  setSearchQuery,
  selectedDate,
  setSelectedDate,
  partySize,
  setPartySize,
}: SearchBarProps) {
  return (
    <div className={styles.searchBar}>
      <div className={styles.field}>
        <FaSearch className={styles.icon} />
        <input
          type="text"
          placeholder="Search restaurants, cuisine..."
          className={styles.input}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className={styles.divider} />
      <div className={styles.field}>
        <FaCalendarAlt className={styles.icon} />
        <input
          type="date"
          className={styles.input}
          value={selectedDate}
          min={new Date().toISOString().split('T')[0]}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>
      <div className={styles.divider} />
      <div className={styles.field}>
        <FaUsers className={styles.icon} />
        <select
          className={styles.input}
          value={partySize}
          onChange={(e) => setPartySize(Number(e.target.value))}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
            <option key={n} value={n}>
              {n} {n === 1 ? 'Guest' : 'Guests'}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
