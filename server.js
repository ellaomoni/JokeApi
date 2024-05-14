const http = require('http');
const url = require('url');

// Database
let db = [
    { id: 1, title: "Funny Joke 1", comedian: "Comedian 1", year: 2020 },
    { id: 2, title: "Hilarious Joke 2", comedian: "Comedian 2", year: 2019 }
];

const server = http.createServer((req, res) => {
    const reqUrl = url.parse(req.url, true);
    const { pathname, query } = reqUrl;

    // Handle POST request to add a joke
    if (req.method === 'POST' && pathname === '/jokes') {
        let data = '';
        req.on('data', chunk => {
            data += chunk;
        });
        req.on('end', () => {
            const { title, comedian, year } = JSON.parse(data);
            const id = db.length + 1;
            const newJoke = { id, title, comedian, year };
            db.push(newJoke);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(db)); // Return the updated joke database
        });
    }
    // Handle GET request to get all jokes
    else if (req.method === 'GET' && pathname === '/jokes') {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(db)); // Return all jokes in the database
    }
    // Handle PATCH request to update a joke by id
    else if (req.method === 'PATCH' && pathname.startsWith('/jokes/')) {
        const id = parseInt(pathname.split('/')[2]);
        let data = '';
        req.on('data', chunk => {
            data += chunk;
        });
        req.on('end', () => {
            const { title, comedian, year } = JSON.parse(data);
            const jokeIndex = db.findIndex(joke => joke.id === id);
            if (jokeIndex !== -1) {
                db[jokeIndex] = { ...db[jokeIndex], title, comedian, year };
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(db[jokeIndex]));
            } else {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Joke not found');
            }
        });
    }
    // Handle DELETE request to delete a joke by id
    else if (req.method === 'DELETE' && pathname.startsWith('/jokes/')) {
        const id = parseInt(pathname.split('/')[2]);
        const deletedJokeIndex = db.findIndex(joke => joke.id === id);
        if (deletedJokeIndex !== -1) {
            const deletedJoke = db.splice(deletedJokeIndex, 1)[0];
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(deletedJoke));
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Joke not found');
        }
    }
    // Handle invalid requests
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }
});

const PORT = 7000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
