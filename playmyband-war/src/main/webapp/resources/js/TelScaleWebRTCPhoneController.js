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
function TelScaleWebRTCPhoneController(view) {
    console.debug("TelScaleWebRTCPhoneController:TelScaleWebRTCPhoneController()")
    //  WebRTComm client 
    this.view=view;
    this.webRTCommClient=new WebRTCommClient(this); 
    this.webRTCommClientConfiguration=undefined;
    this.localAudioVideoMediaStream=undefined;
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
TelScaleWebRTCPhoneController.prototype.onClickRegister=function()
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
	sipUserName = document.getElementById("sipUserName").value;
        this.webRTCommClientConfiguration.sip.sipDisplayName= sipUserName;
        this.webRTCommClientConfiguration.sip.sipUserName = sipUserName;

        // Doing TURN on xirsys.com
        /*if(this.webRTCommClientConfiguration.RTCPeerConnection.turnServer) {
	            $.post(this.webRTCommClientConfiguration.RTCPeerConnection.turnServer,
	        		{
	        		domain: "www." + this.webRTCommClientConfiguration.sip.sipDomain,
	        		room: "default",
	        		application: "restcomm-webrtc",
	        		ident: this.webRTCommClientConfiguration.RTCPeerConnection.turnLogin,
	        		secret: this.webRTCommClientConfiguration.RTCPeerConnection.turnPassword,
	        		username: this.webRTCommClientConfiguration.sip.sipUserName,
				secure: "1"
	        		},
	        		function(data,status){
	        			var result = jQuery.parseJSON(data);
	        			self.webRTCommClientConfiguration.RTCPeerConnection.iceServers = result.d;
	        		}
	            );
            }
            this.webRTCommClient.open(this.webRTCommClientConfiguration);*/
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
    this.webRTCommCall=undefined;
    console.error("Connection to the Server has failed"); 
} 
    
/**
 * Implementation of the WebRtcCommClient listener interface
 */
TelScaleWebRTCPhoneController.prototype.onWebRTCommClientClosedEvent=function()
{
    console.debug ("TelScaleWebRTCPhoneController:onWebRTCommClientClosedEvent()"); 
    //Enabled button CONNECT, disable DISCONECT, CALL, BYE
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
    try
    {
        console.debug("TelScaleWebRTCPhoneController:onGetUserMediaSuccessEventHandler(): localAudioVideoMediaStream.id="+localAudioVideoMediaStream.id);
        this.localAudioVideoMediaStream=localAudioVideoMediaStream;
	var localVideo = document.getElementById('localVideo');
        if (window.URL) {
	    // In Chrome or Opera, the URL.createObjectURL() method converts a MediaStream to a Blob URL which can be set as the src of a video element. 
	    // (In Firefox and Opera, the src of the video can be set from the stream itself.) 
	    localVideo.src = window.URL.createObjectURL(localAudioVideoMediaStream);
	} else {
	    localVideo.src = localAudioVideoMediaStream;
	}
        /*var audioTracks = undefined;
        if(this.localAudioVideoMediaStream.audioTracks) audioTracks=this.localAudioVideoMediaStream.audioTracks;
        else if(this.localAudioVideoMediaStream.getAudioTracks) audioTracks=this.localAudioVideoMediaStream.getAudioTracks();
        if(audioTracks)
        {
            console.debug("TelScaleWebRTCPhoneController:onWebkitGetUserMediaSuccessEventHandler(): audioTracks="+JSON.stringify(audioTracks));
        }
        else
        {
            alert("MediaStream Track  API not supported");
        }
        
        var videoTracks = undefined;
        if(this.localAudioVideoMediaStream.videoTracks) videoTracks=this.localAudioVideoMediaStream.videoTracks;
        else if(this.localAudioVideoMediaStream.getVideoTracks) videoTracks=this.localAudioVideoMediaStream.getVideoTracks();
        if(videoTracks)
        {
            console.debug("TelScaleWebRTCPhoneController:onWebkitGetUserMediaSuccessEventHandler(): videoTracks="+JSON.stringify(videoTracks));
        }*/
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
}	

/**
 * on call event handler
 */ 
TelScaleWebRTCPhoneController.prototype.onClickCall=function()
{
    console.debug ("TelScaleWebRTCPhoneController:onClickCall()");     
    if(this.webRTCommCall == undefined)
    {
	contact = document.getElementById("contactUserName").value;
        try
        {
            var callConfiguration = {
                displayName:this.DEFAULT_SIP_DISPLAY_NAME,
                localMediaStream: this.localAudioVideoMediaStream,
                audioMediaFlag:true,
                videoMediaFlag:true,
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
    else
    {
        console.error("TelScaleWebRTCPhoneController:onClickCall(): internal error");      
    }
}

/**
 * on call event handler
 */ 
TelScaleWebRTCPhoneController.prototype.onClickCancel=function()
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
TelScaleWebRTCPhoneController.prototype.onClickDisconnectCall=function()
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
        console.error("TelScaleWebRTCPhoneController:onClickDisconnectCall(): internal error");      
    }
}

/**
 * on accept event handler
 */ 
TelScaleWebRTCPhoneController.prototype.onClickAcceptCall=function()
{
    console.debug ("TelScaleWebRTCPhoneController:onClickAcceptCall()"); 
    if(this.webRTCommCall)
    {
        try
        {
            var callConfiguration = {
                displayName:this.DEFAULT_SIP_DISPLAY_NAME,
                localMediaStream: this.localAudioVideoMediaStream,
                audioMediaFlag:true,
                videoMediaFlag:true,
                messageMediaFlag:false
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
TelScaleWebRTCPhoneController.prototype.onClickRejectCall=function()
{
    console.debug ("TelScaleWebRTCPhoneController:onClickRejectCall()"); 
	if(this.webRTCommCall)
    {
        try
        {
            this.webRTCommCall.reject();
            this.webRTCommCall = undefined;
	    document.getElementById("AcceptCall").disabled=true;
    	    document.getElementById("RejectCall").disabled=true;
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
    this.webRTCommCall=undefined;
    document.getElementById("AcceptCall").disabled=true;
    document.getElementById("RejectCall").disabled=true;
    document.getElementById("remoteVideo").pause();
    if (typeof navigator.mozGetUserMedia != 'undefined') {
	document.getElementById("remoteVideo").mozSrcObject = undefined;
    } else {
	document.getElementById("remoteVideo").src = undefined;
    } 
    this.webRTCommCall=undefined;
}
   
   
/**
 * Implementation of the webRTCommCall listener interface
 */
TelScaleWebRTCPhoneController.prototype.onWebRTCommCallOpenedEvent=function(webRTCommCall)
{
    console.debug ("TelScaleWebRTCPhoneController:onWebRTCommCallOpenedEvent(): webRTCommCall.getId()="+webRTCommCall.getId()); 
   
    if(webRTCommCall.getRemoteBundledAudioVideoMediaStream())
    {
        if (typeof navigator.mozGetUserMedia != 'undefined') {
		document.getElementById("remoteVideo").mozSrcObject = webRTCommCall.getRemoteBundledAudioVideoMediaStream();
	} else {
		document.getElementById("remoteVideo").src = window.URL.createObjectURL(webRTCommCall.getRemoteBundledAudioVideoMediaStream());
	} 
	document.getElementById("remoteVideo").play();
    }
    else if(webRTCommCall.getRemoteVideoMediaStream()) {
	if (typeof navigator.mozGetUserMedia != 'undefined') {
		document.getElementById("remoteVideo").mozSrcObject = webRTCommCall.getRemoteVideoMediaStream();
	} else {
		document.getElementById("remoteVideo").src = window.URL.createObjectURL(webRTCommCall.getRemoteVideoMediaStream());
	} 
	document.getElementById("remoteVideo").play();
    }
    document.getElementById("AcceptCall").disabled=true;
    document.getElementById("RejectCall").disabled=true;
}

/**
 * Implementation of the webRTCommCall listener interface
 */
TelScaleWebRTCPhoneController.prototype.onWebRTCommCallInProgressEvent=function(webRTCommCall)
{
    console.debug ("TelScaleWebRTCPhoneController:onWebRTCommCallInProgressEvent(): webRTCommCall.getId()="+webRTCommCall.getId()); 
}


/**
 * Implementation of the webRTCommCall listener interface
 */
TelScaleWebRTCPhoneController.prototype.onWebRTCommCallOpenErrorEvent=function(webRTCommCall, error)
{
    console.debug ("TelScaleWebRTCPhoneController:onWebRTCommCallOpenErrorEvent(): webRTCommCall.getId()="+webRTCommCall.getId()); 
    this.webRTCommCall=undefined;
}

/**
 * Implementation of the webRTCommCall listener interface
 */
TelScaleWebRTCPhoneController.prototype.onWebRTCommCallRingingEvent=function(webRTCommCall)
{
    console.debug ("TelScaleWebRTCPhoneController:onWebRTCommCallRingingEvent(): webRTCommCall.getId()="+webRTCommCall.getId()); 
    this.webRTCommCall=webRTCommCall;
    document.getElementById("AcceptCall").disabled=false;
    document.getElementById("RejectCall").disabled=false;
}

/**
 * Implementation of the webRTCommCall listener interface
 */
TelScaleWebRTCPhoneController.prototype.onWebRTCommCallRingingBackEvent=function(webRTCommCall)
{
    console.debug ("TelScaleWebRTCPhoneController:onWebRTCommCallRingingBackEvent(): webRTCommCall.getId()="+webRTCommCall.getId()); 
}

/**
 * Implementation of the WebRTCommCall listener interface
 */
TelScaleWebRTCPhoneController.prototype.onWebRTCommCallHangupEvent=function(webRTCommCall)
{
    console.debug ("TelScaleWebRTCPhoneController:onWebRTCommCallHangupEvent(): webRTCommCall.getId()="+webRTCommCall.getId()); 
    document.getElementById("AcceptCall").disabled=true;
    document.getElementById("RejectCall").disabled=true;
    document.getElementById("remoteVideo").pause();
    if (typeof navigator.mozGetUserMedia != 'undefined') {
	document.getElementById("remoteVideo").mozSrcObject = undefined;
    } else {
	document.getElementById("remoteVideo").src = undefined;
    } 
    this.webRTCommCall=undefined;
}



/**
 * on send message event handler
 */ 
TelScaleWebRTCPhoneController.prototype.onClickSendMessage=function()
{
    console.debug ("WebRTCommTestWebAppController:onClickSendMessage()"); 
    contact = document.getElementById("contactUserName").value;   
    message = document.getElementById("messageToSend").value;  
    chatBox = document.getElementById("chatBox");
    chatBox.value += this.webRTCommClientConfiguration.sip.sipUserName + ": " + message + "\n";
    if(this.webRTCommCall && this.webRTCommCall.peerConnectionState == 'established')
    {
        try
        {
            this.webRTCommCall.sendMessage(message);
        }
        catch(exception)
        {
            console.error("WebRTCommTestWebAppController:onClickRejectCall(): catched exception:"+exception); 
            alert("Send message failed:"+exception)
        }
    }
    else
    {
        try
        {
            this.webRTCommClient.sendMessage(contact, message);             
        }
        catch(exception)
        {
            console.error("WebRTCommTestWebAppController:onClickRejectCall(): catched exception:"+exception); 
            alert("Send message failed:"+exception);
        }     
    }
}


/**
 * Message event
 * @public
 * @param {String} from phone number
 * @param {String} message message
 */
TelScaleWebRTCPhoneController.prototype.onWebRTCommMessageReceivedEvent = function(message) {
    console.debug ("WebRTCommTestWebAppController:onWebRTCommMessageReceivedEvent()"); 
    from = message.getFrom();
    var webRTCommCall = message.getLinkedWebRTCommCall();
    if (webRTCommCall) {
        if (webRTCommCall.isIncoming()) {
            from = webRTCommCall.getCallerPhoneNumber();
        } else {
            from = webRTCommCall.getCalleePhoneNumber();
        }
    }
    chatBox = document.getElementById("chatBox");
    chatBox.value += from + ": " + message.getText() + "\n";
};

/**
 * Message received event
 * @public
 * @param {String} error
 */
TelScaleWebRTCPhoneController.prototype.onWebRTCommMessageSentEvent = function(message) {
};

/**
 * Message error event
 * @public
 * @param {String} error
 */
TelScaleWebRTCPhoneController.prototype.onWebRTCommMessageSendErrorEvent = function(message, error) {
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
