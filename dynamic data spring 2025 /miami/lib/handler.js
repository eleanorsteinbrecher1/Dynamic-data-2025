const fs = require("fs");
let eList = require("../data/emails.json"); // Load email list from JSON file

exports.newsletterSignup = (req, res) => {
    res.render("newsletter-signup", { csrf: "supersecret" });
};

exports.newsletterSignupProcess = (req, res) => {
    console.log(req.body);

    // Add the new email to the list
    eList.users.push(req.body);

    // Convert the object into a JSON string
    var json = JSON.stringify(eList, null, 2);

    console.log(json); // Log the JSON string

    // Write updated JSON back to the file synchronously
    fs.writeFileSync("./data/emails.json", json, "utf8");

    // Redirect to the thank you page after saving
    res.redirect(303, "/newsletter/thankyou");
};

exports.newsletterSignupList = (req, res) => {
    console.log(eList);
    res.render("userspage", { users: eList.users });
};

exports.newsletterUser = (req,res) => {
    console.log(eList)
    var userDetails = eList.users.filter((user)=>{
        return user.email == req.params.email
     })
 
     console.log(userDetails)
    res.render('userdetails',{"users": userDetails})
 }
 exports.newsletterUserDelete = (req, res) => {
    newList.users = eList.users.filter((user) => {
        return user.email != req.params.email;
    });

    console.log("deleting: " + req.params.email);

    var json = JSON.stringify(newList);

    console.log(json);

    fs.writeFile('./data/emails.json', json, 'utf8', () => {});

    res.send('<a href="/newsletter/list">Go Back</a>');
};
