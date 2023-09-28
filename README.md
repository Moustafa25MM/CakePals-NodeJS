## Description

CakePals is an app where people can sell home-baked cakes and pies to each other. There are Bakers
who can register on CakePals and list their products for sale. App users typically look for available
offerings nearby, create a member account (if needed) and place a baking order. Bakers receive orders,
bake and hand over ready products at the agreed collection time.

## project Requirments

Create a backend API application for CakePals. Consider 3 types of users:

- guests (unregistered or unauthenticated users);
- members — registered users that order cakes from bakers;
- bakers — registered users that offer cakes and get paid.

In addition to typical data (e.g. identifiers), consider that:

- Baker’s profile includes a picture, self-introduction, location, rating, and collection time range.
- Cake offering includes title, description, price, baking time, and type (e.g. fruit cake, meat pie).
- Order information includes payment method and collection time.

Here are the features that we ask you to implement

- Bakers and members can register, log in and log out.
- Bakers can add new cakes for selling and then edit or remove their offerings.
- All users can list available cake offerings and filter them by location and type.
- All users can see a baker’s profile (with description and rating).
- Members can see available collection times and place orders. For collection time availability,
  assume that each baker can bake only one cake at a time.
- Bakers can see their orders, accept, reject and fulfil them.
- Customers can rate their fulfilled orders. Orders rates form the overall baker’s rating.

## Future Enhancements for the CakePals Backend API

- add email verification.
- create a dashboard for the baker to monitor their businesses.
- currently payment method is cash on collection (COC), we can add new payment methods.
- Notification Services: Implement a notification service to keep users and bakers updated. Notify bakers when they receive a new order, and update users about their order status. This can be done via email or using a service like Firebase.
- notifiy the baker when there is a new order
- notify the user when his order has been created
- Order Expiry: If an order remains pending for more than a certain time limit (like 15 minutes), automatically cancel it and notify the user.
- Order Cancellation: Allow users to cancel their orders within a certain period (like 15 minutes) after placement.
- Create a strategy for handling situations where a user doesn't pick up an order or a baker doesn't fulfill an order. This could involve compensating bakers for uncollected orders, changing to card-only payments to secure funds before baking, or implementing a dispute resolution process.

## Installation

### Install packages

```bash
npm i
```

### Running the app

```python
1. create a .env file in the root directory and add the following as an example:

PORT=4000
MONGO_URL=mongodb+srv://admin:password@cluster0.95slelx.mongodb.net/cakepals

JWT_SECRET='cakepals'

CLOUDINARY_CLOUD_NAME=CLOUD_NAME
CLOUDINARY_API_KEY=API_KEY
CLOUDINARY_API_SECRET=API_SECRET

2. npm run dev -> to run the server
3. npm test -> to run tests
```

## Test

```python
# to run tests
$ npm test

```

## Technologies

- Nodejs
- TypeScript
- mongodb
- jasmine

```

```

## How to use

### register as Baker

```python
1. endpoint = http://localhost:4000/register   "Or any port of your choice"
2. Provide the following example json in the body :
{
    "firstName":"baker",
    "lastName":"baker"
    "password":"password",
    "email":"baker3@gmail.com",
    "phoneNumber":"01033022444"
    "street":"madinat nasr",
    "city":"cairo",
    "country":"egypt",
    "type":"baker",
    "start":"12:00",
    "end":"20:00"
}
It will return an object like this:
{
   {
    "isBaker": true,
    "street": "madinat nasr",
    "city": "giza",
    "country": "egypt",
    "collectionTimeRange": {
        "start": "2023-09-28T13:00:00.000Z",
        "end": "2023-09-28T22:00:00.000Z"
    },
    "rating": 0,
    "_id": "6515cfdb07a8a24c16539cf0",
    "firstName": "baker",
    "lastName": "baker",
    "email": "baker3@gmail.com",
    "phoneNumber": "01033022444",
    "__t": "Baker",
    "createdAt": "2023-09-28T19:11:23.047Z",
    "updatedAt": "2023-09-28T19:11:23.047Z",
    "__v": 0
}
}

```

### register as Member

```python
1. endpoint = http://localhost:4000/register   "Or any port of your choice"
2. Provide the following example json in the body :
{
    "firstName":"member",
    "lastName":"member"
    "password":"password",
    "email":"member3@gmail.com",
    "phoneNumber":"01033022444"
}
It will return an object like this:
{
   {
    "_id": "6515cfdb07a8a24c16539cf0",
    "firstName": "member",
    "lastName": "member",
    "email": "member3@gmail.com",
    "phoneNumber": "01033022444",
    "__t": "Member",
    "createdAt": "2023-09-28T19:11:23.047Z",
    "updatedAt": "2023-09-28T19:11:23.047Z",
    "__v": 0
}
}

```

### Login as Baker

```python
1. endpoint = http://localhost:4000/login   "Or any port of your choice"
2. Provide the following example json in the body :
{
  "email":"baker1@example.com",
    "password":"password"
}

It will return an object like this:
{
   {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1MTVjMGU3MWYxZjAyZDAyYjFiNmY4MiIsImlhdCI6MTY5NTkyODM5MiwiZXhwIjoxNjk2NTMzMTkyfQ.pl15s3t3pT23U1r_oOpVo0kRS7dUqoPiW0c61GMhrSk",
    "user": {
        "id": "6515c0e71f1f02d02b1b6f82",
        "firstName": "baker",
        "lastName": "baker",
        "email": "baker1@gmail.com",
        "type": "Baker"
    }
}
}

```

### Login as Member

```python
1. endpoint = http://localhost:4000/login   "Or any port of your choice"
2. Provide the following example json in the body :
{
  "email":"member1@example.com",
    "password":"password"
}

It will return an object like this:
{
   {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1MTVjMGU3MWYxZjAyZDAyYjFiNmY4MiIsImlhdCI6MTY5NTkyODM5MiwiZXhwIjoxNjk2NTMzMTkyfQ.pl15s3t3pT23U1r_oOpVo0kRS7dUqoPiW0c61GMhrSk",
    "user": {
        "id": "6515c0e71f1f02d02b1b6f82",
        "firstName": "member",
        "lastName": "member",
        "email": "member1@gmail.com",
        "type": "Member"
    }
}
}

```

### get Baker By Id

```python
1. endpoint =  http://localhost:4000/baker/6515c29fef1210044f9ff1ff   "Or any port of your choice"

It will return an object like this:

{
    "collectionTimeRange": {
        "start": "2023-09-28T12:00:00.000Z",
        "end": "2023-09-28T20:00:00.000Z"
    },
    "_id": "6515c29fef1210044f9ff1ff",
    "isBaker": true,
    "street": "faisal",
    "city": "giza",
    "country": "egypt",
    "rating": 2,
    "firstName": "ahmed",
    "lastName": "mahmoud",
    "email": "baker2@gmail.com",
    "phoneNumber": "01033022411",
    "__t": "Baker",
    "createdAt": "2023-09-28T18:14:55.799Z",
    "updatedAt": "2023-09-28T18:45:52.419Z",
    "__v": 0
}
```

### get All Bakers

```python
1. endpoint =   http://localhost:4000/baker/all   "Or any port of your choice"

It will return an object like this:

{
    "paginations": {
        "totalDocs": 2,
        "limit": 5,
        "totalPages": 1,
        "page": 1,
        "pagingCounter": 1,
        "hasPrevPage": false,
        "hasNextPage": false,
        "prevPage": null,
        "nextPage": null
    },
    "bakers": [
        {
            "collectionTimeRange": {
                "start": "2023-09-28T13:00:00.000Z",
                "end": "2023-09-28T22:00:00.000Z"
            },
            "_id": "6515c0e71f1f02d02b1b6f82",
            "isBaker": true,
            "street": "madinat nasr",
            "city": "cairo",
            "country": "egypt",
            "rating": 0,
            "firstName": "moustafa",
            "lastName": "mahmoud",
            "email": "baker1@gmail.com",
            "phoneNumber": "01033022410",
            "__t": "Baker",
            "createdAt": "2023-09-28T18:07:35.232Z",
            "updatedAt": "2023-09-28T18:07:35.232Z",
            "__v": 0
        },
        {
            "collectionTimeRange": {
                "start": "2023-09-28T13:00:00.000Z",
                "end": "2023-09-28T22:00:00.000Z"
            },
            "_id": "6515c29fef1210044f9ff1ff",
            "isBaker": true,
            "street": "faisal",
            "city": "giza",
            "country": "egypt",
            "rating": 0,
            "firstName": "ahmed",
            "lastName": "mahmoud",
            "email": "baker2@gmail.com",
            "phoneNumber": "01033022411",
            "__t": "Baker",
            "createdAt": "2023-09-28T18:14:55.799Z",
            "updatedAt": "2023-09-28T18:14:55.799Z",
            "__v": 0
        }
    ]
}
```

### Create Product

```python
1. endpoint =    http://localhost:4000/product/create   "Or any port of your choice"
2. you provide an Authorization token in the headres

3. Provide the following example json in the body :
{
    "type":"pie",
    "image":"http://res.cloudinary.com/das9oh9bs/image/upload/v1694048201/function%20now%28%29%20%7B%20%5Bnative%20code%5D%20%7D.png",
    "price":"100"
    "bakingTime":"2h"
}

It will return an object like this:

{
    "ownerID": "6515c29fef1210044f9ff1ff",
    "type": "cokkie",
    "price": 100,
    "image": "http://res.cloudinary.com/das9oh9bs/image/upload/v1695925105/function%20now%28%29%20%7B%20%5Bnative%20code%5D%20%7D.png",
    "bakingTime": "2 hours",
    "_id": "6515c394ef1210044f9ff212",
    "createdAt": "2023-09-28T18:19:00.265Z",
    "updatedAt": "2023-09-28T18:19:00.265Z",
    "__v": 0
}
```

### update Product

```python
1. endpoint =   http://localhost:4000/product/update/6515c394ef1210044f9ff212   "Or any port of your choice"
2. you provide an Authorization token in the headres

3. Provide the following example json in the body :
{
    "price":"200"
}

It will return an object like this:

{
    "_id": "6515c394ef1210044f9ff212",
    "ownerID": "6515c29fef1210044f9ff1ff",
    "type": "cokkie",
    "price": 200,
    "image": "http://res.cloudinary.com/das9oh9bs/image/upload/v1695925105/function%20now%28%29%20%7B%20%5Bnative%20code%5D%20%7D.png",
    "bakingTime": "3 hours",
    "createdAt": "2023-09-28T18:19:00.265Z",
    "updatedAt": "2023-09-28T18:24:52.507Z",
    "__v": 0
}
```

### delete product

```python
1. endpoint =   http://localhost:4000/product/delete/6515c394ef1210044f9ff212   "Or any port of your choice"
2. you provide an Authorization token in the headres

It will return an object like this:

{
    "message": "Product deleted successfully"
}
```

### list all products

```python
1. endpoint =  http://localhost:4000/product/all   "Or any port of your choice"

It will return an object like this:

{
    "pagination": {
        "totalDocs": 1,
        "limit": 5,
        "totalPages": 1,
        "page": 1,
        "pagingCounter": 1,
        "hasPrevPage": false,
        "hasNextPage": false,
        "prevPage": null,
        "nextPage": null
    },
    "products": [
        {
            "_id": "6515c371ef1210044f9ff20e",
            "ownerID": {
                "collectionTimeRange": {
                    "start": "2023-09-28T12:00:00.000Z",
                    "end": "2023-09-28T20:00:00.000Z"
                },
                "_id": "6515c29fef1210044f9ff1ff",
                "isBaker": true,
                "street": "faisal",
                "city": "giza",
                "country": "egypt",
                "rating": 0,
                "firstName": "ahmed",
                "lastName": "mahmoud",
                "email": "baker2@gmail.com",
                "phoneNumber": "01033022411",
                "__t": "Baker",
                "createdAt": "2023-09-28T18:14:55.799Z",
                "updatedAt": "2023-09-28T18:29:20.923Z",
                "__v": 0
            },
            "type": "pie",
            "price": 100,
            "image": "http://res.cloudinary.com/das9oh9bs/image/upload/v1695925105/function%20now%28%29%20%7B%20%5Bnative%20code%5D%20%7D.png",
            "bakingTime": "1 hours",
            "createdAt": "2023-09-28T18:18:25.655Z",
            "updatedAt": "2023-09-28T18:18:25.655Z",
            "__v": 0
        }
    ]
}
```

### Baker update Profile

```python
1. endpoint =   http://localhost:4000/baker/update/6515c29fef1210044f9ff1ff   "Or any port of your choice"
2. you provide an Authorization token in the headres

3. Provide the following example json in the body :
{
    "start":"12:00",
    "end":"20:00"
}

It will return an object like this:

{
    "collectionTimeRange": {
        "start": "2023-09-28T12:00:00.000Z",
        "end": "2023-09-28T20:00:00.000Z"
    },
    "_id": "6515c29fef1210044f9ff1ff",
    "isBaker": true,
    "street": "faisal",
    "city": "giza",
    "country": "egypt",
    "rating": 0,
    "firstName": "ahmed",
    "lastName": "mahmoud",
    "email": "baker2@gmail.com",
    "phoneNumber": "01033022411",
    "__t": "Baker",
    "createdAt": "2023-09-28T18:14:55.799Z",
    "updatedAt": "2023-09-28T18:29:20.923Z",
    "__v": 0
}
```

### Member place Order

```python
1. endpoint =   http://localhost:4000/order/create/   "Or any port of your choice"
2. you provide an Authorization token in the headres

3. Provide the following example json in the body :
{
    "productID":"6515c371ef1210044f9ff20e",
    "collectionTime":"14:00",
    "paymentMethod":"cash"
}
It will return an object like this:

{
    "memberID": "6515c2dbef1210044f9ff203",
    "productID": "6515c371ef1210044f9ff20e",
    "bakingStartTime": "2023-09-28T19:00:00.000Z",
    "collectionTime": "2023-09-28T20:00:00.000Z",
    "paymentMethod": "cash",
    "status": "pending",
    "_id": "6515d23a07a8a24c16539cf7",
    "createdAt": "2023-09-28T19:21:30.074Z",
    "updatedAt": "2023-09-28T19:21:30.074Z",
    "__v": 0
}
```

### Baker get his orders

```python
1. endpoint =   http://localhost:4000/order/baker-orders/   "Or any port of your choice"
2. you provide an Authorization token in the headres

It will return an object like this:

{
    "paginations": {
        "totalDocs": 2,
        "limit": 5,
        "totalPages": 1,
        "page": 1,
        "pagingCounter": 1,
        "hasPrevPage": false,
        "hasNextPage": false,
        "prevPage": null,
        "nextPage": null
    },
    "orders": [
        {
            "_id": "6515c6a7ff78787e59c767ea",
            "memberID": "6515c2dbef1210044f9ff203",
            "productID": "6515c371ef1210044f9ff20e",
            "bakingStartTime": "2023-09-28T14:00:00.000Z",
            "collectionTime": "2023-09-28T15:00:00.000Z",
            "paymentMethod": "cash",
            "status": "accepted",
            "createdAt": "2023-09-28T18:32:07.602Z",
            "updatedAt": "2023-09-28T18:33:47.958Z",
            "__v": 0
        },
        {
            "_id": "6515c737ff78787e59c767fe",
            "memberID": "6515c2dbef1210044f9ff203",
            "productID": "6515c371ef1210044f9ff20e",
            "bakingStartTime": "2023-09-28T17:00:00.000Z",
            "collectionTime": "2023-09-28T18:00:00.000Z",
            "paymentMethod": "cash",
            "status": "pending",
            "createdAt": "2023-09-28T18:34:31.225Z",
            "updatedAt": "2023-09-28T18:34:31.225Z",
            "__v": 0
        }
    ]
}
```

### Baker accepts order

```python
1. endpoint =  http://localhost:4000/order/accept/6515c6a7ff78787e59c767ea   "Or any port of your choice"
2. you provide an Authorization token in the headres

It will return an object like this:

{
    "_id": "6515c6a7ff78787e59c767ea",
    "memberID": "6515c2dbef1210044f9ff203",
    "productID": "6515c371ef1210044f9ff20e",
    "bakingStartTime": "2023-09-28T14:00:00.000Z",
    "collectionTime": "2023-09-28T15:00:00.000Z",
    "paymentMethod": "cash",
    "status": "accepted",
    "createdAt": "2023-09-28T18:32:07.602Z",
    "updatedAt": "2023-09-28T18:33:47.958Z",
    "__v": 0
}
```

### Baker rejects order

```python
1. endpoint =  http://localhost:4000/order/reject/6515c737ff78787e59c767fe   "Or any port of your choice"
2. you provide an Authorization token in the headres

It will return an object like this:

{
    "_id": "6515c737ff78787e59c767fe",
    "memberID": "6515c2dbef1210044f9ff203",
    "productID": "6515c371ef1210044f9ff20e",
    "bakingStartTime": "2023-09-28T17:00:00.000Z",
    "collectionTime": "2023-09-28T18:00:00.000Z",
    "paymentMethod": "cash",
    "status": "rejected",
    "createdAt": "2023-09-28T18:34:31.225Z",
    "updatedAt": "2023-09-28T18:42:55.857Z",
    "__v": 0
}
```

### Baker fulfils order

```python
1. endpoint =  http://localhost:4000/order/fulfil/6515c6a7ff78787e59c767ea   "Or any port of your choice"
2. you provide an Authorization token in the headres

It will return an object like this:

{
    "_id": "6515c737ff78787e59c767fe",
    "memberID": "6515c2dbef1210044f9ff203",
    "productID": "6515c371ef1210044f9ff20e",
    "bakingStartTime": "2023-09-28T17:00:00.000Z",
    "collectionTime": "2023-09-28T18:00:00.000Z",
    "paymentMethod": "cash",
    "status": "fulfilled",
    "createdAt": "2023-09-28T18:34:31.225Z",
    "updatedAt": "2023-09-28T18:42:55.857Z",
    "__v": 0
}
```

### Member add Rate

```python
1. endpoint =   http://localhost:4000/rating/create   "Or any port of your choice"
2. you provide an Authorization token in the headres

3. Provide the following example json in the body :
{
    "orderId":"6515c6a7ff78787e59c767ea",
    "rate":2,
    "comment":"bad"
}
It will return an object like this:

{
    "bakerID": "6515c29fef1210044f9ff1ff",
    "memberID": "6515c2dbef1210044f9ff203",
    "orderID": "6515c6a7ff78787e59c767ea",
    "rate": 2,
    "comment": "bad",
    "_id": "6515c9c407a8a24c16539ce3",
    "createdAt": "2023-09-28T18:45:24.675Z",
    "updatedAt": "2023-09-28T18:45:24.675Z",
    "__v": 0
}
```

### get Baker Ratings

```python
1. endpoint =   http://localhost:4000/rating/baker/6515c29fef1210044f9ff1ff  "Or any port of your choice"
2. you provide an Authorization token in the headres

It will return an object like this:

{
    "avgRate": 2,
    "pagination": {
        "totalDocs": 1,
        "limit": 5,
        "totalPages": 1,
        "page": 1,
        "pagingCounter": 1,
        "hasPrevPage": false,
        "hasNextPage": false,
        "prevPage": null,
        "nextPage": null
    },
    "ratings": [
        {
            "memberId": {
                "_id": "6515c2dbef1210044f9ff203",
                "firstName": "alaa",
                "lastName": "mahmoud",
                "email": "member@gmail.com",
                "phoneNumber": "01033022412",
                "__t": "Member",
                "createdAt": "2023-09-28T18:15:55.651Z",
                "updatedAt": "2023-09-28T18:15:55.651Z",
                "__v": 0
            },
            "rate": 2,
            "comment": "bad"
        }
    ]
}
```
