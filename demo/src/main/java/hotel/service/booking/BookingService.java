package hotel.service.booking;

import hotel.modal.entity.Booking;
import hotel.modal.entity.Room;
import hotel.modal.request.BookingRequest;
import org.springframework.data.domain.Page;

public interface BookingService {
    Page<Booking> find(int page);
    Booking create(BookingRequest request);
    Booking update(int id, BookingRequest request);
    Booking delete(int id);
}
