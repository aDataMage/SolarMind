export type Entity = {
  id: string;
  name: string;
  status: 'available' | 'booked';
  // Add industry-specific fields
};

// Booking model example
export type Booking = {
  id: string;
  entityId: string;
  userId: string;
  startDate: Date;
  endDate: Date;
  status: 'confirmed' | 'cancelled' | 'pending';
};
