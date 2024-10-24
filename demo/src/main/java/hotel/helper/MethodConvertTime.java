package hotel.helper;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Date;

public class MethodConvertTime {
    // Chuyển đổi từ String sang Date (yyyy-MM-dd)
    public static Date convertDate(String date) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        try {
            LocalDate localDate = LocalDate.parse(date, formatter);
            return Date.from(localDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid date format. Please use yyyy-MM-dd.");
        }
    }

    // Chuyển đổi từ String sang LocalDateTime (yyyy-MM-dd'T'HH:mm:ss)
    public static LocalDateTime convertDateTime(String dateTimeString) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");
        try {
            return LocalDateTime.parse(dateTimeString, formatter);
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid datetime format. Please use yyyy-MM-dd'T'HH:mm:ss.");
        }
    }
}
