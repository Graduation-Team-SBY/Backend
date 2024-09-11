# Yangtu (AssistMaster) API Documentation

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
    "jobId": "String"
}
```

_Response (200 - OK)_
```json
{
    "_id": "ObjectId",
    "title": "String",
    "description": "String",
    "address": "String",
    "fee": "number",
    "images": ["String"],
    "clientId": "ObjectId",
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
    "client": {
        "_id": "ObjectId",
        "name": "String",
        "dateOfBirth": "Date",
        "profilePicture": "String",
        "address": "String",
        "userId": "ObjectId",
        "createdAt": "Date",
        "updatedAt": "Date",
        "__v": "Number"
    }
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
    "filter": "String (Default: month)"
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

_Response (200 - OK)_
```json
{
    "message": "TopUp Success"
}
```

_Response (400 - Bad Request)_
```json
{
    "message": "TopUp Failed"
}
```

&nbsp;

## 6. GET /clients/best-yasa

Description:
- Getting top 5 list of the best worker(Yasa) based on rating

- Headers:
```json
{
    "access_token": "String"
}
```

_Response (200 - OK)_
```json
[
    {
        "_id": "ObjectId",
        "userId": "ObjectId",
        "bio": "String",
        "jobDone": "Number",
        "profilePicture": "String",
        "rating": "Number",
        "amount": "Number",
        "createdAt": "Date",
        "updatedAt": "Date",
        "__v": "Number"
    }
    ...
]
```

&nbsp;

## 7. POST /clients/register

Description: 
- Register a new user, profile, and wallet as client. Then send welcome email to registered client.

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
    "message": "PhoneNumber already exist!"
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

## 8. PATCH /clients/profile

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

&nbsp;

## 9. GET /clients/profile

Description:
- Getting the profile information of current login user who has client role

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

## 10. GET /clients/jobs/active

Description:
- Getting the jobs list that are currently active from current login user, it can be sorted by createdAt and filtered by category

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
    "category": "String"
}
```

_Response(200 - OK)_
```json
[
    {
        "_id": "ObjectId",
        "title": "String",
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
    },
    ...
]
```

&nbsp;

## 11. POST /clients/jobs/bersih

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
    "title": "String",
    "fee": "Number",
    "description": "String",
    "address": "String",
    "coordinates": {
        "lat": "Number",
        "lng": "Number"
    },
    "addressNotes": "String"
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
    "message": "Fill in your profile first!"
}
OR
{
    "message": "You don't have enough money"
}
OR
{
    "message": "Failed to upload image, please try again!"
}
```

&nbsp;

## 12. POST /clients/jobs/belanja

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
    "title": "String",
    "fee": "Number",
    "description": "String",
    "address": "String",
    "coordinates": {
        "lat": "Number",
        "lng": "Number"
    },
    "addressNotes": "String"
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
    "message": "Fill in your profile first!"
}
OR
{
    "message": "You don't have enough money"
}
```

&nbsp;

## 13. GET /clients/jobs/:jobId/workers

Description:
- Get the job detail and candidate worker list with detail based on jobId.

- Headers:
```json
{
    "access_token": "String"
}
```

- Params:
```json
{
    "jobId": "String"
}
```

_Response(200 - OK)_
```json
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
    "workers": [
        {
            "_id": "ObjectId",
            "userId": "ObjectId",
            "name": "String",
            "bio": "String",
            "address": "String",
            "dateOfBirth": "Date",
            "profilePicture": "String",
            "rating": "Number",
            "createdAt": "Date",
            "updatedAt": "Date",
            "__v": 0
        }
    ]
}
```

&nbsp;

## 14. PATCH /clients/jobs/:jobId/client

Description:
- Updating isClientConfirmed boolean on specific job and complete the job based jobId.

- Headers:
```json
{
    "access_token": "String"
}
```

- Params:
```json
{
    "jobId": "String"
}
```

_Response (200 - OK)_
```json
{
    "message": "Successfully update job order status"
}
```

_Response (400 - Bad Request)_
```json
{
    "message": "Worker haven't confirmed yet"
}
```

&nbsp;

## 15. POST /clients/jobs/:jobId/review

Description:
- Create a review for the worker based the job it done then update the worker rating's and reviews list.

- Headers:
```json
{
    "access_token": "String"
}
```

- Params:
```json
{
    "jobId": "String"
}
```

- Body:
```json
{
    "description": "String",
    "rating": "Number"
}
```

- Files:
```json
{
    "image": ["Image"]
}
```

_Response (200 - OK)_
```json
{
    "message": "Successfully update job order status"
}
```

_Response (400 - Bad Request)_
```json
{
    "message": "Please input the rating!"
}
```

&nbsp;

## 16. PATCH /clients/jobs/:jobId/:workerId

Description:
- Updating workerId based on parameter and jobId. Then creating new job status based on jobId. Picking the selected worker based on workerId

- Headers:
```json
{
    "access_token": "String"
}
```

- Params:
```json
{
    "jobId": "String",
    "workerId": "String"
}
```

_Response (200 - OK)_
```json
{
    "message": "Successfully picked worker"
}
```

_Response (400 - Bad Request)_
```json
{
    "message": "You already picked a worker before"
}
```

&nbsp;

## 17. DELETE /clients/jobs/:jobId

Description:
- Cancelling the job order and delete the job from database and refund the user balance. The deletion fail if there is worker assigned for the job

- Headers:
```json
{
    "access_token": "String"
}
```

- Params:
```json
{
    "jobId": "String"
}
```

_Response (200 - OK)_
```json
{
    "message": "Job is successfully canceled!"
}
```

_Response (403 - Forbidden)_
```json
{
    "message": "You cannot cancel this job order!"
}
```

&nbsp;

## 18. POST /workers/register

Description: 
- Register a new user and wallet as worker

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
    "role": "worker",
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
    "message": "PhoneNumber already exist!"
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

## 19. GET /workers/profile

Description:
- Getting the profile information of current login user who has worker role

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

## 20. PATCH /workers/profile

Description:
- Updating Worker's profile information, including name, date of birth, address, and image profile

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

&nbsp;

## 21. GET /workers/profile/reviews

Description:
- Getting the list of reviews based on current login user who has worker role

- Headers:
```json
{
    "access_token": "String"
}
```

_Response (200 - OK)_
```json
[
    {
        "_id": "ObjectId",
        "description": "String",
        "rating": "Number",
        "images": ["Stirng"],
        "createdAt": "Date",
        "updatedAt": "Date",
        "__v": 0,
    },
    ...
]
```

&nbsp;

## 22. GET /workers/jobs

Description:
- Getting the list of jobs that are currently worked by current login user with worker role

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
    },
    ...
]
```

&nbsp;

## 23. GET /workers/jobs/worker

Description:
- Getting the list of jobs that is open (No worker confirmed yet), it can be sorted by createdAt and filtered by category

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
    "category": "String"
}
```

_Response (200 - OK)_
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
        "client": {
            "_id": "ObjectId",
            "name": "String",
            "dateOfBirth": "Date",
            "profilePicture": "String",
            "address": "String",
            "userId": "ObjectId",
            "createdAt": "Date",
            "updatedAt": "Date",
            "__v": 0
        }
    },
    ...
]
```

&nbsp;

## 24. PATCH /workers/:jobId/worker

Description:
- Updating Job Status to become true boolean true with uploading image. Confirming the job completion from worker

- Headers:
```json
{
    "access_token": "String"
}
```

- Params:
```json
{
    "jobId": "String"
}
```

- Files:
```json
{
    "image": ["Image"]
}
```

_Response (200 - OK)_
```json
{
    "message": "Successfully update job status"
}
```

_Response (400 - Bad Request)_
```json
{
  "message": "Failed to upload image, please try again!"
}
```

&nbsp;

## 25. POST /workers/:jobId

Description:
- Creating new job request based on jobId request for applying job as worker

- Headers:
```json
{
    "access_token": "String"
}
```

- Params:
```json
{
    "jobId": "String"
}
```

_Response (201 - Created)_
```json
{
    "message": "Successfully applied to this job!"
}
```

_Response (400 - Bad Request)_
```json
{
    "message": "Fill in your profile first!"
}
OR
{
    "message": "You already applied to this job"
}
```

&nbsp;

## 24. POST /payment/topup

Description:
- Creating new job request based on jobId request for applying job as worker

- Headers:
```json
{
    "access_token": "String"
}
```

- Body:
```json
{
    "amount": "Number"
}
```

_Response (200 - OK)_
```json
{
    "trans_token": "String",
    "topUpId": "String"
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