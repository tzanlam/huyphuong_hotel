package hotel.controller;

import hotel.modal.entity.Booking;
import hotel.modal.entity.Room;
import hotel.modal.reponse.DTO.BookingDTO;
import hotel.modal.reponse.DTO.RoomDTO;
import hotel.modal.request.BookingRequest;
import hotel.modal.request.LoginRequest;
import hotel.modal.request.SendMailRequest;
import hotel.service.booking.BookingService;
import hotel.service.global.AuthService;
import hotel.service.global.CloudinaryService;
import hotel.service.global.GlobalService;
import hotel.service.room.RoomService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@CrossOrigin("*")
@RequestMapping("/all")
public class AllController {
    @Autowired
    private AuthService authService;

    @Autowired
    private RoomService roomService;

    @Autowired
    private BookingService bookingService;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private GlobalService globalService;

    @Autowired
    private CloudinaryService cloudinaryService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        return new ResponseEntity<>(authService.login(request), HttpStatus.OK);
    }
    @GetMapping("/findRooms/{page}")
    public ResponseEntity<?> findAllRoom(@PathVariable int page) {
        Page<Room> rooms = roomService.findAll(page);

        // Sử dụng ModelMapper để chuyển từ Room sang RoomDTO
        List<RoomDTO> roomDTOS = rooms.getContent().stream()
                .map(room -> modelMapper.map(room, RoomDTO.class))
                .collect(Collectors.toList());

        return new ResponseEntity<>(roomDTOS, HttpStatus.OK);
    }

    @PostMapping("/createBooking")
    public ResponseEntity<?> createBooking(@RequestBody BookingRequest request) {
        return new ResponseEntity<>(modelMapper.map(bookingService.create(request), BookingDTO.class), HttpStatus.CREATED);
    }

    @GetMapping("/findRoomById/{id}")
    public ResponseEntity<?> findRoomById(@PathVariable int id) {
        return new ResponseEntity<>(modelMapper.map(roomService.findById(id),RoomDTO.class), HttpStatus.OK);
    }
    @GetMapping("/checkRoom/{startDate}/{endDate}")
    public ResponseEntity<?> checkRoom(@PathVariable String startDate, @PathVariable String endDate) {
        return new ResponseEntity<>(roomService.checkRoomAvailability(startDate, endDate), HttpStatus.OK);
    }

    @PostMapping("/sendMail")
    public ResponseEntity<?> sendMail(@RequestBody SendMailRequest request) {
        try {
            return new ResponseEntity<>(globalService.userSendMail(request), HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @GetMapping("/findRoomName/{id}")
    public ResponseEntity<?> findRoomName(@PathVariable int id) {
        return new ResponseEntity<>(roomService.findNameRoomByID(id), HttpStatus.OK);
    }
}
