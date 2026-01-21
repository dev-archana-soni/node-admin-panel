# Role & Permission API Endpoints

## Base URL
```
http://localhost:5000/api
```

## Authentication
All endpoints require Bearer token in Authorization header:
```
Authorization: Bearer <JWT_TOKEN>
```

---

## ROLES ENDPOINTS

### 1. Get All Roles
```
GET /api/roles
```
**Headers:**
```
Authorization: Bearer TOKEN
```

**Response:**
```json
{
  "roles": [
    {
      "id": "role-id-123",
      "name": "admin",
      "description": "Administrator with full system access",
      "isActive": true,
      "permissions": ["perm-id-1", "perm-id-2"],
      "createdAt": "2024-01-21T10:00:00.000Z",
      "updatedAt": "2024-01-21T10:00:00.000Z"
    }
  ]
}
```

---

### 2. Get Active Roles Only (for Dropdowns)
```
GET /api/roles/active/list
```
**Headers:**
```
Authorization: Bearer TOKEN
```

**Response:**
```json
{
  "roles": [
    {
      "id": "role-id-123",
      "name": "admin"
    },
    {
      "id": "role-id-456",
      "name": "user"
    }
  ]
}
```

---

### 3. Get Role by ID
```
GET /api/roles/:id
```
**Example:**
```
GET /api/roles/65a8f3c4d1e2f3g4h5i6j7k8
```

**Headers:**
```
Authorization: Bearer TOKEN
```

**Response:**
```json
{
  "role": {
    "id": "65a8f3c4d1e2f3g4h5i6j7k8",
    "name": "admin",
    "description": "Administrator with full system access",
    "isActive": true,
    "permissions": ["perm-id-1", "perm-id-2", "perm-id-3"],
    "createdAt": "2024-01-21T10:00:00.000Z",
    "updatedAt": "2024-01-21T10:00:00.000Z"
  }
}
```

---

### 4. Create New Role
```
POST /api/roles
```
**Headers:**
```
Authorization: Bearer TOKEN
Content-Type: application/json
```

**Payload:**
```json
{
  "name": "editor",
  "description": "Editor role with content management permissions",
  "isActive": true,
  "permissions": ["perm-id-1", "perm-id-2", "perm-id-3"]
}
```

**Response:**
```json
{
  "message": "Role created successfully",
  "role": {
    "id": "65a8f3c4d1e2f3g4h5i6j7k8",
    "name": "editor",
    "description": "Editor role with content management permissions",
    "isActive": true,
    "permissions": ["perm-id-1", "perm-id-2", "perm-id-3"],
    "createdAt": "2024-01-21T10:00:00.000Z",
    "updatedAt": "2024-01-21T10:00:00.000Z"
  }
}
```

---

### 5. Update Role
```
PUT /api/roles/:id
```
**Example:**
```
PUT /api/roles/65a8f3c4d1e2f3g4h5i6j7k8
```

**Headers:**
```
Authorization: Bearer TOKEN
Content-Type: application/json
```

**Payload:**
```json
{
  "name": "editor",
  "description": "Updated editor description",
  "isActive": true,
  "permissions": ["perm-id-1", "perm-id-2", "perm-id-3", "perm-id-4"]
}
```

**Response:**
```json
{
  "message": "Role updated successfully",
  "role": {
    "id": "65a8f3c4d1e2f3g4h5i6j7k8",
    "name": "editor",
    "description": "Updated editor description",
    "isActive": true,
    "permissions": ["perm-id-1", "perm-id-2", "perm-id-3", "perm-id-4"],
    "createdAt": "2024-01-21T10:00:00.000Z",
    "updatedAt": "2024-01-21T10:00:00.000Z"
  }
}
```

---

### 6. Delete Role
```
DELETE /api/roles/:id
```
**Example:**
```
DELETE /api/roles/65a8f3c4d1e2f3g4h5i6j7k8
```

**Headers:**
```
Authorization: Bearer TOKEN
```

**Response:**
```json
{
  "message": "Role deleted successfully"
}
```

**Error Response (if users assigned to role):**
```json
{
  "message": "Cannot delete role. 2 user(s) are assigned to this role."
}
```

---

## PERMISSIONS ENDPOINTS

### 1. Get All Permissions
```
GET /api/permissions
```
**Headers:**
```
Authorization: Bearer TOKEN
```

**Response:**
```json
{
  "permissions": [
    {
      "id": "perm-id-1",
      "name": "users.view",
      "module": {
        "id": "module-id-1",
        "name": "users",
        "displayName": "Users"
      },
      "description": "View users",
      "isActive": true,
      "createdAt": "2024-01-21T10:00:00.000Z",
      "updatedAt": "2024-01-21T10:00:00.000Z"
    }
  ]
}
```

---

### 2. Get Permissions by Module
```
GET /api/permissions/module/:moduleId
```
**Example:**
```
GET /api/permissions/module/65a8f3c4d1e2f3g4h5i6j7k8
```

**Headers:**
```
Authorization: Bearer TOKEN
```

**Response:**
```json
{
  "permissions": [
    {
      "id": "perm-id-1",
      "name": "users.view",
      "description": "View users",
      "isActive": true
    },
    {
      "id": "perm-id-2",
      "name": "users.create",
      "description": "Create users",
      "isActive": true
    },
    {
      "id": "perm-id-3",
      "name": "users.update",
      "description": "Update users",
      "isActive": true
    },
    {
      "id": "perm-id-4",
      "name": "users.delete",
      "description": "Delete users",
      "isActive": true
    }
  ]
}
```

---

### 3. Get Permission by ID
```
GET /api/permissions/:id
```
**Example:**
```
GET /api/permissions/65a8f3c4d1e2f3g4h5i6j7k8
```

**Headers:**
```
Authorization: Bearer TOKEN
```

**Response:**
```json
{
  "permission": {
    "id": "65a8f3c4d1e2f3g4h5i6j7k8",
    "name": "users.view",
    "module": {
      "id": "module-id-1",
      "name": "users",
      "displayName": "Users"
    },
    "description": "View users",
    "isActive": true,
    "createdAt": "2024-01-21T10:00:00.000Z",
    "updatedAt": "2024-01-21T10:00:00.000Z"
  }
}
```

---

### 4. Create Permission
```
POST /api/permissions
```
**Headers:**
```
Authorization: Bearer TOKEN
Content-Type: application/json
```

**Payload:**
```json
{
  "name": "users.export",
  "module": "65a8f3c4d1e2f3g4h5i6j7k8",
  "description": "Export users list",
  "isActive": true
}
```

**Response:**
```json
{
  "message": "Permission created successfully",
  "permission": {
    "id": "perm-id-new",
    "name": "users.export",
    "module": {
      "id": "65a8f3c4d1e2f3g4h5i6j7k8",
      "name": "users",
      "displayName": "Users"
    },
    "description": "Export users list",
    "isActive": true,
    "createdAt": "2024-01-21T10:00:00.000Z",
    "updatedAt": "2024-01-21T10:00:00.000Z"
  }
}
```

---

### 5. Update Permission
```
PUT /api/permissions/:id
```
**Example:**
```
PUT /api/permissions/65a8f3c4d1e2f3g4h5i6j7k8
```

**Headers:**
```
Authorization: Bearer TOKEN
Content-Type: application/json
```

**Payload:**
```json
{
  "name": "users.export",
  "module": "65a8f3c4d1e2f3g4h5i6j7k8",
  "description": "Export users list to CSV/Excel",
  "isActive": true
}
```

**Response:**
```json
{
  "message": "Permission updated successfully",
  "permission": {
    "id": "65a8f3c4d1e2f3g4h5i6j7k8",
    "name": "users.export",
    "module": {
      "id": "65a8f3c4d1e2f3g4h5i6j7k8",
      "name": "users",
      "displayName": "Users"
    },
    "description": "Export users list to CSV/Excel",
    "isActive": true,
    "createdAt": "2024-01-21T10:00:00.000Z",
    "updatedAt": "2024-01-21T10:00:00.000Z"
  }
}
```

---

### 6. Delete Permission
```
DELETE /api/permissions/:id
```
**Example:**
```
DELETE /api/permissions/65a8f3c4d1e2f3g4h5i6j7k8
```

**Headers:**
```
Authorization: Bearer TOKEN
```

**Response:**
```json
{
  "message": "Permission deleted successfully"
}
```

---

## MODULES ENDPOINTS

### 1. Get All Modules
```
GET /api/modules
```
**Headers:**
```
Authorization: Bearer TOKEN
```

**Response:**
```json
{
  "modules": [
    {
      "id": "module-id-1",
      "name": "users",
      "displayName": "Users",
      "description": "User management module",
      "icon": "mdi-account-multiple",
      "isActive": true,
      "createdAt": "2024-01-21T10:00:00.000Z",
      "updatedAt": "2024-01-21T10:00:00.000Z"
    }
  ]
}
```

---

### 2. Get Active Modules Only
```
GET /api/modules/active/list
```
**Headers:**
```
Authorization: Bearer TOKEN
```

**Response:**
```json
{
  "modules": [
    {
      "id": "module-id-1",
      "name": "users",
      "displayName": "Users",
      "description": "User management module",
      "icon": "mdi-account-multiple",
      "isActive": true
    }
  ]
}
```

---

### 3. Get Module by ID
```
GET /api/modules/:id
```
**Example:**
```
GET /api/modules/65a8f3c4d1e2f3g4h5i6j7k8
```

**Headers:**
```
Authorization: Bearer TOKEN
```

**Response:**
```json
{
  "module": {
    "id": "65a8f3c4d1e2f3g4h5i6j7k8",
    "name": "users",
    "displayName": "Users",
    "description": "User management module",
    "icon": "mdi-account-multiple",
    "isActive": true,
    "createdAt": "2024-01-21T10:00:00.000Z",
    "updatedAt": "2024-01-21T10:00:00.000Z"
  }
}
```

---

### 4. Create Module
```
POST /api/modules
```
**Headers:**
```
Authorization: Bearer TOKEN
Content-Type: application/json
```

**Payload:**
```json
{
  "name": "reports",
  "displayName": "Reports",
  "description": "Reports and analytics module",
  "icon": "mdi-chart-line",
  "isActive": true
}
```

**Response:**
```json
{
  "message": "Module created successfully",
  "module": {
    "id": "module-id-new",
    "name": "reports",
    "displayName": "Reports",
    "description": "Reports and analytics module",
    "icon": "mdi-chart-line",
    "isActive": true,
    "createdAt": "2024-01-21T10:00:00.000Z",
    "updatedAt": "2024-01-21T10:00:00.000Z"
  }
}
```

---

### 5. Update Module
```
PUT /api/modules/:id
```
**Example:**
```
PUT /api/modules/65a8f3c4d1e2f3g4h5i6j7k8
```

**Headers:**
```
Authorization: Bearer TOKEN
Content-Type: application/json
```

**Payload:**
```json
{
  "name": "reports",
  "displayName": "Reports & Analytics",
  "description": "Advanced reports and analytics module",
  "icon": "mdi-chart-line",
  "isActive": true
}
```

**Response:**
```json
{
  "message": "Module updated successfully",
  "module": {
    "id": "65a8f3c4d1e2f3g4h5i6j7k8",
    "name": "reports",
    "displayName": "Reports & Analytics",
    "description": "Advanced reports and analytics module",
    "icon": "mdi-chart-line",
    "isActive": true,
    "createdAt": "2024-01-21T10:00:00.000Z",
    "updatedAt": "2024-01-21T10:00:00.000Z"
  }
}
```

---

### 6. Delete Module
```
DELETE /api/modules/:id
```
**Example:**
```
DELETE /api/modules/65a8f3c4d1e2f3g4h5i6j7k8
```

**Headers:**
```
Authorization: Bearer TOKEN
```

**Response:**
```json
{
  "message": "Module deleted successfully"
}
```

**Error Response (if permissions exist):**
```json
{
  "message": "Cannot delete module. 4 permission(s) are using this module."
}
```

---

## COMPLETE API WORKFLOW EXAMPLE

### Step 1: Get Token (Login)
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}
```

### Step 2: Get Available Roles (for dropdown)
```
GET /api/roles/active/list
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 3: Get All Modules and Permissions
```
GET /api/modules
GET /api/permissions
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 4: Create New Role with Permissions
```
POST /api/roles
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "name": "content-manager",
  "description": "Can manage content",
  "permissions": ["perm-id-1", "perm-id-2", "perm-id-3"],
  "isActive": true
}
```

### Step 5: Assign Role to New User
```
POST /api/users
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "email": "newuser@example.com",
  "name": "New User",
  "password": "password123",
  "firstName": "New",
  "lastName": "User",
  "role": "role-id-of-content-manager"
}
```

---

## Error Responses

### 401 Unauthorized (No Token)
```json
{
  "message": "Authorization token missing"
}
```

### 403 Forbidden (Invalid Token)
```json
{
  "message": "Invalid or expired token"
}
```

### 404 Not Found
```json
{
  "message": "Role not found"
}
```

### 409 Conflict (Duplicate)
```json
{
  "message": "Role already exists with this name"
}
```

### 400 Bad Request (Validation Error)
```json
{
  "message": "Role name is required"
}
```

### 500 Internal Server Error
```json
{
  "message": "Internal server error"
}
```

---

## Notes
- All timestamps are in ISO 8601 format
- Role names are automatically converted to lowercase
- Permission names are automatically converted to lowercase
- Permissions must be assigned to an existing module
- Active/inactive status filters apply to related queries
