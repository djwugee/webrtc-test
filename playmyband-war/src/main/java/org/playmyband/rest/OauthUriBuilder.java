package org.playmyband.rest;

import java.net.URI;
import javax.ws.rs.core.UriBuilder;

public class OauthUriBuilder {
    public static URI buildOauthURI(UriBuilder ub, String oauthURL, String clientId, String redirectUri, String scope )
    {
        URI userUri = ub.fromUri(oauthURL).
                queryParam("client_id", clientId).
                queryParam("response_type", "code").
                queryParam("redirect_uri", redirectUri).
                queryParam("state", "whatever").
                queryParam("scope", scope).
                build();
        return userUri;
    }
}
