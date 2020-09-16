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

let oraspinner = ora();
oraspinner.color = 'yellow';
oraspinner.spinner = 'dots';
oraspinner.indent = 5;

let readMeContent;

// const readme={
//   projectTitle:"",
//   description:"",
//   installation:"",
//   usage:"",
//   license:"",
//   contributing:"",
//   tests:"",
//   displayProfilePic:true,
//   displayEmail:true

// };
const api = {
  githubuser: {},
  getUser(userName) {
    return Axios.get(`https://api.github.com/users/${userName}`);
  },
  getRepo(userName, repoName) {
    return Axios.get(`https://api.github.com/users/${userName}/repos`);
  }

};

async function checkUser() {
  const getuserPrompt = await inquirer.prompt([{
    type: "input",
    message: "Please enter your github username : ",
    name: 'githubuser',

  }])
  console.log(getuserPrompt.githubuser);
  try {
    oraspinner.start('Getting User details from github');
    const user = await api.getUser(getuserPrompt.githubuser);
    const validUser = await isValidUser(user);
    if (validUser) {
      console.log(chalk.green(`Thank You. The usename:${getuserPrompt.githubuser} you have entered is a valid user`));
      api.githubuser = user.data;
    }
    else {
      console.log();
      console.log(chalk.red("User Not Found!"), chalk.blue("let's try again!"));
      checkUser();
    }
  }
  catch (err) {
    oraspinner.stop();
    console.log(err);
    console.log(chalk.red("Something went wrong!"), chalk.blue("let's try again!"));
    checkUser();
  }
}

function isValidUser(user) {

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (user.login !== 'undefined') {
        oraspinner.stop();
        resolve(true);
      }
      else {
        oraspinner.stop();
        reject(false);
      }
    }, 2000);
  });
}

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
  // .then((eml) => {
  if (eml.email === 'Press Enter to skip.') {
    eml.email = '';
  }
  else {
    api.githubuser.email = eml.email;
  }
}

async function checkRepo() {
  const getRepo = await inquirer.prompt([{
    type: "input",
    message: "Please enter your github repo name : ",
    name: 'githubrepo',

  }])

  try {
    oraspinner.start('Getting repo details from github');
    let repos = await api.getRepo(api.githubuser.login, getRepo.githubrepo);
   

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
    console.log(err);
    console.log(chalk.red("Something went wrong!"), chalk.blue("let's try again!"));
    await checkRepo();
  }


}

function isValidRepo(repos, repoName) {
  return new Promise((resolve, reject) => {
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
  

  readMeContent = await inquirer.prompt([    
      {
        type: "input",
        name: "title",
        message: `What is the title of your project : `,
        default:api.githubuser.repo.name
      },
      {
        type: "input",
        name: "description",
        message: "Provide the description for your ReadMe : ",
      },
      {
        type: "input",
        name: "installation",
        message: "How to install your application : ",
      },
      {
        type: "input",
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
        type: "input",
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
  let readmePath = path.join(".","output","ReadMe.md");
  await writeFileAsync(readmePath,markdown);
  // console.log(readMeContent);
  

  // console.log(api.githubuser)
}

module.exports = { main,api,readMeContent };
