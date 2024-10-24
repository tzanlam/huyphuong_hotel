package hotel.modal.request;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class RoomRequest {
    private int bedQuantity;
    private int roomQuantity;
    private String roomName;
    private String description;
    private String image;
    private double priceDay;
    private double priceNight;
}
