package hotel.service.global;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class ImageService {
    @Autowired
    private Cloudinary cloudinary; // Inject Cloudinary instance

    public String uploadImage(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            return null; // Không có ảnh, trả về null
        }

        try {
            // Tải ảnh lên Cloudinary
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(),
                    ObjectUtils.asMap("folder", "huyphuong/"));

            // Trả về URL của ảnh sau khi tải lên
            return (String) uploadResult.get("secure_url");
        } catch (Exception e) {
            throw new IOException("Error uploading image to Cloudinary: " + e.getMessage(), e);
        }
    }
}
