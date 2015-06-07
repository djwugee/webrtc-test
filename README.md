# webrtc-test

Para crear la parte estática:
grunt serve:dist

Para probar el WAR con Docker:
```
docker run --name=restcomm -d -p 9990:9990 -p 8080:8080 -p 5080:5080 -p 5082:5082 -p 5080:5080/udp -p 65000-65535:65000-65535/udp -v /c/Users/cverdes/workspace/front-ws/webrtc-test/playmyband-war/target:/opt/Mobicents-Restcomm-JBoss-AS7/standalone/deployments -e STATIC_ADDRESS=192.168.59.103 -e OUTBOUND_PROXY=172.17.42.1 gvagenas/restcomm
```

Donde
- /c/Users/cverdes/workspace/front-ws/webrtc-test/playmyband-war/target es una carpeta donde se despliegue el war.
- -e STATIC_ADDRESS="192.168.59.103" --> es la ip donde se ejecuta docker
- -e OUTBOUND_PROXY="172.17.42.1" --> es la ip del gateway de docker (hacer un docker inspect restcomm para comprobar esto)

Entonces ya puedes probar que el war se ha desplegado bien (cambiar 192.168.59.103 por la ip de docker en tu entorno, en linux por ejemplo sería localhost):


http://192.168.59.103:8080/playmyband/


