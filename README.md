# AssistMaster (Group Project) API Documentation

## Endpoints

List of available endpoints:

### Users
- `POST /login`

### Jobs
- `GET /jobs/:jobId`

### Profile
- `GET /profile/histories`
- `GET /profile/wallet`
- `PATCH /profile/wallet`

### Clients
- `POST /clients/register`
- `GET /clients/profile`
- `GET /clients/jobs/active`
- `POST /clients/jobs/bersih`
- `POST /clients/jobs/belanja`
- `GET /clients/jobs/:jobId/workers`
- `PATCH /clients/jobs/:jobId/client`
- `PATCH /clients/jobs/:jobId/workerId`

### Workers
- `POST /workers/register`
- `GET /workers/profile`
- `PATCH /workers/profile`
- `GET /workers/profile/reviews`
- `GET /workers/job`
- `GET /workers/jobs/worker`
- `PATCH /workers/jobs/:jobId/worker`
- `POST workers/jobs/:jobId`

### Payment
- `POST payment/topup`

&nbsp;

## 1. POST /login

Description:
- Creating access token if the email and password is available on Users database and the password is matching for login access

- Body:
```json
{
    "email": "String",
    "password": "String",
}
```

_Response (201 - created)_
```json
{
    "access_token": "String",
    "role": "String"
}
```

_Response (400 - Bad Request)_
```json
{
    "message": "Please input yout email!"
}
OR
{
    "message": "Please input yout password!"
}
```

_Response (401 - Unauthorized)_
```json
{
    "message": "Invalid email/password"
}
```

&nbsp;

## 2. GET /jobs/:jobId

Description:
- Getting a job detail based on jobId

- Headers:
```json
{
    "access_token": "String"
}
```

- Params:
```json
{
    "jobId": "ObjectId"
}
```

_Response (200 - OK)_
```json
{
    "_id": "ObjectId",
    "description": "String",
    "address": "String",
    "fee": "number",
    "images": ["String"],
    "clientId": "ObjectId",
    "workerId": "ObjectId",
    "categoryId": "ObjectId",
    "chatId": "ObjectId",
    "createdAt": "Date",
    "updatedAt": "Date"
}
```

&nbsp;

## 3. GET /profile/histories

Description:
- Getting the transaction histories for current login user, it can sorted and filtered by date.

- Headers:
```json
{
    "access_token": "String"
}
```

- Query (Optional):
```json
{
    "sort": "String (Default: asc)",
    "filter": "String (Default: week)"
}
```

_Response (200 - OK)_
```json
[
    {
        "_id": "ObjectId",
        "clientId": "ObjectId",
        "workerId": "ObjectId",
        "jobId": "ObjectId",
        "createdAt": "Date",
        "updatedAt": "Date",
        "__v": "Number"
    },
    ...
]
```

&nbsp;

## 4. GET /profile/wallet

Description:
- Getting the user wallet information for current login user.

- Headers:
```json
{
    "access_token": "String"
}
```

_Response (200 - OK)_
```json
{
    "_id": "ObjectId",
    "amount": "Number",
    "userId": "ObjectId",
    "createdAt": "Date",
    "updatedAt": "Date",
    "__v": "Number"
}
```

&nbsp;

## 5. PATCH /profile/wallets

Description:
- Updating the current login user wallet balance based on topupId

- Headers:
```json
{
    "access_token": "String"
}
```

- Body:
```json
{
    "topupId": "String"
}
```

_Response (200 - OK)
```json
{
    "message": "TopUp Success"
}
```

_Response (400 - Bad Request)
```json
{
    "message": "TopUp Failed"
}
```

&nbsp;

## 6. POST /clients/register

Description: 
- Register a new user and wallet as client

- Body:
```json
{
    "email": "String",
    "phoneNumber": "String",
    "password": "String"
}
```

_Response (201 - Created)_
```json
{
    "email": "String",
    "phoneNumber": "String",
    "role": "client",
    "createdAt": "Date",
    "updatedAt": "Date",
    "_id": "ObjectId",
    "__v": "Number"
}
```

_Response(400 - Bad Request)_
```json
{
    "message": "Path `email` is required"
}
OR
{
    "message": "Invalid email address"
}
OR
{
    "message": "Email already exist!"
}
OR
{
    "message": "Path `phoneNumber` is required"
}
OR
{
    "message": "Path `password` is required"
}
OR
{
    "message": "Password must be at least 6 characters!"
}
```

&nbsp;

## 7. PATCH /clients/profile

Description:
- Updating Client's profile information, including name, date of birth, address, and image profile

- Headers:
```json
{
    "access_token": "String"
}
```

- Body:
```json
{
    "name": "String",
    "dateOfBirth": "String",
    "address": "String"
}
```

- File:
```json
{
    "image": "Image"
}
```

_Response (200 - OK)_
```json
{
  "message": "Successfully updated profile"
}
```

_Response (400 - Bad Request)_
```json
{
  "message": "Image not found"
}
```

&nbsp;

## 8. GET /clients/profile

Description:
- Getting  the profile information of current login user

- Headers:
```json
{
    "access_token": "String"
}
```

_Response (200 - OK)_
```json
{
    "_id": "ObjectId",
    "name": "String",
    "dateOfBirth": "Date",
    "profilePicture": "String",
    "address": "String",
    "userId": "ObjectId",
    "createdAt": "Date",
    "updatedAt": "Date",
    "__v": 0,
    "usersData": {
        "_id": "ObjectId",
        "phoneNumber": "String",
        "role": "client",
        "createdAt": "Date",
        "updatedAt": "Date",
        "__v": 0
    }
}
```

&nbsp;

## 9. GET /clients/jobs/active

Description:
- Getting the jobs list that are currently active from current login user, it can be sorted by createdAt and filtered by category

- Headers:
```json
{
    "access_token": "String"
}
```

_Response(200 - OK)_
```json
[
    {
        "_id": "ObjectId",
        "description": "String",
        "addess": "String",
        "fee": "Number",
        "images": ["String"],
        "clientId": "OjectId",
        "workerId": "ObjectId",
        "categoryId": "ObjectId",
        "chatId": "ObjectId",
        "createdAt": "Date",
        "updatedAt": "Date",
        "__v": "Number",
        "category": {
            "_id": "ObjectId",
            "name": "String",
            "description": "String",
            "createdAt": "Date",
            "updatedAt": "Date",
            "__v": "Number"
        },
        "status": {
            "_id": "ObjectId",
            "jobId": "ObjectId",
            "isWorkerConfirmed": "Boolean",
            "isClientConfirmed": "Boolean",
            "isDone": "Boolean",
            "createdAt": "Date",
            "updatedAt": "Date",
            "__v": "Number"
        }
    }
]
```

&nbsp;

## 10. POST /clients/jobs/bersih

Description:
- Creating a new "Bersih"(Cleaning) Job from current login user. The input will be fee, description, address, and array of image data.

- Headers:
```json
{
    "access_token": "String"
}
```

- Body:
```json
{
    "fee": "Number",
    "description": "String",
    "address": "String"
}
```

- Files:
```json
{
    "image": ["Image"]
}
```

_Response (201 - Created)_
```json
{
    "message": "Job is successfully created!"
}
```

_Response (400 - Bad Request)_
```json
{
    "message": "You don't have enough money"
}
OR
{
  "message": "Image not found"
}
```

&nbsp;

## 11. POST /clients/jobs/belanja

Description:
- Creating a new "Belanja"(Shopping) Job from current login user. The input will be fee, description, address.

- Headers:
```json
{
    "access_token": "String"
}
```

- Body:
```json
{
    "fee": "Number",
    "description": "String",
    "address": "String"
}
```

_Response (201 - Created)_
```json
{
    "message": "Job is successfully created!"
}
```

_Response (400 - Bad Request)_
```json
{
    "message": "You don't have enough money"
}
```

&nbsp;

## Global Errors

_Response (401 - Unauthorized)_

```json
{
  "message": "Invalid access token"
}
```

_Response (403 - Forbidden)_

```json
{
  "message": "Insufficient privileges to do this action"
}
```

_Response (404 - Not Found)_
```json
{
    "message": "Data Not found"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Internal server error"
}
```