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

@Path("/facebookOauth2callback")
public class PMBFacebookOauthResource {
    private static final Logger LOGGER = Logger.getLogger(PMBFacebookOauthResource.class.getName());
    @Context
    UriInfo uriInfo;
    
    
    @GET
    public Response handleOauthCallback(@QueryParam("state") String state, @QueryParam("access-token") String code)
    {
        LOGGER.log(Level.INFO, "outhCall From facebook{},{}", new Object[]{state, code});
        UriBuilder ub = uriInfo.getBaseUriBuilder();
        URI userUri = ub.path("../").build();        
        return Response.temporaryRedirect(userUri).build();
    }
}
