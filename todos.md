## Todos

- [x] - add arctic for handling Oauth with FB and Google
- [x] - how to handle connections with the same email?
  - added a `connections` column with json type to table 
- [x] - add callback handle page to verify user
- [x] - create user in table and add connection after verify (which is per provider)
- [ ] - add middleware to check user per request
  - [x] - maybe create a connections table with id, user_id, connection, connection_id
- [ ] - maybe move authorize and verify functions to `auth` folder


- [ ] - how to handle errors. Error Boundary? Error page?
  - see [solid-router issue](https://github.com/solidjs/solid-router/issues/374)
- [ ] - not found page
- [ ] - default Suspense loading component for authorizers and router

- [ ] - add a true logger (pinia/winston)
