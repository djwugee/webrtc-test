# webrtc-test

Para crear la parte estática:
grunt serve:dist

Para probar el WAR con Docker:
docker run --name=restcomm -d -p 8080:8080 -p 5080:5080 -p 5082:5082 -p 5080:5080/udp -p 65000-65535:65000-65535/udp -v /c/Users/cverdes/workspace/front-ws/webrtc-test/playmyband-war/target:/opt/Mobicents-Restcomm-JBoss-AS7/standalone/deployments gvagenas/restcomm

Donde /c/Users/cverdes/workspace/front-ws/webrtc-test/playmyband-war/target es una carpeta donde se despliegue el war.


