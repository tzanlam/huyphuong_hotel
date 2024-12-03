package hotel.service.room;

import hotel.modal.entity.Room;
import hotel.modal.request.RoomRequest;
import hotel.repository.RoomRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class RoomServiceImpl implements RoomService {

    private static final Logger logger = LoggerFactory.getLogger(RoomServiceImpl.class);

    @Autowired
    private RoomRepository roomRepository;
    @Override
    public Page<Room> findAll(int page) {
        return roomRepository.findAll(PageRequest.of(page, 10));
    }

    @Override
    public Room create(RoomRequest request) throws IOException {
        Room room = populateRoom(request);
        roomRepository.save(room);
        return room;
    }

    @Override
    public Room update(int id, RoomRequest request) throws Exception {
        Room room = roomRepository.findById(id).orElse(null);
        if (room == null) {
            return null;
        } else {
           room = populateRoom(request);
           room.setId(id);
            roomRepository.save(room); // Lưu thay đổi
            return room;
        }
    }

    @Override
    public Room delete(int id) {
        return roomRepository.findById(id).map(room -> {
            room.setRoomQuantity(0); // Soft delete
            roomRepository.save(room);
            return room;
        }).orElseThrow(() -> new EntityNotFoundException("Room not found with id: " + id));
    }

    @Override
    public Room findById(int id) {
        return roomRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Room not found with id: " + id));
    }

    @Override
    public List<Room> checkRoomAvailability(String checkin, String checkout) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        LocalDateTime checkinTime = LocalDateTime.parse(checkin, formatter);
        LocalDateTime checkoutTime = LocalDateTime.parse(checkout, formatter);

        // Truy vấn cơ sở dữ liệu để kiểm tra tình trạng phòng còn trống
        List<Room> availableRooms = roomRepository.findAvailableRooms(checkinTime, checkoutTime);

        // Trả về danh sách các phòng còn trống
        return availableRooms;
    }

    private Room populateRoom(RoomRequest request) throws IOException {
        Room room = new Room();
        room.setRoomName(request.getRoomName());
        room.setRoomQuantity(request.getRoomQuantity());
        room.setBedQuantity(request.getBedQuantity());
        room.setDescription(request.getDescription());
        room.setImage(request.getImage());
        room.setPriceDay(request.getPriceDay());
        room.setPriceNight(request.getPriceNight());
        return room;
    }
}
