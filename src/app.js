const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateReposirotyId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: 'Invalid reposiroty ID' });
  }

  return next();
}

app.get("/repositories", (request, response) => {

  return response.json(repositories);

});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  }

  repositories.push(repository);

  return response.json(repository);

});

app.put("/repositories/:id", validateReposirotyId, (request, response) => {
  const { id } = request.params;
  const {title, url, techs } = request.body;

  const repoIndex = repositories.findIndex( repository => repository.id === id);

  if (repoIndex < 0) {
    return res.status(400).json({ error: 'Repository not found.' });
  }

  const { likes } = repositories.find( repository => repository.id === id);

  const reposiroty = {
    id, 
    title,
    url,
    techs,
    likes,
  };

  repositories[repoIndex] = reposiroty;

  return response.json(reposiroty);

});

app.delete("/repositories/:id", validateReposirotyId, (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex( repository => repository.id === id);

  repositories.splice(repoIndex, 1);
  
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex(repository => repository.id === id);

  if(repoIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.' });
  }

  const reposiroty = { ...repositories[repoIndex], likes: repositories[repoIndex].likes + 1 };

  repositories[repoIndex] = reposiroty;

  return response.json(reposiroty);

}); 

module.exports = app;
