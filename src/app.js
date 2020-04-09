const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4")

const app = express();

function checkIsUuid(request, response, next) {
  const { id } = request.params;


  if (!isUuid(id)) {
    return response.status(400).json({ error: 'These ID is not valid.' })
  }

  return next();
}

app.use(express.json());
app.use(cors());

app.use('/repositories/:id', checkIsUuid);

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  if (!title | !url | !techs) {
    return response.status(400).json({ error: 'All fields are required.' })
  }

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

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository not found" });
  }

  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositoryIndex].likes
  }

  repositories[repositoryIndex] = repository;

  return response.json(repositories[repositoryIndex]);
});

app.delete("/repositories/:id", (req, res) => {
  const { id } = req.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository not found" });
  };

  repositories.splice(repositoryIndex, 1);

  return res.status(204).send();
});

app.post("/repositories/:id/like", checkIsUuid, (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository not found" });
  };

  repositories[repositoryIndex].likes++;

  return response.json(repositories[repositoryIndex])
});

module.exports = app;