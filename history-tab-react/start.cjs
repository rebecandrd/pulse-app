process.chdir(__dirname);
process.env.PATH = '/usr/local/bin:' + (process.env.PATH || '');
require('child_process').execSync('./node_modules/.bin/vite --port 5174', { stdio: 'inherit', env: process.env });
