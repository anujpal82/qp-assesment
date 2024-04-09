<h3 align="center">Steps to run the Project </h3>

1. Ensure that docker is installed in you project.
2. Make an .env file at root level and copy the content of .env.sample content into .env file.

3. Build node app image by using below command
   ` docker build -t my-node-app`
4. After building the node app start the docker using below command
   `docker-compose up -d`
5. After compose the two container should be running 1) node-app 2) PostgreSQL
   you can verify using `docker ps`
6. Now for checking if everything setup correctly you can check backend's logs by following command `docker logs -f <container id/name>`
   it would log something given below.
   `[server]: Server is running at http://localhost:3000`
   ` Database connected successfully.`
   this means project setup perfectly.
   <h3 align="center">API Walkthrough</h3>
   <h3>Auth Endpoints ------------------------------------------------</h3> 1)<b> Sign-up</b>
   URL : `http://localhost:3000/auth/sign-up`
   METHOD : POST
   BODY :
   ```JSON
   {
   "email":"admin@gmail.com",
   "password":"123",
   "username":"email",
   "firstName":"admin",
   "lastname":"admin",
   "role":"admin"
   }
   ```

````
RESPONSE :
```JSON
{
  "error": null,
  "hasError": false,
  "value": {
    "id": "9b552e5c-7ae9-4e97-8d59-b7019795640b",
    "firstName": "admin",
    "lastname": "admin",
    "username": "email",
    "email": "admin1@gmail.com",
    "password": "$2b$10$K233sIwOf4NGkxyspIZbQefrHF/bwJDqnmJkfoftNf2c8kwcLwKb6",
    "role": "admin"
  }
}
````

2)<b> Sign-in</b>
URL : `http://localhost:3000/auth/sign-up`
METHOD : POST
BODY :

```JSON
{
"email":"admin@gmail.com",
"password":"123"
}
```

RESPONSE :

```JSON
{
  "hasError": false,
  "error": null,
  "value": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiY2UyOWI3ODYtYWRhYS00NzJhLWEzNDktMTkzMWU1OWU4YmNkIiwiZmlyc3ROYW1lIjoiYWRtaW4iLCJsYXN0bmFtZSI6ImEiLCJ1c2VybmFtZSI6ImVtYWlsIiwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJwYXNzd29yZCI6IiQyYiQxMCRzVVpkdmRrR1FoMnVaY2dsL1ZxaXN1R3dPbUxGRHRnZG5rWnUycVRnWWYuMUt2cWxBaG9KQyIsInJvbGUiOiJhZG1pbiJ9LCJpYXQiOjE3MTI2MzExMTUsImV4cCI6MTcxMjYzNDcxNX0.7eAcJltW9z7t3PtvWptS73GGuP35ID1gJnV5DBqykww",
    "user": {
      "id": "ce29b786-adaa-472a-a349-1931e59e8bcd",
      "firstName": "admin",
      "lastname": "a",
      "username": "email",
      "email": "admin@gmail.com",
      "password": "$2b$10$sUZdvdkGQh2uZcgl/VqisuGwOmLFDtgdnkZu2qTgYf.1KvqlAhoJC",
      "role": "admin"
    }
  }
}
```

<h3>Grocery Endpoints ------------------------------------------------</h3>
	 1)<b> Create Grocery</b>
	 URL : ```http://localhost:3000/grocery/create-grocery```
     METHOD : POST
	 BODY :
```JSON
{
  "name":"grocery-2",
  "price":50,
  "quantity":5
}
```
<b>TOKEN : Give bearer token with admin role.</b>

RESPONSE:

```JSON
{
  "error": null,
  "hasError": false,
  "value": {
    "id": "fe35d6ea-2a9f-4cbe-949c-3b23215cbc24",
    "quantity": 5,
    "price": 50,
    "name": "grocery-2"
  }
}
```

1)<b> Get all Groceries</b>
URL : `http://localhost:3000/grocery`
METHOD : GET
<b>TOKEN : Give bearer token with admin role.</b>
BODY : None
RESPONSE :

```JSON
{
  "hasError": false,
  "error": null,
  "value": [
    {
      "id": "fe35d6ea-2a9f-4cbe-949c-3b23215cbc24",
      "quantity": 5,
      "price": 50,
      "name": "grocery-2"
    }
  ]
}
```

3)<b> Update Grocery</b>
URL : `http://localhost:3000/grocery/fe35d6ea-2a9f-4cbe-949c-3b23215cbc24`
METHOD : PUT
<b>TOKEN : Give bearer token with admin role.</b>
BODY :

```JSON
{
  "name":"grocery-2-changed",
  "price":501,
  "quantity":50
}
```

RESPONSE :

```JSON
{
  "hasError": false,
  "error": null,
  "value": {
    "id": "fe35d6ea-2a9f-4cbe-949c-3b23215cbc24",
    "quantity": 50,
    "price": 501,
    "name": "grocery-2-changed"
  }
}
```

4)<b> Delete Grocery</b>
URL : `http://localhost:3000/grocery/fe35d6ea-2a9f-4cbe-949c-3b23215cbc24`
METHOD : DELETE
<b>TOKEN : Give bearer token with admin role.</b>
BODY : None
RESPONSE:

```JSON
{
  "hasError": false,
  "error": null,
  "value": "Grocery deleted sucessfully."
}
```

<h3>User Endpoints ------------------------------------------------</h3>

1)<b> Get all available Groceries</b>
URL : `http://localhost:3000/user/get-available-groceries`
METHOD : GET
<b>TOKEN : Give bearer token with user/admin role.</b>
BODY : None
RESPONSE :

```JSON
 {
  "hasError": false,
  "error": null,
  "value": [
    {
      "id": "f5826215-6f25-4422-9159-47decfb1b875",
      "quantity": 5,
      "price": 50,
      "name": "grocery-2"
    }
  ]
}
```

<h3>Order Endpoints ------------------------------------------------</h3>

1)<b> Create-Order</b>
URL : `http://localhost:3000/order/create-order/ce29b786-adaa-472a-a349-1931e59e8bcd`
METHOD : POST
BODY :

```JSON
{
"groceries":[
  {
    "id":"grocery-id",
    "quantity":2
  }]
}
```

<b>TOKEN : Give bearer token with user/admin role.</b>

RESPONSE :

```JSON
{
  "hasError": false,
  "error": null,
  "value": {
    "orderId": "ab42447e-3af2-4d21-b4ab-0e4c68d8bc17"
  }
}
```
