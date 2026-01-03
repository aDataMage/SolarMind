export class BookRoomUseCase {
    execute(roomId: string, dates: { from: Date; to: Date }) {
        console.log("Booking room...", roomId);
    }
}
