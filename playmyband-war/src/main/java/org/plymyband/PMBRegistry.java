package org.plymyband;

public interface PMBRegistry {
    public void register(String userId, String addr);
     
    public String retrieveAddres(String userdId);    
}
