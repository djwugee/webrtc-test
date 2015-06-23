package org.playmyband.rest;

import java.net.URI;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriBuilder;
import javax.ws.rs.core.UriInfo;

@Path("/googleOauth2callback")
public class PMBGoogleOauthResource {
    private static final Logger LOGGER = Logger.getLogger(PMBGoogleOauthResource.class.getName());
    @Context
    UriInfo uriInfo;
    
    
    @GET
    public Response handleOauthCallback(@QueryParam("state") String state, @QueryParam("code") String code)
    {
        LOGGER.log(Level.INFO, "outhCall From google{},{}", new Object[]{state, code});
        UriBuilder ub = uriInfo.getBaseUriBuilder();
        URI userUri = ub.path("../").build();     
        return Response.temporaryRedirect(userUri).build();
    }
}
