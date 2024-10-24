package hotel.configs.moreConfigs;

import org.modelmapper.Converter;
import org.modelmapper.ModelMapper;
import org.modelmapper.spi.MappingContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;




@Configuration
public class MoreConfigs {
    @Bean
    public ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper();

        // Custom Converter: String -> LocalDateTime
        Converter<String, LocalDateTime> toLocalDateTime = new Converter<String, LocalDateTime>() {
            @Override
            public LocalDateTime convert(MappingContext<String, LocalDateTime> context) {
                return LocalDateTime.parse(context.getSource(), DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss"));
            }
        };

        // Custom Converter: LocalDateTime -> String
        Converter<LocalDateTime, String> toString = new Converter<LocalDateTime, String>() {
            @Override
            public String convert(MappingContext<LocalDateTime, String> context) {
                return context.getSource().format(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss"));
            }
        };

        modelMapper.addConverter(toLocalDateTime);
        modelMapper.addConverter(toString);

        return modelMapper;
    }

}
// Uncomment để sử dụng
// @Bean
// public CommonsMultipartResolver multipartResolver() {
//     CommonsMultipartResolver multipartResolver = new CommonsMultipartResolver();
//     multipartResolver.setMaxUploadSize(10485760); // 10MB
//     return multipartResolver;
// }

