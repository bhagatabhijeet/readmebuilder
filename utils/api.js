const { default: Axios } = require("axios");
const inquirer = require("inquirer");
const ora = require('ora');
const chalk = require('chalk');
const { promise } = require("ora");
const markdownGenerator = require("./generateMarkdown");
const fs = require("fs");
const util = require('util');
const writeFileAsync = util.promisify(fs.writeFile);
const path = require('path');
const boxen = require('boxen');

let oraspinner = ora();
oraspinner.color = 'yellow';
oraspinner.spinner = 'dots';
oraspinner.indent = 5;

// This variable will hold the readme contents
let readMeContent;

// api calls getUser and getRepo
// The githubuser object will hold the user profile
const api = {
  githubuser: {},
  getUser(userName) {
    return Axios.get(`https://api.github.com/users/${userName}`);
  },
  getRepo(userName, repoName) {
    return Axios.get(`https://api.github.com/users/${userName}/repos`);
  }
};

// function to get username as input
async function checkUser() {
  const getuserPrompt = await inquirer.prompt([{
    type: "input",
    message: "Please enter your github username : ",
    name: 'githubuser',

  }])
  
  try {
    oraspinner.start('Getting User details from github');
    const user = await api.getUser(getuserPrompt.githubuser);

    // isValidUser is to check if the user is valid. 
    const validUser = await isValidUser(user);
    if (validUser) {
      console.log(chalk.green(`Thank You. The usename:${getuserPrompt.githubuser} you have entered is a valid user`));
      api.githubuser = user.data;
    }
    else {
      console.log();
      console.log(chalk.red("User Not Found!"), chalk.blue("let's try again!"));
      await checkUser();
    }
  }
  catch (err) {
    oraspinner.stop();
    // console.log(err); //COMMENTED SO THAT IT CAN BE USED WHEN DEBUGGING    
    console.log(chalk.red("User Not Found!"), chalk.blue("let's try again!"));
    await checkUser();
  }
}

// Function to check if user is valid
function isValidUser(user) {
  
  // The setTimeouts add no functionality. I am just trying go give ora spinner animation feel to the end user
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (user.login !== 'undefined') {
        oraspinner.stop();
        resolve(true);
      }
      else {
        oraspinner.stop();
        resolve(false);
      }
    }, 2000);
  });
}

// Function to getemail as input from the user
async function getEmail() {
  if (api.githubuser.email === null) {
    console.log(chalk.yellow("The user does not have public email address on his github profile."));
  }
  let eml = await inquirer.prompt([
    {
      type: 'input',
      message: 'Please enter the email address to display in ReadMe : ',
      default: 'Press Enter to skip.',
      name: 'email'
    }
  ])
  
  if (eml.email === 'Press Enter to skip.') {
    eml.email = '';
  }
  else {
    api.githubuser.email = eml.email;
  }
}

// Function to getRepo name from user
async function checkRepo() {
  const getRepo = await inquirer.prompt([{
    type: "input",
    message: "Please enter your github repo name : ",
    name: 'githubrepo',

  }])

  try {
    oraspinner.start('Getting repo details from github');
    let repos = await api.getRepo(api.githubuser.login, getRepo.githubrepo);
   
    // isValidRepo checks if the reponame provided by user is valid
    const validRepo = await isValidRepo(repos.data, getRepo.githubrepo);
    if (validRepo) {
      console.log(chalk.green(`Thank You. The repo:${getRepo.githubrepo} is a valid`));
    }
    else {
      console.log();
      console.log(chalk.red("Invalid repo!"), chalk.blue("let's try again!"));
      await checkRepo();
    }
  }
  catch (err) {
    oraspinner.stop();
    
    console.log(chalk.red("Something went wrong!"), chalk.blue("let's try again!"));
    await checkRepo();
  }


}

// Function to check if the repo is valid
function isValidRepo(repos, repoName) {
  return new Promise((resolve, reject) => {

    // The setTimeouts add no functionality. I am just trying go give ora spinner animation feel to the end user
    setTimeout(() => {      
      const filteredRepo = repos.filter(repo => repo.name.toUpperCase() == repoName.toUpperCase());
      if (filteredRepo.length === 1) {        
        oraspinner.stop();
        api.githubuser.repo = filteredRepo[0];
        resolve(true);
      }
      else {
        oraspinner.stop();
        resolve(false);
      }
    }, 2000);
  });
}

// main funtion. This async function does all the action
async function main() {

  // Check if user wants to continue
  const readyPrompt = await inquirer
    .prompt([{
      type: "confirm",
      message: "Please make sure you've read the documentation.Ready?",
      name: 'ready',
      default:true
    }]);

  // If !continue then exit
  if (!readyPrompt.ready) {
    process.exit(1);
  }

  // Get github user name from user, and check if it's valid
  await checkUser();

  // Check if user has public email on his profile. If no public email found then ask user
  await getEmail();

  // Get and Check if repo is valid
  await checkRepo();
  
  // Get other inputs from the end user
  readMeContent = await inquirer.prompt([    
      {
        type: "input",
        name: "title",
        message: `What is the title of your project : `,
        default:api.githubuser.repo.name
      },
      {
        type: "editor",
        name: "description",
        message: "Provide the description for your ReadMe : ",
      },
      {
        type: "editor",
        name: "installation",
        message: "How to install your application : ",
      },
      {
        type: "editor",
        name: "usage",
        message: "How to use your application : ",
      },
      {
        type:"list",
        name: "license",
        message:"Select a license : ",
        choices:['MIT','Apache','GPL','Affero GPL',
        'Artistic License 2.0','BSD 3-Clause License','BSD 2-Clause license',
        'Eclipse Public License v1.0','GPL v3','LGPL v2.1','LGPL v3',
        'Mozilla Public License Version 2.0','Public Domain (Unlicense)'],
        default:0
      },      
      {
        type: "editor",
        name: "contributing",
        message: "How to contribute to your project : ",
      },
      {
        type: "input",
        name: "tests",
        message: "How to to run your tests in the project : ",
      },
      {
        type: "confirm",
        name: "displayEmail",
        message: "Display email in ReadMe : ",
        default:true
      },
      {
        type: "confirm",
        name: "displayPic",
        message: "Display profile picture in ReadMe : ",
        default:true
      }
    ]
  );
  
  let markdown = markdownGenerator(api.githubuser,readMeContent)

  // Note: - ReadMe file is prefixed with the title provided by user. This is to avoid overwriting ReadMes
  // So that user can generate multiple readmes in the output directory
  let readmePath = path.join(".","output",readMeContent.title +"ReadMe.md");


  oraspinner.start("Generating Reame...")
  setTimeout(async () => {
    try{

      await writeFileAsync(readmePath,markdown);
      oraspinner.stop();
      console.log();

      // Final box giving the path to read me
      console.log(
        boxen(`
        ${chalk.blue('Thank You! for using ReadMeBuilder.')}        
        ReadMe.md is now ready. Please find the file at ${path.resolve(readmePath)}
        `          
        , 
        { 
        padding: 1 ,
        borderColor:'cyan',
        borderStyle:'single',
        float:'center',  
        
    }));
    
    }
    catch{err}{
      oraspinner.stop();
    }
    
  }, 2000);
 
}

module.exports = { main,api,readMeContent };
