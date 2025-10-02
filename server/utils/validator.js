const validator  = require('validator')
const validate = (data)=>{

    const mandatory = ["name","email_id","password"];
    const isAllowed = mandatory.every((k)=>Object.keys(data).includes(k));

    if(!isAllowed)
    {
        throw new Error("Field Missing");
    }
    const isEmail = validator.isEmail(data.email_id)
    if(!isEmail)
    {
        throw new Error("Emails is invalid");
    }
    if(!validator.isStrongPassword(data.password))
    {
        throw new Error("Weak Password");
    }
}

module.exports = validate;