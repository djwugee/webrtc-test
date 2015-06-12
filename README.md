# webrtc-test

## Configuración entorno front

Ir a la carpeta donde se quiera trabajar y lanzar:
```
git clone https://github.com/nosolojava/webrtc-test.git

cd webrtc-test

npm install

bower install

grunt

```

Para trabajar levantar servidor de pruebas:
```
grun serve
```

Para crear la parte estática (la que luego utiliza Maven para la build):
```
grunt serve:dist
```


## Para probar el WAR con Docker (aún no está listo).


```
docker run --name=restcomm -d -p 9990:9990 -p 8080:8080 -p 5080:5080 -p 5082:5082 -p 5080:5080/udp -p 65000-65535:65000-65535/udp -v /c/Users/cverdes/workspace/front-ws/webrtc-test/playmyband-war/target:/opt/Mobicents-Restcomm-JBoss-AS7/standalone/deployments gvagenas/restcomm
```

Donde
- /c/Users/cverdes/workspace/front-ws/webrtc-test/playmyband-war/target es una carpeta donde se despliegue el war.

Dentro de la misma carpeta se tiene que copiar los .war de Mobicents --> se actualizará esta parte en un futuro.

Entonces ya puedes probar que el war se ha desplegado bien (cambiar 192.168.59.103 por la ip de docker en tu entorno, en linux por ejemplo sería localhost):


http://192.168.59.103:8080/playmyband/


