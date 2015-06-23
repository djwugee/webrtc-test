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

@Path("/googleRegister")
public class PMBGoogleRegisterResource {

    private static final String CLIENT_ID = "8943139211-o7l23odnjqieppk8fim2v8omdk572nbl.apps.googleusercontent.com";
    private static final String REDIRECT_URI = "http://playmybandnow.ddns.net:8080/playmyband/rest/googleOauth2callback";
    private static final String OAUTH_URL = "https://accounts.google.com/o/oauth2/auth";
    private static final String OAUTH_SCOPE= "profile";    
    
    @Context
    UriInfo uriInfo;

    @GET
    public Response handleOauthCallback() throws Exception {
        UriBuilder ub = uriInfo.getAbsolutePathBuilder();
        URI userUri = OauthUriBuilder.buildOauthURI(ub, OAUTH_URL, CLIENT_ID, REDIRECT_URI, OAUTH_SCOPE);
        return Response.temporaryRedirect(userUri).build();
    }
}
