package com.tracker.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.tracker.Entity.User;

public interface UserRepository extends JpaRepository<User, Long>{
    
}
