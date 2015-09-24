
playground-node gives you a fast way of bootstrapping a very basic node code so you can test code quickly. It handles npm modules and Typescript type definitions so you can start coding as fast as possible.
	
It comes with gulp for node reloading and Typescript compiling.   

## Usage

Install Yeoman:
```bash
npm install yo -g
```

Install generator:
```bash
npm install generator-pg-node
```

Run the generator:
```bash
yo pg-node projectName
```

Use gulp to get node reloading and/or Typescript compiling. 
```bash
gulp
```


playground-node will ask you for npm modules or Typescript definitions you want to be installed.