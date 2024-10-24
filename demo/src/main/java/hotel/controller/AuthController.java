package hotel.controller;

import hotel.modal.entity.Booking;
import hotel.modal.entity.Room;
import hotel.modal.reponse.DTO.BookingDTO;
import hotel.modal.reponse.DTO.RoomDTO;
import hotel.modal.request.BookingRequest;
import hotel.modal.request.RoomRequest;
import hotel.service.booking.BookingService;
import hotel.service.global.CloudinaryService;
import hotel.service.global.EmailService;
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
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private RoomService roomService;
    @Autowired
    private BookingService bookingService;
    @Autowired
    private CloudinaryService cloudinaryService;

    @PostMapping("/createRoom")
    public ResponseEntity<?> create(@RequestBody RoomRequest roomRequest) throws IOException {
        return new ResponseEntity<>(modelMapper.map(roomService.create(roomRequest), RoomDTO.class), HttpStatus.CREATED);
    }

    @PutMapping("/updateRoom/{id}")
    public ResponseEntity<?> update(@PathVariable int id,@RequestBody RoomRequest roomRequest) throws Exception {
        Room updatedRoom = roomService.update(id, roomRequest);
        return new ResponseEntity<>(modelMapper.map(updatedRoom, RoomDTO.class), HttpStatus.OK);
    }

    @GetMapping("/deleteRoom/{id}")
    public ResponseEntity<?> delete(@PathVariable int id) {
        return new ResponseEntity<>(modelMapper.map(roomService.delete(id), RoomDTO.class),HttpStatus.OK);
    }

    @GetMapping("/findBookings/{page}")
    public ResponseEntity<?> findBookings(@PathVariable int page){
        Page<Booking> bookings = bookingService.find(page);
        List<BookingDTO> bookingList = bookings.getContent().stream()
                .map(booking-> modelMapper.map(booking, BookingDTO.class))
                .collect(Collectors.toList());
        return new ResponseEntity<>(bookingList , HttpStatus.OK);
    }

    @GetMapping("/deleteBooking/{id}")
    public ResponseEntity<?> deleteBooking(@PathVariable int id) {
        return new ResponseEntity<>(modelMapper.map(bookingService.delete(id), BookingDTO.class), HttpStatus.OK);
    }

    @PutMapping("/updateBooking/{id}")
    public ResponseEntity<?> updateBooking(@PathVariable int id, @RequestBody BookingRequest bookingRequest) {
        return new ResponseEntity<>(modelMapper.map(bookingService.update(id, bookingRequest), BookingDTO.class),HttpStatus.OK);
    }
    @PostMapping("/postImg")
    public String postImg(@RequestBody MultipartFile file) throws IOException {
        return cloudinaryService.uploadImage(file);
    }
}
