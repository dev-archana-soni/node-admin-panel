# Admin Panel RBAC - All API URLs

**Base URL:** `http://localhost:5000/api`

**Authentication Header:** `Authorization: Bearer <JWT_TOKEN>`

---

## 🔐 Authentication Endpoints

### 1. Register User
```
POST /auth/register
```
**URL:** `http://localhost:5000/api/auth/register`

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

---

### 2. Login User
```
POST /auth/login
```
**URL:** `http://localhost:5000/api/auth/login`

**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

---

### 3. Get Profile
```
GET /auth/profile
```
**URL:** `http://localhost:5000/api/auth/profile`

**Header:** `Authorization: Bearer <JWT_TOKEN>`

---

### 4. Update Profile
```
PUT /auth/profile
```
**URL:** `http://localhost:5000/api/auth/profile`

**Header:** `Authorization: Bearer <JWT_TOKEN>`

**Body:**
```json
{
  "name": "John Updated",
  "firstName": "John",
  "lastName": "Updated",
  "phone": "1234567890",
  "address": "123 Main St"
}
```

---

### 5. Change Password
```
POST /auth/change-password
```
**URL:** `http://localhost:5000/api/auth/change-password`

**Header:** `Authorization: Bearer <JWT_TOKEN>`

**Body:**
```json
{
  "currentPassword": "password123",
  "newPassword": "newPassword456"
}
```

---

### 6. Logout
```
POST /auth/logout
```
**URL:** `http://localhost:5000/api/auth/logout`

**Header:** `Authorization: Bearer <JWT_TOKEN>`

---

## 👥 Users Endpoints

### 1. Get All Users
```
GET /users
```
**URL:** `http://localhost:5000/api/users`

**Header:** `Authorization: Bearer <JWT_TOKEN>`

---

### 2. Get User by ID
```
GET /users/:id
```
**URL:** `http://localhost:5000/api/users/USER_ID_HERE`

**Header:** `Authorization: Bearer <JWT_TOKEN>`

---

### 3. Get Available Roles
```
GET /users/available-roles
```
**URL:** `http://localhost:5000/api/users/available-roles`

**Header:** `Authorization: Bearer <JWT_TOKEN>`

---

### 4. Create User
```
POST /users
```
**URL:** `http://localhost:5000/api/users`

**Header:** `Authorization: Bearer <JWT_TOKEN>`

**Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "password123",
  "firstName": "Jane",
  "lastName": "Doe",
  "phone": "9876543210",
  "address": "456 Elm St",
  "role": "ROLE_ID_HERE"
}
```

---

### 5. Update User
```
PUT /users/:id
```
**URL:** `http://localhost:5000/api/users/USER_ID_HERE`

**Header:** `Authorization: Bearer <JWT_TOKEN>`

**Body:**
```json
{
  "name": "Jane Smith",
  "firstName": "Jane",
  "lastName": "Smith",
  "phone": "9876543210",
  "address": "789 Oak Ave",
  "role": "ROLE_ID_HERE"
}
```

---

### 6. Delete User
```
DELETE /users/:id
```
**URL:** `http://localhost:5000/api/users/USER_ID_HERE`

**Header:** `Authorization: Bearer <JWT_TOKEN>`

---

## 🎭 Roles Endpoints

### 1. Get All Roles
```
GET /roles
```
**URL:** `http://localhost:5000/api/roles`

**Header:** `Authorization: Bearer <JWT_TOKEN>`

---

### 2. Get Role by ID
```
GET /roles/:id
```
**URL:** `http://localhost:5000/api/roles/ROLE_ID_HERE`

**Header:** `Authorization: Bearer <JWT_TOKEN>`

---

### 3. Create Role
```
POST /roles
```
**URL:** `http://localhost:5000/api/roles`

**Header:** `Authorization: Bearer <JWT_TOKEN>`

**Body:**
```json
{
  "name": "editor",
  "description": "Editor role with content management permissions",
  "permissions": [
    "PERMISSION_ID_1",
    "PERMISSION_ID_2"
  ]
}
```

---

### 4. Update Role
```
PUT /roles/:id
```
**URL:** `http://localhost:5000/api/roles/ROLE_ID_HERE`

**Header:** `Authorization: Bearer <JWT_TOKEN>`

**Body:**
```json
{
  "name": "editor",
  "description": "Updated editor role",
  "permissions": [
    "PERMISSION_ID_1",
    "PERMISSION_ID_2",
    "PERMISSION_ID_3"
  ]
}
```

---

### 5. Delete Role
```
DELETE /roles/:id
```
**URL:** `http://localhost:5000/api/roles/ROLE_ID_HERE`

**Header:** `Authorization: Bearer <JWT_TOKEN>`

---

## 🔑 Permissions Endpoints

### 1. Get All Permissions
```
GET /permissions
```
**URL:** `http://localhost:5000/api/permissions`

**Header:** `Authorization: Bearer <JWT_TOKEN>`

---

### 2. Get Permission by ID
```
GET /permissions/:id
```
**URL:** `http://localhost:5000/api/permissions/PERMISSION_ID_HERE`

**Header:** `Authorization: Bearer <JWT_TOKEN>`

---

### 3. Get Permissions by Module
```
GET /permissions/module/:moduleId
```
**URL:** `http://localhost:5000/api/permissions/module/MODULE_ID_HERE`

**Header:** `Authorization: Bearer <JWT_TOKEN>`

---

### 4. Create Permission
```
POST /permissions
```
**URL:** `http://localhost:5000/api/permissions`

**Header:** `Authorization: Bearer <JWT_TOKEN>`

**Body:**
```json
{
  "name": "users.view",
  "module": "MODULE_ID_HERE",
  "description": "Permission to view users",
  "isActive": true
}
```

---

### 5. Update Permission
```
PUT /permissions/:id
```
**URL:** `http://localhost:5000/api/permissions/PERMISSION_ID_HERE`

**Header:** `Authorization: Bearer <JWT_TOKEN>`

**Body:**
```json
{
  "name": "users.view",
  "description": "Updated: Permission to view all users",
  "isActive": true
}
```

---

### 6. Delete Permission
```
DELETE /permissions/:id
```
**URL:** `http://localhost:5000/api/permissions/PERMISSION_ID_HERE`

**Header:** `Authorization: Bearer <JWT_TOKEN>`

---

## 📦 Modules Endpoints

### 1. Get All Modules
```
GET /modules
```
**URL:** `http://localhost:5000/api/modules`

**Header:** `Authorization: Bearer <JWT_TOKEN>`

---

### 2. Get Active Modules
```
GET /modules/active/list
```
**URL:** `http://localhost:5000/api/modules/active/list`

**Header:** `Authorization: Bearer <JWT_TOKEN>`

---

### 3. Get Module by ID
```
GET /modules/:id
```
**URL:** `http://localhost:5000/api/modules/MODULE_ID_HERE`

**Header:** `Authorization: Bearer <JWT_TOKEN>`

---

### 4. Create Module
```
POST /modules
```
**URL:** `http://localhost:5000/api/modules`

**Header:** `Authorization: Bearer <JWT_TOKEN>`

**Body:**
```json
{
  "name": "users",
  "displayName": "Users",
  "description": "User management module",
  "icon": "mdi-account-multiple",
  "isActive": true
}
```

---

### 5. Update Module
```
PUT /modules/:id
```
**URL:** `http://localhost:5000/api/modules/MODULE_ID_HERE`

**Header:** `Authorization: Bearer <JWT_TOKEN>`

**Body:**
```json
{
  "name": "users",
  "displayName": "Users Management",
  "description": "Updated user management module",
  "icon": "mdi-account-multiple",
  "isActive": true
}
```

---

### 6. Delete Module
```
DELETE /modules/:id
```
**URL:** `http://localhost:5000/api/modules/MODULE_ID_HERE`

**Header:** `Authorization: Bearer <JWT_TOKEN>`

---

## 📋 Quick Reference Summary

| Endpoint | Method | URL |
|----------|--------|-----|
| Register | POST | `http://localhost:5000/api/auth/register` |
| Login | POST | `http://localhost:5000/api/auth/login` |
| Get Profile | GET | `http://localhost:5000/api/auth/profile` |
| Update Profile | PUT | `http://localhost:5000/api/auth/profile` |
| Change Password | POST | `http://localhost:5000/api/auth/change-password` |
| Logout | POST | `http://localhost:5000/api/auth/logout` |
| Get All Users | GET | `http://localhost:5000/api/users` |
| Get User | GET | `http://localhost:5000/api/users/:id` |
| Create User | POST | `http://localhost:5000/api/users` |
| Update User | PUT | `http://localhost:5000/api/users/:id` |
| Delete User | DELETE | `http://localhost:5000/api/users/:id` |
| Get Available Roles | GET | `http://localhost:5000/api/users/available-roles` |
| Get All Roles | GET | `http://localhost:5000/api/roles` |
| Get Role | GET | `http://localhost:5000/api/roles/:id` |
| Create Role | POST | `http://localhost:5000/api/roles` |
| Update Role | PUT | `http://localhost:5000/api/roles/:id` |
| Delete Role | DELETE | `http://localhost:5000/api/roles/:id` |
| Get All Permissions | GET | `http://localhost:5000/api/permissions` |
| Get Permission | GET | `http://localhost:5000/api/permissions/:id` |
| Get Permissions by Module | GET | `http://localhost:5000/api/permissions/module/:moduleId` |
| Create Permission | POST | `http://localhost:5000/api/permissions` |
| Update Permission | PUT | `http://localhost:5000/api/permissions/:id` |
| Delete Permission | DELETE | `http://localhost:5000/api/permissions/:id` |
| Get All Modules | GET | `http://localhost:5000/api/modules` |
| Get Active Modules | GET | `http://localhost:5000/api/modules/active/list` |
| Get Module | GET | `http://localhost:5000/api/modules/:id` |
| Create Module | POST | `http://localhost:5000/api/modules` |
| Update Module | PUT | `http://localhost:5000/api/modules/:id` |
| Delete Module | DELETE | `http://localhost:5000/api/modules/:id` |

---

## 🔗 Copy-Paste URLs

### Authentication
- `http://localhost:5000/api/auth/register`
- `http://localhost:5000/api/auth/login`
- `http://localhost:5000/api/auth/profile`
- `http://localhost:5000/api/auth/change-password`
- `http://localhost:5000/api/auth/logout`

### Users
- `http://localhost:5000/api/users`
- `http://localhost:5000/api/users/:id`
- `http://localhost:5000/api/users/available-roles`

### Roles
- `http://localhost:5000/api/roles`
- `http://localhost:5000/api/roles/:id`

### Permissions
- `http://localhost:5000/api/permissions`
- `http://localhost:5000/api/permissions/:id`
- `http://localhost:5000/api/permissions/module/:moduleId`

### Modules
- `http://localhost:5000/api/modules`
- `http://localhost:5000/api/modules/active/list`
- `http://localhost:5000/api/modules/:id`

---

## 📝 Notes

- Replace `:id`, `:moduleId` with actual IDs
- All endpoints (except register/login) require `Authorization: Bearer <JWT_TOKEN>` header
- All POST/PUT endpoints require `Content-Type: application/json` header
- JWT token expires after 24 hours
- Base URL can be changed in `.env` file (default: `localhost:5000`)
