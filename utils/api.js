const { default: Axios } = require("axios");
const inquirer = require("inquirer");
const ora = require('ora');
const chalk = require('chalk');

let oraspinner = ora();
oraspinner.color='yellow';
oraspinner.spinner='dots';
oraspinner.indent=5;

const api = {
  githubuser:{},
  getUser(username) {
    return Axios.get(`https://api.github.com/users/${username}`);
  },  
  

};

function checkUser() {
  const getuserPrompt = inquirer.prompt([{
    type: "input",
    message: "Please enter your github username",
    name: 'githubuser',

  }])
    .then(
      async (ans) => {
        console.log(ans.githubuser);
        try {
          oraspinner.start('Getting User details from github');
          const user = await api.getUser(ans.githubuser);

          //the setTimeout is pseudo. This is just to mock the ora spinner
          setTimeout(async () => {
            oraspinner.stop();
            if (user.login !== 'undefined') {
              console.log(chalk.green(`Thank You. The usename:${ans.githubuser} you have entered is a valid user`));
              api.githubuser = user.data;
              // console.log(api.githubuser);
              await getEmail(); 
              console.log(api.githubuser);
            }
            else {
              checkUser();
            }
          }, 3000);

        }
        catch (error) {
          oraspinner.stop();
          console.log();
          console.log(chalk.red("User Not Found!"), chalk.blue("let's try again!"));
          checkUser();
        }
      }
    )
}

async function getEmail() {
  if (api.githubuser.email === null) {
    console.log(chalk.yellow("The user does not have public email address on his github profile."));
  }
  let eml = await inquirer.prompt([
    {
      type: 'input',
      message: 'Please enter the email address to display in ReadMe',
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
  // })
}

module.exports = {api,checkUser,getEmail};
