## Setting up a TS Project
1. Create project folder
    a. `mkdir ts-intro`
2. Initialize npm
    a. `npm init -y`
3. Install Typescript
    a. `npm i --save-dev typescript`
4. Create src folder and index.ts file
    a. `mkdir src && touch src/index.ts`
5. Set  up npm script
    a. open package.json
    b. remove test script
    c. add start script 
        i. `"start": "tsc && node dist/index.js"`
6. Initialize Typescript project
    a. `node_modules/typescript/bin/tsc --init`
7. Edit tsconfig.json
    a. `"rootDir": "./src"`
    b. `"outDir": "./dist"`
8. Edit index.ts and add a `console.log` statement
9. Run `npm start` to see your message and verify there are no errors


## Notes

#### Import and Export
Typescript uses the 'import' and 'export' keywords. Do not use the old 'require' function to bring in modules and instead use 'import'.
This also means you export with the 'export' keyword.

##### Example:

file1.ts
```
import { exportedValue } from './file2';
...
```

file2.ts
```
...
export const exportedValue = 42;
```

#### Interface Name
When naming an interface: Camel case starting with a capital letter
**Example** an interface that is used to create a user might be named `CreateUserPayload`

#### Interface File Name
When naming an interface file: All lowercase with hypens (-) separating words followed by `.interface.ts`
**Example** The interface above would have a file name of `create-user-payload.interface.ts`
