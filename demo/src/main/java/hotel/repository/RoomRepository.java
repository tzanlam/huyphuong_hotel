package hotel.repository;

import hotel.modal.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface RoomRepository  extends JpaRepository<Room, Integer> {

    // Truy vấn để tìm phòng trống trong khoảng thời gian checkin và checkout
    @Query("SELECT r FROM Room r WHERE r.roomName NOT IN "
            + "(SELECT b.roomName FROM Booking b WHERE b.checkin < :checkout AND b.checkout > :checkin)")
    List<Room> findAvailableRooms(@Param("checkin") LocalDateTime checkin, @Param("checkout") LocalDateTime checkout);
}
