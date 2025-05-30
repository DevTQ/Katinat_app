package com.project.Kat.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "role_permissions")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RolePermission {
    @Id
    @ManyToOne
    @JoinColumn(name = "role_id")
    private Role role;
    
    @Id
    @ManyToOne
    @JoinColumn(name = "permission_id")
    private Permission permission;
}
