package com.project.Kat.services;

import com.project.Kat.models.Role;
import java.util.List;
public interface IRoleService {
    Role createRole(Role role);
    Role getRoleById(Long id);
    Role getRoleByName(String roleName);
    List<String> getPermissionsByRole(String roleName);
} 