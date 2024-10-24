package hotel.modal.reponse.DTO;

import lombok.Data;

@Data
public class RoomDTO {
    private int id;
    private int bedQuantity;
    private int roomQuantity;
    private String roomName;
    private String description;
    private String image;
    private double priceDay;
    private double priceNight;
}
