package hotel.service.room;

import hotel.modal.entity.Room;
import hotel.modal.request.RoomRequest;
import org.springframework.data.domain.Page;

import java.io.IOException;
import java.util.List;

public interface RoomService {
    Page<Room> findAll(int page);
    Room create(RoomRequest request) throws IOException;
    Room update(int id, RoomRequest request) throws Exception;
    Room delete(int id);
    Room findById(int id);
    List<Room> checkRoomAvailability(String checkin, String checkout);
}
