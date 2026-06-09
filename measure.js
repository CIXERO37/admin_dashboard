const fs = require('fs');
const path = require('path');
const http = require('http');

const dashboardPath = path.join(__dirname, 'src', 'app', '(dashboard)');
const routes = fs.readdirSync(dashboardPath, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

async function measurePage(route) {
  return new Promise((resolve) => {
    const url = `http://localhost:3000/${route}`;
    const start = process.hrtime();
    
    http.get(url, (res) => {
      const end = process.hrtime(start);
      const timeInMs = (end[0] * 1000) + (end[1] / 1000000);
      
      // consume response to free memory
      res.on('data', () => {});
      res.on('end', () => {
        resolve({ route, status: res.statusCode, time: timeInMs.toFixed(2) });
      });
    }).on('error', (err) => {
      resolve({ route, status: 'error', error: err.message, time: 0 });
    });
  });
}

async function run() {
  console.log('Starting page load measurements...');
  const results = [];
  
  // Warmup run
  console.log('Warming up server...');
  await measurePage('dashboard');
  
  for (const route of routes) {
    const res = await measurePage(route);
    console.log(`[${res.status}] /${route} : ${res.time} ms`);
    results.push(res);
  }
  
  fs.writeFileSync('performance_results.json', JSON.stringify(results, null, 2));
  console.log('Done!');
}

run();
