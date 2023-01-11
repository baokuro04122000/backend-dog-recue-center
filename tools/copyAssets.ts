import * as shell from 'shelljs';


// for deployment, rememeber to create a proper .env file
shell.cp('.env.example', 'dist/');
shell.cp('.env.develop', 'dist/.env');