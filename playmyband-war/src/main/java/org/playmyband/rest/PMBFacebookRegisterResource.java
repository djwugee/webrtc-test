package org.playmyband.rest;

import java.net.URI;
import java.util.HashMap;
import java.util.Map;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriBuilder;
import javax.ws.rs.core.UriInfo;
import javax.ws.rs.core.Context;

@Path("/facebookRegister")
public class PMBFacebookRegisterResource {

    private static final String CLIENT_ID="1451789471806244";
    private static final String REDIRECT_URI = "http://playmybandnow.ddns.net:8080/playmyband/rest/facebookOauth2callback";
    private static final String OAUTH_URL = "https://www.facebook.com/dialog/oauth";
    private static final String OAUTH_SCOPE= "public_profile";
    
    
    @Context
    UriInfo uriInfo;

    @GET
    public Response handleOauthCallback() throws Exception {
        UriBuilder ub = uriInfo.getAbsolutePathBuilder();
        URI userUri = OauthUriBuilder.buildOauthURI(ub, OAUTH_URL, CLIENT_ID, REDIRECT_URI, OAUTH_SCOPE);        
        return Response.temporaryRedirect(userUri).build();
    }
}
