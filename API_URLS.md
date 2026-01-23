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
## 👥 User Groups Endpoints

### 1. Get All User Groups
```
GET /user-groups
```
**URL:** `http://localhost:5000/api/user-groups`

**Header:** `Authorization: Bearer <JWT_TOKEN>`

---

### 2. Get User Group by ID
```
GET /user-groups/:id
```
**URL:** `http://localhost:5000/api/user-groups/USER_GROUP_ID_HERE`

**Header:** `Authorization: Bearer <JWT_TOKEN>`

---

### 3. Create User Group
```
POST /user-groups
```
**URL:** `http://localhost:5000/api/user-groups`

**Header:** `Authorization: Bearer <JWT_TOKEN>`

**Form Data:**
- `name` (required): Group name
- `description` (optional): Group description
- `members` (optional): JSON array of user IDs `["USER_ID_1", "USER_ID_2"]`
- `logo` (optional): Image file for group logo

**Example:**
```json
{
  "name": "Marketing Team",
  "description": "Marketing department group",
  "members": ["USER_ID_1", "USER_ID_2"]
}
```

---

### 4. Update User Group
```
PUT /user-groups/:id
```
**URL:** `http://localhost:5000/api/user-groups/USER_GROUP_ID_HERE`

**Header:** `Authorization: Bearer <JWT_TOKEN>`

**Form Data:**
- `name` (optional): Updated group name
- `description` (optional): Updated group description
- `members` (optional): JSON array of user IDs
- `logo` (optional): New image file for group logo

---

### 5. Delete User Group
```
DELETE /user-groups/:id
```
**URL:** `http://localhost:5000/api/user-groups/USER_GROUP_ID_HERE`

**Header:** `Authorization: Bearer <JWT_TOKEN>`

---

### 6. Add Member to Group
```
POST /user-groups/:id/members
```
**URL:** `http://localhost:5000/api/user-groups/USER_GROUP_ID_HERE/members`

**Header:** `Authorization: Bearer <JWT_TOKEN>`

**Body:**
```json
{
  "userId": "USER_ID_HERE"
}
```

---

### 7. Remove Member from Group
```
DELETE /user-groups/:id/members/:userId
```
**URL:** `http://localhost:5000/api/user-groups/USER_GROUP_ID_HERE/members/USER_ID_HERE`

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

## � Categories Endpoints

### 1. Get All Categories
```
GET /categories
```
**URL:** `http://localhost:5000/api/categories`

**Header:** `Authorization: Bearer <JWT_TOKEN>`

---

### 2. Get Category by ID
```
GET /categories/:id
```
**URL:** `http://localhost:5000/api/categories/CATEGORY_ID_HERE`

**Header:** `Authorization: Bearer <JWT_TOKEN>`

---

### 3. Create Category
```
POST /categories
```
**URL:** `http://localhost:5000/api/categories`

**Header:** `Authorization: Bearer <JWT_TOKEN>`

**Body:**
```json
{
  "name": "Groceries",
  "description": "Food and household items",
  "type": "expense",
  "icon": "mdi-food",
  "color": "#FF5252",
  "isActive": true
}
```

---

### 4. Update Category
```
PUT /categories/:id
```
**URL:** `http://localhost:5000/api/categories/CATEGORY_ID_HERE`

**Header:** `Authorization: Bearer <JWT_TOKEN>`

**Body:**
```json
{
  "name": "Groceries & Food",
  "description": "Updated: Food and household items",
  "type": "expense",
  "icon": "mdi-food",
  "color": "#FF5252",
  "isActive": true
}
```

---

### 5. Delete Category
```
DELETE /categories/:id
```
**URL:** `http://localhost:5000/api/categories/CATEGORY_ID_HERE`

**Header:** `Authorization: Bearer <JWT_TOKEN>`

---

## �📋 Quick Reference Summary

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
| Get All User Groups | GET | `http://localhost:5000/api/user-groups` |
| Get User Group | GET | `http://localhost:5000/api/user-groups/:id` |
| Create User Group | POST | `http://localhost:5000/api/user-groups` |
| Update User Group | PUT | `http://localhost:5000/api/user-groups/:id` |
| Delete User Group | DELETE | `http://localhost:5000/api/user-groups/:id` |
| Add Group Member | POST | `http://localhost:5000/api/user-groups/:id/members` |
| Remove Group Member | DELETE | `http://localhost:5000/api/user-groups/:id/members/:userId` |
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
| Get All Categories | GET | `http://localhost:5000/api/categories` |
| Get Category | GET | `http://localhost:5000/api/categories/:id` |
| Create Category | POST | `http://localhost:5000/api/categories` |
| Update Category | PUT | `http://localhost:5000/api/categories/:id` |
| Delete Category | DELETE | `http://localhost:5000/api/categories/:id` |

---

## � Income Endpoints

### 1. Get All Incomes
```
GET /income
```
**URL:** `http://localhost:5000/api/income`

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Response:**
```json
{
  "incomes": [
    {
      "id": "67932710....",
      "title": "Salary",
      "amount": 50000,
      "description": "Monthly salary",
      "category": {
        "id": "679...",
        "name": "Salary",
        "type": "income"
      },
      "date": "2026-01-23T00:00:00.000Z",
      "createdBy": {
        "id": "606...",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "createdAt": "2026-01-23T08:33:52.614Z",
      "updatedAt": "2026-01-23T08:33:52.614Z"
    }
  ]
}
```

---

### 2. Get Income by ID
```
GET /income/:id
```
**URL:** `http://localhost:5000/api/income/:id`

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

---

### 3. Create Income
```
POST /income
```
**URL:** `http://localhost:5000/api/income`

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Body:**
```json
{
  "title": "Freelance Project",
  "amount": 15000,
  "description": "Website development project",
  "category": "67932710bcf2b29e6eaabe1f",
  "date": "2026-01-23"
}
```

**Response:**
```json
{
  "message": "Income created successfully",
  "income": {
    "id": "679...",
    "title": "Freelance Project",
    "amount": 15000,
    "description": "Website development project",
    "category": {
      "id": "679...",
      "name": "Freelance",
      "type": "income"
    },
    "date": "2026-01-23T00:00:00.000Z",
    "createdBy": {...},
    "createdAt": "2026-01-23T08:33:52.614Z",
    "updatedAt": "2026-01-23T08:33:52.614Z"
  }
}
```

---

### 4. Update Income
```
PUT /income/:id
```
**URL:** `http://localhost:5000/api/income/:id`

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Body:**
```json
{
  "title": "Updated Title",
  "amount": 20000,
  "description": "Updated description",
  "category": "67932710bcf2b29e6eaabe1f",
  "date": "2026-01-24"
}
```

---

### 5. Delete Income
```
DELETE /income/:id
```
**URL:** `http://localhost:5000/api/income/:id`

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Response:**
```json
{
  "message": "Income deleted successfully"
}
```

---

## 📊 Income API Summary Table

| Action | Method | URL |
|--------|--------|-----|
| Get All Incomes | GET | `http://localhost:5000/api/income` |
| Get Income | GET | `http://localhost:5000/api/income/:id` |
| Create Income | POST | `http://localhost:5000/api/income` |
| Update Income | PUT | `http://localhost:5000/api/income/:id` |
| Delete Income | DELETE | `http://localhost:5000/api/income/:id` |

---

## 💸 Expense Endpoints

### 1. Get All Expenses
```
GET /expense
```
**URL:** `http://localhost:5000/api/expense`

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Response:**
```json
{
  "expenses": [
    {
      "id": "67932710....",
      "title": "Grocery Shopping",
      "amount": 5000,
      "description": "Monthly groceries",
      "category": {
        "id": "679...",
        "name": "Food",
        "type": "expense"
      },
      "date": "2026-01-23T00:00:00.000Z",
      "createdBy": {
        "id": "606...",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "createdAt": "2026-01-23T08:33:52.614Z",
      "updatedAt": "2026-01-23T08:33:52.614Z"
    }
  ]
}
```

---

### 2. Get Expense by ID
```
GET /expense/:id
```
**URL:** `http://localhost:5000/api/expense/:id`

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

---

### 3. Create Expense
```
POST /expense
```
**URL:** `http://localhost:5000/api/expense`

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Body:**
```json
{
  "title": "Electricity Bill",
  "amount": 2500,
  "description": "Monthly electricity payment",
  "category": "67932710bcf2b29e6eaabe1f",
  "date": "2026-01-23"
}
```

**Response:**
```json
{
  "message": "Expense created successfully",
  "expense": {
    "id": "679...",
    "title": "Electricity Bill",
    "amount": 2500,
    "description": "Monthly electricity payment",
    "category": {
      "id": "679...",
      "name": "Utilities",
      "type": "expense"
    },
    "date": "2026-01-23T00:00:00.000Z",
    "createdBy": {...},
    "createdAt": "2026-01-23T08:33:52.614Z",
    "updatedAt": "2026-01-23T08:33:52.614Z"
  }
}
```

---

### 4. Update Expense
```
PUT /expense/:id
```
**URL:** `http://localhost:5000/api/expense/:id`

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Body:**
```json
{
  "title": "Updated Title",
  "amount": 3000,
  "description": "Updated description",
  "category": "67932710bcf2b29e6eaabe1f",
  "date": "2026-01-24"
}
```

---

### 5. Delete Expense
```
DELETE /expense/:id
```
**URL:** `http://localhost:5000/api/expense/:id`

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Response:**
```json
{
  "message": "Expense deleted successfully"
}
```

---

## 📊 Expense API Summary Table

| Action | Method | URL |
|--------|--------|-----|
| Get All Expenses | GET | `http://localhost:5000/api/expense` |
| Get Expense | GET | `http://localhost:5000/api/expense/:id` |
| Create Expense | POST | `http://localhost:5000/api/expense` |
| Update Expense | PUT | `http://localhost:5000/api/expense/:id` |
| Delete Expense | DELETE | `http://localhost:5000/api/expense/:id` |

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

### User Groups
- `http://localhost:5000/api/user-groups`
- `http://localhost:5000/api/user-groups/:id`
- `http://localhost:5000/api/user-groups/:id/members`
- `http://localhost:5000/api/user-groups/:id/members/:userId`

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

### Categories
- `http://localhost:5000/api/categories`
- `http://localhost:5000/api/categories/:id`

### Income
- `http://localhost:5000/api/income`
- `http://localhost:5000/api/income/:id`

### Expense
- `http://localhost:5000/api/expense`
- `http://localhost:5000/api/expense/:id`

---

## 📝 Notes

- Replace `:id`, `:moduleId` with actual IDs
- All endpoints (except register/login) require `Authorization: Bearer <JWT_TOKEN>` header
- All POST/PUT endpoints require `Content-Type: application/json` header
- JWT token expires after 24 hours
- Base URL can be changed in `.env` file (default: `localhost:5000`)
- Income categories must have `type: "income"` to be used in income records
- Expense categories must have `type: "expense"` to be used in expense records
- Income and Expense modules are only accessible by users with "user" role
- Categories and Income/Expense records are filtered by `createdBy` (user can only see their own records)
