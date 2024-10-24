package hotel.service.global;

import hotel.modal.entity.Booking;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


@Service
public class EmailService {
    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    public void sendBookingEmail(Booking booking) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            String subject = booking.getStatus().equals("CANCELLED") ? "HỦY ĐẶT PHÒNG" : "ĐẶT PHÒNG MỚI";
            String emailContent = buildEmailContent(booking);

            helper.setTo("tzanlam@gmail.com");
            helper.setSubject(subject);
            helper.setText(emailContent, true);

            mailSender.send(message);
            logger.info("Email sent successfully for booking ID: {}", booking.getId());
        } catch (MessagingException e) {
            logger.error("Error while sending email for booking ID: {}", booking.getId(), e);
        }
    }

    private String buildEmailContent(Booking booking) {
        return "<html>" +
                "<body>" +
                "<h2>Thông tin đặt phòng:</h2>" +
                "<ul>" +
                "<li><strong>ID:</strong> " + booking.getId() + "</li>" +
                "<li><strong>Họ tên:</strong> " + booking.getFullName() + "</li>" +
                "<li><strong>Số điện thoại:</strong> " + booking.getPhoneNumber() + "</li>" +
                "<li><strong>Tên phòng:</strong> " + booking.getRoomName() + "</li>" +
                "<li><strong>Thời gian nhận phòng:</strong> " + booking.getCheckin() + "</li>" +
                "<li><strong>Thời gian trả phòng:</strong> " + booking.getCheckout() + "</li>" +
                "<li><strong>Giá tổng:</strong> " + booking.getTotalPrice() + " VND</li>" +
                "</ul>" +
                "</body>" +
                "</html>";
    }
}
