package hotel.service.global;

import hotel.modal.request.SendMailRequest;

public interface GlobalService {
    String userSendMail(SendMailRequest request);
}
