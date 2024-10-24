package hotel.modal.reponse.DTO;

import lombok.Data;

@Data
public class BookingDTO {
    private int bookingId;
    private String fullName;
    private int phoneNumber;
    private String typeBooking;
    private String checkin;
    private String checkout;
    private double totalPrice;
}
