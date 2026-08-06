package com.ecom.project.repo;

import com.ecom.project.model.AppRoles;
import com.ecom.project.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface RoleRepository extends JpaRepository<Role,Integer> {
    Optional<Role> findByRoleName(AppRoles appRoles);
}
