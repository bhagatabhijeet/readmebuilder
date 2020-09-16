
function generateMarkdown(user,content) {
  let markdown = `
  # ${content.title}
 [![${content.license} license](https://img.shields.io/badge/license-${content.license}-blue.svg)](https://github.com/${user.login}/${content.title})
 [![GitHub forks](https://img.shields.io/github/forks/${user.login}/${user.repo.name})](https://github.com/${user.login}/${user.repo.name}/network)
 [![GitHub stars](https://img.shields.io/github/stars/${user.login}/${user.repo.name})](https://github.com/${user.login}/${user.repo.name}/stargazers)
 
 
 ## Table of Contents
- [Description](#description)
- [Installation](#installation)
- [Usage](#usage)
- [License](#license)
- [Contributing](#contributing)
- [Tests](#tests) 
- [Questions](#questions)

## Description
${content.description} 
  
## Installation
To install dependencies, run the following command: ${content.installation}

## Usage
Requirements to use this project: ${content.usage}

## License
This project is licensed under the ${content.license} license

## Contributing
To contribute to this project ${content.contributing}

## Tests
To run a test use the following command: 
<code>${content.tests}</code>

## Questions

`;
if(content.displayEmail){
  if(user.email){
    markdown = markdown +
    `If you have any questions you can contact me direct at <${user.email}>.
    Reach out to me at GitHub : [${user.login}](https://github.com/${user.login})
    `
  }
  else{
    markdown = markdown + 
    `Reach out to me at GitHub : [${user.login}](https://github.com/${user.login})`
  }
}
else{
  markdown = markdown + 
  `Reach out to me at GitHub : [${user.login}](https://github.com/${user.login})`
}

if(content.displayPic){
  markdown = markdown + "<br/>" + 
  `![Profile Picture](${user.avatar_url})<br/>
  [![GitHub followers](https://img.shields.io/github/followers/${user.login}.svg?style=social&label=Follow)](https://github.com/${user.login})`
}

return markdown;


}

module.exports = generateMarkdown;
