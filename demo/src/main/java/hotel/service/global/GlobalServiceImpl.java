package hotel.service.global;

import hotel.modal.request.SendMailRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class GlobalServiceImpl implements GlobalService {
    @Autowired
    private JavaMailSender mailSender;
    private final String mailAdmin = "tzanlam@gmail.com";
    @Override
    public String userSendMail(SendMailRequest request) {
        SimpleMailMessage message = new SimpleMailMessage();

        // Đặt thông tin email
        message.setFrom(request.getTo());              // Email người gửi (người dùng)
        message.setTo(mailAdmin);         // Email nhận (đã xác định)
        message.setSubject("Khách hàng yêu cầu hỗ trợ");   // Tiêu đề email

        // Thiết kế nội dung email dưới dạng form
        StringBuilder emailContent = new StringBuilder();
        emailContent.append("Khách hàng yêu cầu hỗ trợ\n\n")
                .append("Tên khách hàng: ").append(request.getUsername()).append("\n")
                .append("Email khách hàng: ").append(request.getTo()).append("\n")
                .append("Chủ đề yêu cầu: ").append(request.getSubject()).append("\n")
                .append("Nội dung yêu cầu: ").append(request.getContent()).append("\n\n")
                .append("Cảm ơn đã liên hệ với chúng tôi!");

        message.setText(emailContent.toString()); // Gán nội dung đã định dạng vào email
        mailSender.send(message);
        return "Send success";
    }
}
