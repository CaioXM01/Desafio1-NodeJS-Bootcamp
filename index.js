const express = require('express');

const server = express();

server.use(express.json());


const projects = [];
let contRequests = 0;


//middleware global
server.use((req, res, next) => {
  contRequests++;
  console.log(`Quantidade de requisições feitas: ${contRequests}`);

  next();
})

//middleware local
function checkProjectsInArray(req, res, next) {
  const project = projects[req.params.id];
  if(!project) {
    return res.status(400).json({ error: 'Project does not exists' });
  }

  return next();
}

//Criar projeto
server.post('/projects', (req, res) => {
  const project = {
    id: req.body.id,
    title: req.body.title,
    tasks: []
  }

  projects.push(project);
  
  return res.json(projects);
})

//listar todos os projetos
server.get('/projects', (req, res) =>{
  return res.json(projects);
})

//editar titulo do projeto
server.put('/projects/:id', checkProjectsInArray, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  projects[id].title = title;

  return res.json(projects[id]);
})

//deletar projeto
server.delete('/projects/:id', checkProjectsInArray, (req, res) =>{
  const { id } = req.params;

  projects.splice(id, 1);

  return res.send();
})

//adicionar tarefas ao projeto
server.post('/projects/:id/tasks', checkProjectsInArray, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  projects[id].tasks.push(title);

  return res.json(projects[id]);
})



server.listen(3333);