## What is this?

A simple demo app using [rrweb](https://www.rrweb.io/) and [socket.io](https://socket.io/) to visualize remotely changes to the DOM in real-time.

## How to run this app

This monorepo is composed by `backend` and `frontend` packages.

- Execute the following commands from the root directory to run up this app:

  - `npm install`
  - `npm run be`
  - `npm run fe`

- Open `http://localhost:3000` in many tabs as clients you want.

- Open `http://localhost:3000/sessions` in a separate tab to see the "Active Sessions" screen to visualize real-time updates.
