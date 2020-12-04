Follow steps to acess the assignment.

1. clone the repository.

2.open cmd and run "npm install"

3. run "./init_replica.sh"

4. run "mongo"

5. run line by line script written in init_replica_part2.txt in mongo client

6. run "node index.js"

7. Start making Api calls using postmaster or curl requests.

  example :
    1. curl request for API 1 to get status 
       curl -X POST http://localhost:3000/
    
    2. curl request for API 2 to get incomplete Haiku
       curl -X GET http://localhost:3000/incomplete
    
    3.curl request for API 3 to update a Haiku
      curl -d '{"objectId" : "5fca4e96fd6d4625a4caeb25", "newHaiku" : "X Little Monkey", "newIsCompleted" : true}' -H "Content-Type: application/json" -X POST http://localhost:3000/writeon
