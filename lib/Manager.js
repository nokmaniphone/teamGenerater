const Employee = require('./Employee')

class Manager extends Employee{
  constructor(name, id, email, officeNumb) {
    super(name, id, email)
    this.officeNumber = officeNumb
    this.title = 'Manager'
  }
  getOfficeNumber(){
    return this.officeNumber
  }
  getRole(){
    return this.title
  }
}


module.exports = Manager