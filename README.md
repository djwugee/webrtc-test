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


Inside project directory you will see a folder called playmyband-war, this is a war maven project, so

1- First build the application
```
cd $project_dir/playmyband-war
mvn clean package
```
2- Start a docker jboss image mapping the target folder to the /apps docker image folder (so anytime you do a rebuild jboss will deploy playmyband automatically):
```
docker run --name=restcomm -d -p 9990:9990 -p 8080:8080 -p 5080:5080 -p 5082:5082 -p 5080:5080/udp -p 65000-65535:65000-65535/udp -v $project_dir/playmyband-war/target:/apps nosolojava/restcomm
```

3- Check with the next url (192.168.59.103 is the docker IP, check your docker setup):
http://192.168.59.103:8080/playmyband/


