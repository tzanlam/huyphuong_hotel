package hotel.modal.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "booking")
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(name = "phoneNumber", nullable = false)
    private String phoneNumber;

    @Column (name = "room_name", nullable = false)
    private String roomName;

    @Column(name = "type_booking", nullable = false)
    @Enumerated(EnumType.STRING)
    private TypeBooking typeBooking;

    @Column(name = "checkin", nullable = false)
    private LocalDateTime checkin;

    @Column(name = "checkout", nullable = false)
    private LocalDateTime checkout;

    @Column(name = "total_price", nullable = false)
    private double totalPrice;

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private StatusBooking status;
}
