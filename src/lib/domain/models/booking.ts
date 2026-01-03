export type Booking = {
    id: string;
    entityId: string;
    userId: string;
    startDate: Date;
    endDate: Date;
    status: 'confirmed' | 'cancelled' | 'pending';
};
