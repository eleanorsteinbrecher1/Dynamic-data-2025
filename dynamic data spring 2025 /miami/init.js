//arrays 
let numbers = [10,12,13,14,13,56]

//array of words
let names =[" elli","hank","lissa","frank"]

//acess values of an array
console.log(names[1])

names.forEach ((value , index)=> {

//inside item
console.log(value,index)
if(value == "lissa"){
    console.log("found lissa in position"+ index)
}

}  )
//javascript object 
let person = {
    firstName: "Elli", //person.firstName 
    lastName: "S",
    occupation: "student",
    email: "email@gmail.com",
    getName() {  
        console.log("My Name is" + this.firstName)
    }
};
//Json
console.log(person.firstName)
//json does not store functions. Only key values 
let data = {
    brand: {
        name: "Miami Travel Site", // data.brand.name
        link: "/",
        img: "/images/logo.png" 
    },
    links: [ 
        {
            text: "Home",
            href: "/"
        },
        {
            text: "Aeaches",
            href: "/beaches"
        },
        {
            text: "About",
            href: "/about"
        },


    ]
};