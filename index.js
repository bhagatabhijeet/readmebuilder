// const inquirer = require("inquirer");
const boxen = require('boxen');
const util = require("util");
// const axios = require("axios");
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



api.main();



