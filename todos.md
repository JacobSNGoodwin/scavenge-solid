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

- [x] - browser back button use case. After we log out, we can still go back to previous Management page. We need to let solid-router know that this page should ALWAYS validate
  - see [point 4](https://github.com/solidjs/solid-router?tab=readme-ov-file#cache)
  - maybe we can create an effect to refetch based on client-side data like existing of cookie. 
  - solution for now to add `onMount` check for user. This requires user fetched from client


## Logging

- [x] - how to handle browser/server
  - looks like pino will use console in browser
- [x] - add a true logger (pino/winston)


## UI

- [x] - cleanup loading states in all pages
- [x] - style login links and buttons 
- [x] - FB graph api not returning profile picture, has the API changed or do we need a particular version?
  - I have no idea why their graph API sucks. But I added code to hide broken images

## Scavenger Hunt Form
- [x] - handle client-side validation
- [x] - create middleware for intentional delay
- [x] - server-side validation
- [x] - create validator function to return normalized error strings per field which can be run on client and server
- [x] - do we handle in same action? Should we client-side validate?
- [ ] - form to update hunts
  - [ ] - and button to go from display to update of title and description

## New Hunt Items
- [ ] - add table
- [ ] - Zod validation schema
- [ ] - add UI in Hunt page

## Server-sent events

- [x] - create a test route with query param. Eventually we'll authorize connection
  - we can authorize connection with already created event locals
- [x] - will probably poll db every minute or so for updates
- [x] - need to create some sort of channel or event bus tracking which URL to emit to
  - for now, it could be a record with key of the game/hunt mapped to list of event streams
- useful docs
  - [creating list of clients](https://digitalocean.com/community/tutorials/nodejs-server-sent-events-build-realtime-app#step-1-building-the-sse-express-backend)
