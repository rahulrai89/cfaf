# cfaf
This project uses Gulp to minify JS/CSS files and hosts them on GitHub to be used in a Blogger template.

# Blog Details
Blog Name: Code for a fiction
Blog URL: (https://www.codeforafiction.com/)

I hope you find this guide helpful. 

# Initialise your local environment
Once you have created the two files, package.json and gulpfile.js, you are almost ready to go! Before you can begin minifying files, you must download the npm modules that are declared in your package.json file. This can be done by:

Opening a terminal window changing into the directory that you have saved the package.json and gulpfile.js files
running the following command:
npm install

$ Start minifying
When you’re at this step, and you’ve added your HTML files, you are ready to start minifying. Open your terminal window and change into the root directory of your project and run the command:

gulp
This should start compiling all of your CSS, JS, and HTML files and output them into a folder called ‘dist’.

You can also run the following commands to compile CSS, JS, and HTML files individually:

gulp styles
gulp scripts
gulp pages

# Blogger Template
Added my blogger template in the source code.


