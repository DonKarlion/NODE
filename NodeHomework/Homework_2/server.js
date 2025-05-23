const http = require('http');
const url = require('url');

let questions = {
  1: { id: 1, question: 'Що таке Node.js?', answer: 'Серверна платформа на основі JavaScript' },
  2: { id: 2, question: 'Що таке HTTP?', answer: 'Протокол передачі гіпертексту' }
};
let nextId = 3;

function parseRequestBody(req, callback) {
  let body = '';
  req.on('data', chunk => body += chunk.toString());
  req.on('end', () => {
    try {
      const data = JSON.parse(body);
      callback(null, data);
    } catch (e) {
      callback(e);
    }
  });
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const segments = parsedUrl.pathname.split('/').filter(Boolean);

  res.setHeader('Content-Type', 'application/json');

  if (segments[0] === 'questions') {
    const id = segments[1] ? parseInt(segments[1], 10) : null;

    switch (req.method) {
      case 'GET':
        if (id) {
          if (questions[id]) {
            res.writeHead(200);
            res.end(JSON.stringify(questions[id]));
          } else {
            res.writeHead(404);
            res.end(JSON.stringify({ error: 'Not found' }));
          }
        } else {
          res.writeHead(200);
          res.end(JSON.stringify(Object.values(questions)));
        }
        break;

      case 'POST':
        parseRequestBody(req, (err, data) => {
          if (err) {
            res.writeHead(400);
            res.end(JSON.stringify({ error: 'Invalid JSON' }));
            return;
          }
          const newQuestion = { id: nextId++, ...data };
          questions[newQuestion.id] = newQuestion;
          res.writeHead(201);
          res.end(JSON.stringify(newQuestion));
        });
        break;

      case 'PUT':
        if (!id || !questions[id]) {
          res.writeHead(404);
          res.end(JSON.stringify({ error: 'Not found' }));
          return;
        }
        parseRequestBody(req, (err, data) => {
          if (err) {
            res.writeHead(400);
            res.end(JSON.stringify({ error: 'Invalid JSON' }));
            return;
          }
          questions[id] = { id, ...data };
          res.writeHead(200);
          res.end(JSON.stringify(questions[id]));
        });
        break;

      case 'DELETE':
        if (id && questions[id]) {
          delete questions[id];
          res.writeHead(204);
          res.end();
        } else {
          res.writeHead(404);
          res.end(JSON.stringify({ error: 'Not found' }));
        }
        break;

      default:
        res.writeHead(405);
        res.end(JSON.stringify({ error: 'Method not allowed' }));
        break;
    }
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
