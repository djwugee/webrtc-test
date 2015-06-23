package org.playmyband.ejb;

import java.util.HashMap;
import javax.ejb.ConcurrencyManagement;
import javax.ejb.ConcurrencyManagementType;
import javax.ejb.Lock;
import javax.ejb.LockType;
import javax.ejb.Singleton;
import org.plymyband.PMBRegistry;

@Singleton
@ConcurrencyManagement(ConcurrencyManagementType.CONTAINER)
public class PMBRegistryEJB implements PMBRegistry{
    private final HashMap<String, String> registeredUsersToIp = new HashMap<>();
    
    @Lock(LockType.WRITE)    
    public void register(String userId, String addr)
    {
        registeredUsersToIp.put(userId, addr);
    }
    
    @Lock(LockType.READ)    
    public String retrieveAddres(String userdId)
    {
        return registeredUsersToIp.get(userdId);
    }
}
