package org.playmyband.sip;

import java.io.IOException;
import java.util.HashMap;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.annotation.Resource;
import javax.ejb.EJB;
import javax.inject.Inject;
import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.sip.Address;
import javax.servlet.sip.ServletTimer;
import javax.servlet.sip.SipApplicationSession;
import javax.servlet.sip.SipFactory;
import javax.servlet.sip.SipServlet;
import javax.servlet.sip.SipServletRequest;
import javax.servlet.sip.SipServletResponse;
import javax.servlet.sip.SipSession;
import javax.servlet.sip.SipSession.State;
import javax.servlet.sip.SipURI;
import javax.servlet.sip.TimerListener;
import org.plymyband.PMBRegistry;


public class PMBSipServlet extends SipServlet implements TimerListener {

    private static final Logger LOGGER = Logger.getLogger(PMBSipServlet.class.getName());
    private static final long serialVersionUID = 1L;
    private static final String CONTENT_TYPE = "text/plain;charset=UTF-8";

    @Resource
    SipFactory sipFactory;

    HashMap<SipSession, SipSession> sessions = new HashMap<SipSession, SipSession>();

    @EJB()
    private PMBRegistry registry;
    
    private static final String LAST_REQ_ATT = "lastRequest";
    private static final String LAST_RES_ATT = "lastResponse";
    
    private static final int SESSION_EXPIRES_MINS = 10;
    

    @Override
    public void init(ServletConfig servletConfig) throws ServletException {
        super.init(servletConfig);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    protected void doInvite(SipServletRequest request) throws ServletException,
            IOException {
        request.getSession().setAttribute(LAST_REQ_ATT, request);
        
        LOGGER.log(Level.INFO, "Simple Servlet: Got request:{}", request.getMethod());

        SipServletRequest outRequest = sipFactory.createRequest(request.getApplicationSession(),
                "INVITE", request.getFrom().getURI(), request.getTo().getURI());
        String user = ((SipURI) request.getTo().getURI()).getUser();
        SipFactory sipFactory = (SipFactory) getServletContext().getAttribute(SIP_FACTORY);
        Address calleeAddress = sipFactory.createAddress(registry.retrieveAddres(user));
        if (calleeAddress != null) {
            outRequest.setRequestURI(calleeAddress.getURI());
            if (request.getContent() != null) {
                outRequest.setContent(request.getContent(), request.getContentType());
            }
            outRequest.send();
            sessions.put(request.getSession(), outRequest.getSession());
            sessions.put(outRequest.getSession(), request.getSession());
        } else {
            request.createResponse(SipServletResponse.SC_NOT_FOUND).send();
        }

    }

    @Override
    protected void doAck(SipServletRequest request) throws ServletException,
            IOException {
        SipServletResponse response = (SipServletResponse) sessions.get(request.getSession()).getAttribute(LAST_RES_ATT);
        response.createAck().send();
        SipApplicationSession sipApplicationSession = request.getApplicationSession();
        // Defaulting the sip application session to 1h
        sipApplicationSession.setExpires(SESSION_EXPIRES_MINS);
    }

    @Override
    protected void doRegister(SipServletRequest request) throws ServletException,
            IOException {

        Address addr = request.getAddressHeader("Contact");
        String user = ((SipURI) request.getFrom().getURI()).getUser();
        registry.register(user, addr.toString());
        LOGGER.log(Level.INFO, "Address registered {}", addr);
        SipServletResponse sipServletResponse = request.createResponse(SipServletResponse.SC_OK);
        sipServletResponse.send();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    protected void doBye(SipServletRequest request) throws ServletException,
            IOException {
        request.getSession().setAttribute(LAST_REQ_ATT, request);
        LOGGER.log(Level.INFO,"Got BYE request:{}", request);
        sessions.get(request.getSession()).createRequest("BYE").send();
    }

    @Override
    protected void doMessage(SipServletRequest request) throws ServletException,
            IOException {
        request.getSession().setAttribute(LAST_REQ_ATT, request);
        LOGGER.log(Level.INFO, "Got MESSAGE request:{}", request);
        SipSession sipSession = sessions.get(request.getSession());
        SipServletRequest message = null;
        if (sipSession == null) {
            SipServletRequest outRequest = sipFactory.createRequest(request.getApplicationSession(),
                    "MESSAGE", request.getFrom().getURI(), request.getTo().getURI());
            String user = ((SipURI) request.getTo().getURI()).getUser();
            SipFactory sipFactory = (SipFactory) getServletContext().getAttribute(SIP_FACTORY);
            Address calleeAddress = sipFactory.createAddress(registry.retrieveAddres(user));            
            if (calleeAddress == null) {
                request.createResponse(SipServletResponse.SC_NOT_FOUND).send();
                return;
            }
            outRequest.setRequestURI(calleeAddress.getURI());
            message = outRequest;
            sessions.put(request.getSession(), outRequest.getSession());
            sessions.put(outRequest.getSession(), request.getSession());
        } else {
            message = sipSession.createRequest("MESSAGE");
        }
        if (request.getContent() != null) {
            String contentType = request.getContentType();
            if (contentType == null || contentType.isEmpty()) {
                contentType = CONTENT_TYPE;
            }
            message.setContent(request.getContent(), contentType);
        }
        LOGGER.log(Level.INFO, "Seding MESSAGE request:{}", message);
        message.send();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    protected void doResponse(SipServletResponse response)
            throws ServletException, IOException {
        LOGGER.log(Level.INFO,"SimpleProxyServlet: Got response:{}", response);
        response.getSession().setAttribute(LAST_RES_ATT, response);
        SipServletRequest request = (SipServletRequest) sessions.get(response.getSession()).getAttribute(LAST_REQ_ATT);
        SipServletResponse resp = request.createResponse(response.getStatus());
        if (response.getContent() != null) {
            resp.setContent(response.getContent(), response.getContentType());
        }
        resp.send();
    }

    /*
     * (non-Javadoc)
     * @see javax.servlet.sip.TimerListener#timeout(javax.servlet.sip.ServletTimer)
     */
    @Override
    public void timeout(ServletTimer servletTimer) {
        SipSession sipSession = servletTimer.getApplicationSession().getSipSession((String) servletTimer.getInfo());
        if (!State.TERMINATED.equals(sipSession.getState())) {
            try {
                sipSession.createRequest("BYE").send();
            } catch (IOException e) {
                LOGGER.log(Level.WARNING,"An unexpected exception occured while sending the BYE", e);
            }
        }
    }
}
