const { exec } = require('child_process');
const path = require('path');

function createVueProjectWithEcho(projectName, targetDir) {
    const fullPath = path.resolve(targetDir, projectName);
    console.log(`Creating Vue 3 project at: ${fullPath}`);

    // Define the command to create the project with npx
    const createVueCommand = `vue create ${projectName}`;

    // Define the simulated responses (in order) to each prompt
    const responses = [
        'yes'
    ];

    const process = exec(createVueCommand, { cwd: targetDir }, (error, stdout, stderr) => {
        if (error) {
            console.error('An error occurred:', error.message);
            return;
        }
        if (stderr) {
            console.error('stderr:', stderr);
        }
        console.log(stdout);
        console.log('Project created successfully!');
    });

    // Simulate user input by piping responses into the process
    let index = 0;
    process.stdout.on('data', (data) => {
        console.log(data.toString()); // Log output from the create-vue command

        if (index < responses.length) {
            const response = responses[index];
            console.log(`Sending response: ${response}`); // Log the response being sent
            process.stdin.write(`${response}\n`); // Send the response to stdin
            index++;
        }
    });

    process.stdout.on('end', () => {
        console.log('All prompts answered. Proceeding with installation...');
    });
}

// Define project name and target directory
const projectName = 'my-vue3-app'; // Replace with your desired project name
const targetDir = './output'; // Replace with your desired target directory

// Run the function
createVueProjectWithEcho(projectName, targetDir);









// const { exec } = require("child_process");
// const fs = require("fs");
// const path = require("path");

// // Utility function to run shell commands sequentially
// function runCommand(command, options = {}) {
//     return new Promise((resolve, reject) => {
//         const process = exec(command, options, (error, stdout, stderr) => {
//             if (error) {
//                 console.error(`Error executing command: ${command}`);
//                 reject(error);
//                 return;
//             }
//             if (stderr) console.error(stderr);
//             resolve(stdout);
//         });

//         process.stdout.on("data", (data) => console.log(data.toString()));
//         process.stderr.on("data", (data) => console.error(data.toString()));
//     });
// }

// // Function to create a default Vue project
// async function createDefaultVueProject(projectName, targetDir) {
//     const fullPath = path.resolve(targetDir, projectName);

//     console.log(`Creating default Vue 3 project at: ${fullPath}`);
//     const createVueCommand = `npx create-vue@latest ${projectName} --default`;

//     try {
//         await runCommand(createVueCommand, { cwd: targetDir });
//         console.log("Default project created. Now modifying settings...");
//         await modifyProject(fullPath);
//         console.log("All modifications complete!");
//     } catch (error) {
//         console.error("An error occurred:", error.message);
//     }
// }

// // Function to modify the Vue project
// async function modifyProject(projectPath) {
//     try {
//         // Install Vue Router
//         console.log("Installing Vue Router...");
//         await runCommand(`npm install vue-router@4`, { cwd: projectPath });
//         console.log("Vue Router installed. Adding router files...");
//         const routerPath = path.join(projectPath, "src", "router");
//         fs.mkdirSync(routerPath, { recursive: true });
//         const routerFileContent = `
// import { createRouter, createWebHistory } from 'vue-router';

// const routes = [
//     {
//         path: '/',
//         name: 'Home',
//         component: () => import('../views/HomeView.vue'),
//     },
// ];

// const router = createRouter({
//     history: createWebHistory(),
//     routes,
// });

// export default router;
//         `;
//         fs.writeFileSync(path.join(routerPath, "index.js"), routerFileContent);

//         // Update main.js to use the router
//         const mainFile = path.join(projectPath, "src", "main.js");
//         let mainContent = fs.readFileSync(mainFile, "utf-8");
//         mainContent = mainContent.replace(
//             "createApp(App)",
//             "createApp(App).use(router)"
//         );
//         fs.writeFileSync(mainFile, mainContent);

//         // Install SCSS preprocessor
//         console.log("Installing SCSS preprocessor...");
//         await runCommand(`npm install -D sass`, { cwd: projectPath });
//         console.log("SCSS preprocessor installed.");

//         // Modify ESLint rules
//         console.log("Modifying ESLint configuration...");
//         const eslintConfigPath = path.join(projectPath, ".eslintrc.cjs");
//         if (fs.existsSync(eslintConfigPath)) {
//             let eslintConfig = fs.readFileSync(eslintConfigPath, "utf-8");
//             eslintConfig = eslintConfig.replace(
//                 `"rules": {`,
//                 `"rules": {\n    "indent": ["error", 4],`
//             );
//             fs.writeFileSync(eslintConfigPath, eslintConfig, "utf-8");
//             console.log("ESLint rules updated.");
//         } else {
//             console.log("ESLint configuration file not found. Skipping.");
//         }

//         console.log("Project successfully modified!");
//     } catch (error) {
//         console.error("An error occurred during modifications:", error.message);
//     }
// }

// // Define project name and target directory
// const projectName = "my-modified-proj"; // Replace with your desired project name
// const targetDir = "./output"; // Replace with your desired target directory

// // Run the function
// createDefaultVueProject(projectName, targetDir);