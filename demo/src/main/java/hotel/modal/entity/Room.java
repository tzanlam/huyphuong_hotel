package hotel.modal.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "room")
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "bed_quantity", nullable = false)
    private int bedQuantity;

    @Column(name = "room_quantity", nullable = false)
    private int roomQuantity;

    @Column(name = "name", nullable = false, unique = true)
    private String roomName;

    @Column(name = "description")
    private String description;

    @Column(name = "image", nullable = false)
    private String image;

    @Column(name = "price_day", nullable = false)
    private double priceDay;

    @Column(name = "price_night", nullable = false)
    private double priceNight;
}
