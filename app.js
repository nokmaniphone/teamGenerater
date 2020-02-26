const prompt = require('inquirer').createPromptModule()
const Employee = require('./lib/Employee')
const Engineer = require('./lib/Engineer.js')
const Intern = require('./lib/Intern.js')
const Manager = require('./lib/Manager.js')
const handlebars = require('handlebars')
const fs = require('fs')


//store employees object
let team = []


function capitalize(s) {
  if (typeof s !== 'string') {
    return ''
  }
  return s.charAt(0).toUpperCase() + s.slice(1)
}


const init = function init() {
  console.log('Manager, create your team page.')
  prompt([
    {
      type: 'input',
      name: `name`,
      message: 'What is your name?'
    },
    {
      type: 'number',
      name: 'id',
      message: 'What is your ID?'
    },
    {
      type: 'input',
      name: `email`,
      message: 'What is your Email?'
    },
    {
      type: 'number',
      name: 'officeNumb',
      message: 'What is your office number?'
    },
    {
      type: 'text',
      name: 'numEngineers',
      message: 'How many engineers are there in your team?'
    },
    {
      typle: 'text',
      name: 'numInterns',
      message: 'How many interns are there in your team?'
    }
  ])
    .then(response => {
      team.push(new Manager(capitalize(response.name), response.id, response.email, response.officeNum))

      askEngineerQuestions(response.numEngineers, response.numInterns) 
       
    })
    .catch(e => console.error(e));
 
}

// ask the engineers questions

async function askEngineerQuestions(numEng, numInt){

  for (let i = 0; i < numEng; i++) {
    
    console.log(`Engineer${i + 1}, create your profile:`)
    const waitForEngAnswer = await prompt([
      {
        type: 'input',
        name: 'name',
        message: 'What is your name?'
      },
      {
        type: 'number',
        name: 'id',
        message: 'What is your id?'
      },
      {
        type: 'input',
        name: 'email',
        message: 'What is your email?'
      },
      {
        type: 'input',
        name: 'github',
        message: 'What is your GitHub username?'
      }
    ])
      .then(response => {
        
        team.push(new Engineer(capitalize(response.name), response.id, response.email, response.github))
        if ( i === numEng - 1) {
          askInternQuestions(numInt)
        }

      })
      .catch(e => console.error(e));

  }

}
// ask the interns quetions

async function askInternQuestions(numInt) {
  

  for (let i = 0; i < numInt; i++) {
    console.log(`Intern${i + 1}, create your profile:`)
    const waitForEngAnswer = await prompt([
      {
        type: 'input',
        name: 'name',
        message: 'What is your name?'
      },
      {
        type: 'number',
        name: 'id',
        message: 'What is your id?'
      },
      {
        type: 'input',
        name: 'email',
        message: 'What is your email?'
      },
      {
        type: 'input',
        name: 'school',
        message: 'What is your school name?'
      }
    ])
      .then(response => {
        team.push(new Intern(capitalize(response.name), response.id, response.email, response.school));
      })
      .catch(e => console.error(e));
  }

  createHTML(team)
}

async function createHTML(Array) {
  let cards = '';

  // create card on object type
  const objectChecker = await Array.forEach( (elem) =>{

    if (elem instanceof Manager){
      let text = fs.readFileSync("./templates/manager.html", 'utf8')
      let template = handlebars.compile(text);
      let result = template(elem);
      cards += result;
    }

    if (elem instanceof Engineer) {
      let text = fs.readFileSync("./templates/engineer.html", 'utf8')
      let template = handlebars.compile(text);
      let result = template(elem);
      cards += result;

    }

    if (elem instanceof Intern) {
      let text =fs.readFileSync("./templates/intern.html", 'utf8')
      let template = handlebars.compile(text)
      let result = template(elem)
      cards += result;
    }



  });

  // store cards text object

  let cardObject = {cards}

  let text = fs.readFileSync("./templates/main.html", 'utf8')
  let template = handlebars.compile(text)
  let result = template(cardObject)

  fs.writeFile('./output/myTeam.html', result, e => e ? console.log(e) : console.log('File successfully'))

}


init();
