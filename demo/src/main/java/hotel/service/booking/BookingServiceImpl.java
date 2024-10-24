package hotel.service.booking;

import hotel.modal.entity.Booking;
import hotel.modal.entity.Room;
import hotel.modal.entity.StatusBooking;
import hotel.modal.entity.TypeBooking;
import hotel.modal.request.BookingRequest;
import hotel.repository.BookingRepository;
import hotel.repository.RoomRepository;
import hotel.service.global.EmailService;
import hotel.service.room.RoomService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.List;

import static hotel.helper.MethodConvertTime.convertDateTime;

@Service
@Transactional
public class BookingServiceImpl implements BookingService {
    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private RoomService roomService;

    @Autowired
    private EmailService emailService;

    @Override
    public Page<Booking> find(int page) {
        return bookingRepository.findAll(PageRequest.of(page,10));
    }

    @Override
    public Booking create(BookingRequest request) {
        LocalDateTime checkinTime = convertDateTime(request.getCheckin());
        LocalDateTime checkoutTime = convertDateTime(request.getCheckout());
        Booking booking = new Booking();
        booking.setFullName(request.getFullName());
        booking.setPhoneNumber(request.getPhoneNumber());
        Room room = roomRepository.findById(request.getRoomId()).get();
        String name = room.getRoomName();
        booking.setRoomName(name);
        booking.setCheckin(checkinTime);
        booking.setCheckout(checkoutTime);
        booking.setStatus(StatusBooking.WAITING);
        switch (request.getTypeBooking()){
            case "1":{
                booking.setTypeBooking(TypeBooking.HOUR);
                long totalHours = ChronoUnit.HOURS.between(checkinTime, checkoutTime);
                if (totalHours <= 0) {
                    throw new IllegalArgumentException("Checkout time must be after checkin time.");
                } else if (totalHours > 10) {
                    throw new IllegalArgumentException("Hourly bookings cannot exceed 10 hours.");
                }
                booking.setTotalPrice(totalHours == 1 ? 70000 : 70000 + (totalHours - 1) * 20000);
                break;
            }
            case "2":{
                booking.setTypeBooking(TypeBooking.DAY);
                long totalDays = ChronoUnit.DAYS.between(checkinTime.toLocalDate(), checkoutTime.toLocalDate());
                booking.setTotalPrice(totalDays * room.getPriceDay());
                break;
            }
            case "3":{
                booking.setTypeBooking(TypeBooking.NIGHT);
                booking.setTotalPrice(room.getPriceNight());
                break;
            }
            default:
                throw new IllegalArgumentException("Invalid booking type.");
        }
        bookingRepository.save(booking);
        emailService.sendBookingEmail(booking);
        return booking;
    }

    @Override
    public Booking update(int id, BookingRequest request) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Booking not found"));
        LocalDateTime checkinTime = convertDateTime(request.getCheckin());
        LocalDateTime checkoutTime = convertDateTime(request.getCheckout());
        booking.setFullName(request.getFullName());
        booking.setPhoneNumber(request.getPhoneNumber());
        Room room = roomRepository.findById(request.getRoomId()).get();
        booking.setRoomName(room.getRoomName());
        booking.setCheckin(checkinTime);
        booking.setCheckout(checkoutTime);
        booking.setStatus(StatusBooking.WAITING);
        switch (request.getTypeBooking()){
            case "1":{
                booking.setTypeBooking(TypeBooking.HOUR);
                long totalHours = ChronoUnit.HOURS.between(checkinTime, checkoutTime);
                if (totalHours <= 0) {
                    throw new IllegalArgumentException("Checkout time must be after checkin time.");
                } else if (totalHours > 10) {
                    throw new IllegalArgumentException("Hourly bookings cannot exceed 10 hours.");
                }
                booking.setTotalPrice(totalHours == 1 ? 70000 : 70000 + (totalHours - 1) * 20000);
                break;
            }
            case "2":{
                booking.setTypeBooking(TypeBooking.DAY);
                long totalDays = ChronoUnit.DAYS.between(checkinTime.toLocalDate(), checkoutTime.toLocalDate());
                booking.setTotalPrice(totalDays * room.getPriceDay());
                break;
            }
            case "3":{
                booking.setTypeBooking(TypeBooking.NIGHT);
                booking.setTotalPrice(room.getPriceNight());
                break;
            }
            default:
                throw new IllegalArgumentException("Invalid booking type.");
        }
        booking.setId(id);
        bookingRepository.save(booking);
        emailService.sendBookingEmail(booking);
        return booking;
            }

    @Override
    public Booking delete(int id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Booking not found"));

        booking.setStatus(StatusBooking.CANCELLED);
        emailService.sendBookingEmail(booking);

        return booking;
    }
}
