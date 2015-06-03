/*
 * TeleStax, Open Source Cloud Communications
 * Copyright 2011-2015, Telestax Inc and individual contributors
 * by the @authors tag.
 *
 * This program is free software: you can redistribute it and/or modify
 * under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation; either version 3 of
 * the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>
 */

/**
 * Class TelScaleWebRTCPhoneController
 * @public 
 */ 

navigator.getMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
window.URL = window.URL || window.webkitURL;
/**
 * Constructor 
 */ 
function TelScaleWebRTCPhoneController(rootScope) {
    console.debug("TelScaleWebRTCPhoneController:TelScaleWebRTCPhoneController()")
    //  WebRTComm client 
    this.rootScope=rootScope;
    this.webRTCommClient=new WebRTCommClient(this); 
    this.webRTCommClientConfiguration=undefined;
    this.localAudioVideoMediaStream=undefined;
    this.webRTCommActiveCalls=new Map();
    this.webRTCommCall=undefined;
    this.sipContact=TelScaleWebRTCPhoneController.prototype.DEFAULT_SIP_CONTACT;
    this.arrayToStoreChunks = [];
}

TelScaleWebRTCPhoneController.prototype.constructor=TelScaleWebRTCPhoneController;

// Default SIP profile to use
TelScaleWebRTCPhoneController.prototype.DEFAULT_SIP_OUTBOUND_PROXY="ws://" + window.location.hostname + ":5082";
TelScaleWebRTCPhoneController.prototype.DEFAULT_SIP_USER_AGENT="TelScale WebRTC Client Example" 
TelScaleWebRTCPhoneController.prototype.DEFAULT_SIP_USER_AGENT_CAPABILITIES=undefined 
TelScaleWebRTCPhoneController.prototype.DEFAULT_SIP_DOMAIN="telestax.com";
TelScaleWebRTCPhoneController.prototype.DEFAULT_SIP_DISPLAY_NAME="alice";
TelScaleWebRTCPhoneController.prototype.DEFAULT_SIP_USER_NAME="alice";
TelScaleWebRTCPhoneController.prototype.DEFAULT_SIP_LOGIN="";
TelScaleWebRTCPhoneController.prototype.DEFAULT_SIP_PASSWORD="";
TelScaleWebRTCPhoneController.prototype.DEFAULT_SIP_CONTACT="bob";
TelScaleWebRTCPhoneController.prototype.DEFAULT_SIP_REGISTER_MODE=true;
//TelScaleWebRTCPhoneController.prototype.DEFAULT_STUN_SERVER="undefined"; // stun.l.google.com:19302
TelScaleWebRTCPhoneController.prototype.DEFAULT_ICE_SERVERS=undefined;
TelScaleWebRTCPhoneController.prototype.DEFAULT_STUN_SERVER="stun.l.google.com:19302"; 
TelScaleWebRTCPhoneController.prototype.DEFAULT_TURN_SERVER="https://api.xirsys.com/getIceServers";
TelScaleWebRTCPhoneController.prototype.DEFAULT_TURN_LOGIN=""; 
TelScaleWebRTCPhoneController.prototype.DEFAULT_TURN_PASSWORD=""; 
TelScaleWebRTCPhoneController.prototype.DEFAULT_AUDIO_CODECS_FILTER=undefined; // RTCPeerConnection default codec filter
TelScaleWebRTCPhoneController.prototype.DEFAULT_VIDEO_CODECS_FILTER=undefined; // RTCPeerConnection default codec filter
TelScaleWebRTCPhoneController.prototype.DEFAULT_LOCAL_VIDEO_FORMAT="{\"mandatory\": {\"maxWidth\": 500}}"
TelScaleWebRTCPhoneController.prototype.DEFAULT_SIP_URI_CONTACT_PARAMETERS=undefined;
TelScaleWebRTCPhoneController.prototype.DEFAULT_DTLS_SRTP_KEY_AGREEMENT_MODE=true;
TelScaleWebRTCPhoneController.prototype.DEFAULT_FORCE_TURN_MEDIA_RELAY_MODE=false;


/**
 * on connect event handler
 */ 
TelScaleWebRTCPhoneController.prototype.register=function(sipUserName)
{
    console.debug ("TelScaleWebRTCPhoneController:onClickRegister()");
    if(this.webRTCommClientConfiguration == undefined) {
	    // Setup SIP default Profile
	    this.webRTCommClientConfiguration =  { 
	        communicationMode:WebRTCommClient.prototype.SIP,
	        sip:{
	            sipUserAgent:this.DEFAULT_SIP_USER_AGENT,
	            sipOutboundProxy:this.DEFAULT_SIP_OUTBOUND_PROXY,
	            sipDomain:this.DEFAULT_SIP_DOMAIN,
	            sipDisplayName:this.DEFAULT_SIP_DISPLAY_NAME,
	            sipUserName:this.DEFAULT_SIP_USER_NAME,
	            sipLogin:this.DEFAULT_SIP_LOGIN,
	            sipPassword:this.DEFAULT_SIP_PASSWORD,
	            sipUriContactParameters:this.DEFAULT_SIP_URI_CONTACT_PARAMETERS,
	            sipUserAgentCapabilities:this.DEFAULT_SIP_USER_AGENT_CAPABILITIES,
	            sipRegisterMode:this.DEFAULT_SIP_REGISTER_MODE
	        },
	        RTCPeerConnection:
	        {
	            iceServers:this.DEFAULT_ICE_SERVERS,
	            stunServer:this.DEFAULT_STUN_SERVER,
	            turnServer:this.DEFAULT_TURN_SERVER, 
	            turnLogin:this.DEFAULT_TURN_LOGIN,
	            turnPassword:this.DEFAULT_TURN_PASSWORD,
	            dtlsSrtpKeyAgreement:this.DEFAULT_DTLS_SRTP_KEY_AGREEMENT_MODE,
	            forceTurnMediaRelay:this.DEFAULT_FORCE_TURN_MEDIA_RELAY_MODE
	        }
	    } 
	}
    if(this.webRTCommClient != undefined)
    {
    	//by jimsipUserName = document.getElementById("sipUserName").value;
        this.webRTCommClientConfiguration.sip.sipDisplayName= sipUserName;
        this.webRTCommClientConfiguration.sip.sipUserName = sipUserName;
    	try {
    	    this.webRTCommClient.open(this.webRTCommClientConfiguration); 
    	    console.info("TelScaleWebRTCPhoneController:onClickRegister(): client opened");      
        }
        catch(exception)
        {
            console.error("Connection has failed, reason:"+exception);
        }
    }
    else
    {
        console.error("TelScaleWebRTCPhoneController:onClickRegister(): internal error");      
    }
}

/**
 * on disconnect event handler
 */ 
TelScaleWebRTCPhoneController.prototype.onClickUnregister=function()
{
    console.debug ("TelScaleWebRTCPhoneController:onClickUnregister()"); 
    if(this.webRTCommClient != undefined)
    {
        try
        {
            this.webRTCommClient.close();
            this.webRTCommClientConfiguration = undefined;
        }
        catch(exception)
        {
            console.error("Disconnection has failed, reason:"+exception);
        }
    }
    else
    {
        console.error("TelScaleWebRTCPhoneController:onClickUnregister(): internal error");      
    }
}

/**
  * Implementation of the WebRtcCommClient listener interface
  */
TelScaleWebRTCPhoneController.prototype.onWebRTCommClientOpenedEvent=function()
{
    console.debug ("TelScaleWebRTCPhoneController:onWebRTCommClientOpenedEvent()");
    $rootScope.$broadcast("playmyband.webrtc.client.opened", error);     
    // Get local user media
    try
    {
        this.getLocalUserMedia(TelScaleWebRTCPhoneController.prototype.DEFAULT_LOCAL_VIDEO_FORMAT)
    }
    catch(exception)
    {
        console.error("TelScaleWebRTCPhoneController:onWebRTCommClientOpenedEvent(): catched exception: "+exception);
        console.error("TelScaleWebRTCPhoneController:onWebRTCommClientOpenedEvent(): catched exception: "+exception);
    }   
}
    
TelScaleWebRTCPhoneController.prototype.onWebRTCommClientOpenErrorEvent=function(error)
{
    console.debug ("TelScaleWebRTCPhoneController:onWebRTCommClientOpenErrorEvent():error:"+error);
    $rootScope.$broadcast("playmyband.webrtc.client.openError", error); 
    this.webRTCommCall=undefined;
    console.error("Connection to the Server has failed"); 
} 
    
/**
 * Implementation of the WebRtcCommClient listener interface
 */
TelScaleWebRTCPhoneController.prototype.onWebRTCommClientClosedEvent=function()
{
    console.debug ("TelScaleWebRTCPhoneController:onWebRTCommClientClosedEvent()");
    $rootScope.$broadcast("playmyband.webrtc.client.closed"); 
    this.webRTCommCall=undefined;
}

TelScaleWebRTCPhoneController.prototype.getLocalUserMedia=function(videoContraints){
    console.debug ("TelScaleWebRTCPhoneController:getLocalUserMedia():videoContraints="+JSON.stringify(videoContraints));  
    var that = this;
    if(navigator.getMedia)
    {
        navigator.getMedia({
            audio:true, 
            video: true,
        }, function(localMediaStream) {
            that.onGetUserMediaSuccessEventHandler(localMediaStream);
        }, function(error) {
            that.onGetUserMediaErrorEventHandler(error);
        });
    }
    else
    {
        console.error("TelScaleWebRTCPhoneController:onLoadEventHandler(): navigator doesn't implemement getUserMedia API");
    }
}  
    
/**
 * get user media success event handler (Google Chrome User agent)
 * @param localAudioVideoMediaStream object
 */ 
TelScaleWebRTCPhoneController.prototype.onGetUserMediaSuccessEventHandler=function(localAudioVideoMediaStream) 
{
    $rootScope.$broadcast("playmyband.webrtc.usermedia.sucess",error);     
    try
    {
        console.debug("TelScaleWebRTCPhoneController:onGetUserMediaSuccessEventHandler(): localAudioVideoMediaStream.id="+localAudioVideoMediaStream.id);
        this.localAudioVideoMediaStream=localAudioVideoMediaStream;
    }
    catch(exception)
    {
        console.debug("TelScaleWebRTCPhoneController:onGetUserMediaSuccessEventHandler(): catched exception: "+exception);
    }
}           
 
TelScaleWebRTCPhoneController.prototype.onGetUserMediaErrorEventHandler=function(error) 
{
    console.debug("TelScaleWebRTCPhoneController:onGetUserMediaErrorEventHandler(): error="+error);
    alert("Failed to get local user media: error="+error);
    $rootScope.$broadcast("playmyband.webrtc.usermedia.error",error);    
}	

/**
 * on call event handler
 */ 
TelScaleWebRTCPhoneController.prototype.call=function(contact)
{
    console.debug ("TelScaleWebRTCPhoneController:onClickCall()");     
    try
    {
        var callConfiguration = {
            displayName:this.DEFAULT_SIP_DISPLAY_NAME,
            localMediaStream: this.localAudioVideoMediaStream,
            audioMediaFlag:false,
            videoMediaFlag:false,
            messageMediaFlag:true,
            audioCodecsFilter:null,
            videoCodecsFilter:null
        }
        this.webRTCommCall = this.webRTCommClient.call(contact, callConfiguration);
    }
    catch(exception)
    {
        console.error("Call has failed, reason:"+exception);
    }
}

/**
 * on call event handler
 */ 
TelScaleWebRTCPhoneController.prototype.cancel=function()
{
    console.debug ("TelScaleWebRTCPhoneController:onClickCancelCall()"); 
    if(this.webRTCommCall != undefined)
    {
        try
        {
            this.webRTCommCall.close();
        }
        catch(exception)
        {
            console.error("TelScaleWebRTCPhoneController:onClickCancelCall(): catched exception:"+exception);
        }
    }
    else
    {
        console.error("TelScaleWebRTCPhoneController:onClickCancelCall(): internal error");      
    }
}

/**
 * on call event handler
 */ 
TelScaleWebRTCPhoneController.prototype.disconnectCall=function()
{
    console.debug ("TelScaleWebRTCPhoneController:onClickDisconnectCall()"); 
    if(this.webRTCommCall)
    {
        try
        {
            this.webRTCommCall.close();            
        }
        catch(exception)
        {
            console.error("End has failed, reason:"+exception); 
        }
    }
    else
    {
        console.error("TelScaleWebRTCPhoneController:onClickDisconnectCall(): call is already closed");      
    }
}

/**
 * on accept event handler
 */ 
TelScaleWebRTCPhoneController.prototype.acceptCall=function()
{
    console.debug ("TelScaleWebRTCPhoneController:onClickAcceptCall()"); 
    if(this.webRTCommCall)
    {
        try
        {
            var callConfiguration = {
                displayName:this.DEFAULT_SIP_DISPLAY_NAME,
                localMediaStream: this.localAudioVideoMediaStream,
                audioMediaFlag:false,
                videoMediaFlag:false,
                messageMediaFlag:true
            }
            this.webRTCommCall.accept(callConfiguration);            
        }
        catch(exception)
        {
            console.error("End has failed, reason:"+exception); 
        }
    }
    else
    {
        console.error("TelScaleWebRTCPhoneController:onClickAcceptCall(): internal error");      
    }
}

/**
 * on accept event handler
 */ 
TelScaleWebRTCPhoneController.prototype.rejectCall=function()
{
    console.debug ("TelScaleWebRTCPhoneController:onClickRejectCall()"); 
	if(this.webRTCommCall)
    {
        try
        {
            this.webRTCommCall.reject();
            this.webRTCommCall = undefined;
        }
        catch(exception)
        {
            console.error("End has failed, reason:"+exception);
        }
    }
    else
    {
        console.error("TelScaleWebRTCPhoneController:onClickRejectCall(): internal error");      
    }
}

/**
 * Implementation of the webRTCommCall listener interface
 */
TelScaleWebRTCPhoneController.prototype.onWebRTCommCallClosedEvent=function(webRTCommCall)
{
    console.debug ("TelScaleWebRTCPhoneController:onWebRTCommCallClosedEvent(): webRTCommCall.getId()="+webRTCommCall.getId());
    $rootScope.$broadcast("playmyband.webrtc.call.closed",webRTCommCall);
    this.webRTCommCall=undefined;

	var from = null;
	if (webRTCommCall.isIncoming()) {
            from = webRTCommCall.getCallerPhoneNumber();
        } else {
            from = webRTCommCall.getCalleePhoneNumber();
        }
    this.webRTCommActiveCalls.delete(from);
    this.webRTCommCall=undefined;
}
   
   
/**
 * Implementation of the webRTCommCall listener interface
 */
TelScaleWebRTCPhoneController.prototype.onWebRTCommCallOpenedEvent=function(webRTCommCall)
{
    console.debug ("TelScaleWebRTCPhoneController:onWebRTCommCallOpenedEvent(): webRTCommCall.getId()="+webRTCommCall.getId()); 
    $rootScope.$broadcast("playmyband.webrtc.call.opened",webRTCommCall);

	var from = null;
	if (webRTCommCall.isIncoming()) {
            from = webRTCommCall.getCallerPhoneNumber();
        } else {
            from = webRTCommCall.getCalleePhoneNumber();
        }
    this.webRTCommActiveCalls.set(from, webRTCommCall);
}

/**
 * Implementation of the webRTCommCall listener interface
 */
TelScaleWebRTCPhoneController.prototype.onWebRTCommCallInProgressEvent=function(webRTCommCall)
{
    console.debug ("TelScaleWebRTCPhoneController:onWebRTCommCallInProgressEvent(): webRTCommCall.getId()="+webRTCommCall.getId());
    $rootScope.$broadcast("playmyband.webrtc.call.inprogress",webRTCommCall);
}


/**
 * Implementation of the webRTCommCall listener interface
 */
TelScaleWebRTCPhoneController.prototype.onWebRTCommCallOpenErrorEvent=function(webRTCommCall, error)
{
    console.debug ("TelScaleWebRTCPhoneController:onWebRTCommCallOpenErrorEvent(): webRTCommCall.getId()="+webRTCommCall.getId());
    $rootScope.$broadcast("playmyband.webrtc.call.openerror",webRTCommCall);
    this.webRTCommCall=undefined;
}

/**
 * Implementation of the webRTCommCall listener interface
 */
TelScaleWebRTCPhoneController.prototype.onWebRTCommCallRingingEvent=function(webRTCommCall)
{
    console.debug ("TelScaleWebRTCPhoneController:onWebRTCommCallRingingEvent(): webRTCommCall.getId()="+webRTCommCall.getId());
    $rootScope.$broadcast("playmyband.webrtc.call.ringing",webRTCommCall);     
    this.webRTCommCall=webRTCommCall;
}

/**
 * Implementation of the webRTCommCall listener interface
 */
TelScaleWebRTCPhoneController.prototype.onWebRTCommCallRingingBackEvent=function(webRTCommCall)
{
    console.debug ("TelScaleWebRTCPhoneController:onWebRTCommCallRingingBackEvent(): webRTCommCall.getId()="+webRTCommCall.getId());
    $rootScope.$broadcast("playmyband.webrtc.call.ringingback",webRTCommCall);
}

/**
 * Implementation of the WebRTCommCall listener interface
 */
TelScaleWebRTCPhoneController.prototype.onWebRTCommCallHangupEvent=function(webRTCommCall)
{
    $rootScope.$broadcast("playmyband.webrtc.call.hangup",webRTCommCall);      
    this.webRTCommCall=undefined;
}



/**
 * on send message event handler
 */ 
TelScaleWebRTCPhoneController.prototype.sendMessage=function(contact,message)
{
    console.debug ("WebRTCommTestWebAppController:onClickSendMessage()"); 

    this.webRTCommActiveCalls.forEach(function (activeCall, contact) {
	if(activeCall && activeCall.peerConnectionState == 'established')
	{
            try
            {
                activeCall.sendMessage(message);
            }
            catch(exception)
            {
                console.error("WebRTCommTestWebAppController:onClickSendMessage(): catched exception:"+exception); 
                alert("Send message failed:"+exception)
            }
        }
        else
        {
            console.error("WebRTCommTestWebAppController:onClickSendMessage(): session is not opened yet, thus cannot send message");      
        }
    });
    
}

/**
 * on send message event handler
 */ 
TelScaleWebRTCPhoneController.prototype.sendDataMessage=function(contact, message)
{
    console.debug ("WebRTCommTestWebAppController:onClickSendDataMessage()"); 

    this.webRTCommActiveCalls.forEach(function (activeCall, contact) {
	if(activeCall && activeCall.peerConnectionState == 'established')
	{
            try
            {
                activeCall.sendDataMessage(message);
            }
            catch(exception)
            {
                console.error("WebRTCommTestWebAppController:onClickSendDataMessage(): catched exception:"+exception); 
                alert("Send message failed:"+exception)
            }
        }
        else
        {
            console.error("WebRTCommTestWebAppController:onClickSendDataMessage(): session is not opened yet, thus cannot send message");      
        }
    });
}


/**
 * Message event
 * @public
 * @param {String} from phone number
 * @param {String} message message
 */
TelScaleWebRTCPhoneController.prototype.onWebRTCommMessageReceivedEvent = function(message) {
    $rootScope.$broadcast("playmyband.webrtc.message.received",message);
};

/**
 * Message received event
 * @public
 * @param {String} error
 */
TelScaleWebRTCPhoneController.prototype.onWebRTCommDataMessageSentEvent = function(message) {
    $rootScope.$broadcast("playmyband.webrtc.data.message.sent",message);    
};

/**
 * Message event
 * @public
 * @param {String} from phone number
 * @param {String} message message
 */
TelScaleWebRTCPhoneController.prototype.onWebRTCommDataMessageReceivedEvent = function(message) {
    $rootScope.$broadcast("playmyband.webrtc.data.message.received",message);  
};

/**
 * Message received event
 * @public
 * @param {String} error
 */
TelScaleWebRTCPhoneController.prototype.onWebRTCommMessageSentEvent = function(message) {
    $rootScope.$broadcast("playmyband.webrtc.message.sent",message);    
};

/**
 * Message error event
 * @public
 * @param {String} error
 */
TelScaleWebRTCPhoneController.prototype.onWebRTCommMessageSendErrorEvent = function(message, error) {
        $rootScope.$broadcast("playmyband.webrtc.message.send.error",message);
};

/**
 * on unload event handler
 */ 
TelScaleWebRTCPhoneController.prototype.onUnloadViewEventHandler=function()
{
    console.debug ("TelScaleWebRTCPhoneController:onBeforeUnloadEventHandler()"); 
    if(this.webRTCommClient != undefined)
    {
        try
        {
            this.webRTCommClient.close();  
        }
        catch(exception)
        {
             console.error("WebRtcCommTestWebAppController:onUnloadViewEventHandler(): catched exception:"+exception);  
        }
    }    
}
