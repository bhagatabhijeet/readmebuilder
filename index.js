const inquirer = require("inquirer");
const boxen = require('boxen');
const util = require("util");
const axios = require("axios");
const ora = require('ora');
const chalk = require('chalk');
const { exitCode } = require("process");
const api = require("./utils/api");
 


process.on('exit', function(code) {
    if(code === 0){
        return;
    }

    const message= `${chalk.yellow('You cancelled the readme generation process.')} ${chalk.blueBright('Thanks for trying ReadMeBuilder. See you again!')}`;  
    return console.log(message);
    
});

//Welcome Screen
console.log(
    boxen(`
                                        ${chalk.blue(chalk.bold(`Welcome to ${chalk.underline('ReadMeBuilder')}`))}
    
    Readme Builder is a general purpose read me generator which builds readme based on your inputs.

    You would now be asked a series of questions.Ready?    
    `, 
    { 
    padding: 2 ,
    borderColor:'magentaBright',
    borderStyle:'round',
    float:'center',  
    
}));

//Developer and Github box
console.log(boxen(
    chalk.cyanBright('Developer: Abhijeet Bhagat  GitHub: https://github.com/bhagatabhijeet/readmebuilder'),{
        padding:1,
        float:'center',
        borderStyle:'round',
        borderColor:'blue'

}));

//Check again if user wants to continue.
let readyPrompt = inquirer
.prompt([{
    type:"confirm",
    message: "Ready?",
    name:'ready',    
}]).then(ans=>{
    if(!ans.ready){       
        process.exit(0);        
    }
    //if user wants to continue then check if the user name is valid.
    api.checkUser();
    // api.getEmail();
    

    



    // while(userfound === false){
   
    // }
    // return inquirer.prompt([{
    //     type:"input",
    //     message: "Please enter your github username",
    //     name:'githubuser',    
    // }])
})
// .then(async (ans)=>{
//     console.log(ans.githubuser);
//     try{
//         const user = await api.getUser(ans.githubuser);
//         console.log(user);
//     }
//     catch(error){
//         console.log("User Not Found!");
//         process.exit(1);
//     }
// })
.catch(error=>{
    console.log(error);
});

// let githubUserName = inquirer
// .prompt([{
//     type:"input",
//     message: "Please enter your github username",
//     name:'githubuser',    
// }]).then((ans=>{
//     const user = api.getUser(ans.gihubuser);
//     console.log(user);

// }));



// const { Octokit } = require("@octokit/rest");
// const octokit = new Octokit();
// async function getUser(){

//     const follows = await octokit.users.listEmailsForAuthenticated();
//     // {
//     //     username:"bhagatabhijeet"

//     //   });
//       console.log("got it");
//       console.log(follows);

// }

// getUser();
// const generate = require('./utils/generateMarkdown')
// const app = require('./app');

// console.log(boxen('Abhijeet Bhagat', { padding: 1 }));
// console.log(generate({ title: "Abhijeet Bhagat" }));
// console.log(app());

// // let asyncprompt = util.promisify(inquirer.prompt);

//     let q = inquirer
//         .prompt(
//             [
//                 {
//                     type: 'input',
//                     message: '👤  Author name',
//                     name: 'authorName'
//                 }
//             ]
//         );
//     // axios
//     //     .get(`https://api.github.com/users/${q.authorName}`)///repos?per_page=100
//     //     .then(function (res) {
//     //         console.log(res);
//     //     });
//     }

//     askQuestions();
//const spin = ora("hello");
// const spinner=ora({
//     type:'dots',
//     text:'author name',
//     spinner:"bouncingBall"
// });

const spinnerOptions = {
    text: 'hello world',
    spinner: "dots",

}
// setTimeout(() => {
// 	spinner.color = 'yellow';
// 	spinner.text = 'Loading rainbows';
// }, 1000);

// inquirer
// .prompt(
//     [
//         {
//             type: "password",
//             message: spinner.start(),
//             name: 'pass'
//         }
//     ]
//     ).then(q=>console.log(q));

// console.log(ora(spinnerOptions).start("ABC"));


// const mySpinner =  ora().start();

// mySpinner.start();

// Update
// setTimeout(() => {
//     mySpinner.color = 'yellow';
//     mySpinner.text = 'Killing all the undead unicorns';
//     mySpinner.indent=4;
//     mySpinner.spinner="circle";
//     mySpinner.frames= ['-', '+', '-'];
// }, 1000);