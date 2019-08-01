# legit-api

An API to interact with the database for legit-app, a medium copy for learning purpose

To run project:

1. Install dependencies via npm.
2. Run `docker-compose build` to build the docker container. This is (usually) only necessary the first time you run the project.
3. Run `docker-compose up`. The web server and database instances will be created.
4. Now you can interact with the API locally.
5. To test the API without creating requests manually, go to localhost:4000/graphiql to investigate
