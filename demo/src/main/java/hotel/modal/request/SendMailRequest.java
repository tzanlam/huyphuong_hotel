package hotel.modal.request;

import lombok.Data;

@Data
public class SendMailRequest {
    private String to;
    private String subject;
    private String content;
}
