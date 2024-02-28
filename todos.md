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

- [x] - how to handle errors. Error Boundary? Error page?
  - see [solid-router issue](https://github.com/solidjs/solid-router/issues/374)
  - seems to be working with router 0.12.4 and start 0.5.10
- [x] - not found page
- [x] - default Suspense loading component for authorizers and router

## Buggish

- [ ] - browser back button use case. After we log out, we can still go back to previous Management page. We need to let solid-router know that this page should ALWAYS validate
  - see [point 4](https://github.com/solidjs/solid-router?tab=readme-ov-file#cache)
  - maybe we can create an effect to refetch based on client-side data like existing of cookie. 


## Logging

- [x] - how to handle browser/server
  - looks like pino will use console in browser
- [x] - add a true logger (pino/winston)


## UI

- [ ] - cleanup loading states in all pages
- [ ] - style login links and buttons 
- [ ] - FB graph api not returning profile picture, has the API changed or do we need a particular version?

## Server-sent events

- [ ] - create a test route with query param. Eventually we'll authorize connection
- [ ] - need to create some sort of channel or event bus tracking which URL to emit to
