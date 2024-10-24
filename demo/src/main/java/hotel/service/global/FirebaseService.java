package hotel.service.global;

import com.google.cloud.storage.Blob;
import com.google.firebase.cloud.StorageClient;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class FirebaseService {
    // Phương thức để upload ảnh lên Firebase Storage
    public String uploadFile(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File must not be empty");
        }

        String fileName = file.getOriginalFilename();
        Blob blob = StorageClient.getInstance()
                .bucket()
                .create("images/" + fileName, file.getBytes(), file.getContentType());

        return blob.getMediaLink(); // Trả về URL của ảnh trên Firebase
    }
}
