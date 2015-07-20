# webrtc-test

## Front configuration

```
git clone https://github.com/nosolojava/webrtc-test.git

cd webrtc-test

npm install

bower install

grunt

```

To work with test service (just to develop front):
```
grun serve
```

To create static resources for real app:
```
grunt serve:dist
```


## Deploy WAR with Docker


```
docker run --name=restcomm -d -p 9990:9990 -p 8080:8080 -p 5080:5080 -p 5082:5082 -p 5080:5080/udp -p 65000-65535:65000-65535/udp -v /c/Users/cverdes/workspace/front-ws/webrtc-test/playmyband-war/target:/apps nosolojava/restcomm
```

Where
- /c/Users/cverdes/workspace/front-ws/webrtc-test/playmyband-war/target is where you want to copy your war.


Then you can check with the Docker ip (in the example 192.168.59.103):

http://192.168.59.103:8080/playmyband/


