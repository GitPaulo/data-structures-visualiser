const root   = require(`app-root-path`);
const path   = require('path');
const jQuery = require("jquery");
const DIV_ID = "navbar";

jQuery( "#"+DIV_ID ).load(path.join(root.path, 'views/shared/navigation.html'), function(html, err) {
    if ( err === "error" ){
        console.log("Error with loading navigation file!");
        return;
    }

    // Set navbar title
    let name = __dirname.substring(__dirname.lastIndexOf("\\")+1);
    name     = name.replace(/^\w/, c => c.toUpperCase())

    document.getElementById("navbar_title_path").innerHTML = `Algorithm Visualiser &#8594; ${name}`;

    var navbar = document.getElementById("navbar");

    // Get the offset position of the navbar
    var sticky = 0;

    window.onscroll = () => {
        if (window.pageYOffset >= sticky) {
            navbar.classList.add("sticky");
        } else {
            navbar.classList.remove("sticky");
        }
    };

    let elements = document.getElementsByTagName("home-button");
    // make this all elements pls
    elements[0].addEventListener("click", () => {
        document.location.href = path.join(root.path, 'views/home/home.html');
    });
});