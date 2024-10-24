package hotel.modal.reponse;

import lombok.Data;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

@Data
public class AuthReponse {
    private String token;
    private String username;
    private Collection<? extends GrantedAuthority> authorities;

    public AuthReponse(String token, String username, Collection<? extends GrantedAuthority> authorities) {
        this.token = token;
        this.username = username;
        this.authorities = authorities;
    }
}
