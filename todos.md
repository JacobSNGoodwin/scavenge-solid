# Todos

## Authorization and User Management

- [x] - add arctic for handling Oauth with FB and Google
- [x] - how to handle connections with the same email?
  - added a `connections` column with json type to table 
- [x] - add callback handle page to verify user
- [x] - create user in table and add connection after verify (which is per provider)
- [x] - why am I getting Cannot Set Headers after they are sent to the client?
  - [x] - I think we need `deferStream` so we can set the response headers
- [x] - add middleware to check user per request
  - [x] - maybe create a connections table with id, user_id, connection, connection_id
- [x] - maybe move authorize and verify functions to ~~`auth`~~ `API` folder
- I ended up moving them to the `API` folder because we are handling request/response data. This raises a question about the prudence of the auth/middleware.ts location.
- [x] - create a `requireUser` function for pages which checks middleware data
- [x] - add logout function - add test action/button on manage page

## Error Handling

- [ ] - how to handle errors. Error Boundary? Error page?
  - see [solid-router issue](https://github.com/solidjs/solid-router/issues/374)
- [ ] - not found page
- [ ] - default Suspense loading component for authorizers and router


## Logging

- [ ] - how to handle browser/server
- [ ] - add a true logger (pinia/winston)


## UI

- [ ] - style login links and buttons 
