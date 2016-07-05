Website Performance Optimisation
================================

##Description
An optimised website created as part of the Udacity Front-End Nanodegree course. A provided portfolio site was optimised for `index.html` to achieve a PageSpeed score of at least 90 for Mobile and Desktop and for `pizza.html` to run at a consistent 60fps, with the pizzas resising at under 10ms.

##Usage
To run the site, download or clone the repository and open `index.html` in your browser. This page achieved a PageSpeed Insights score of 94 on mobile and 96 on desktop.

Alternatively, a live version of the website can be viewed [here](http://andrewalderton.github.io/frontend-nanodegree-mobile-portfolio).

##Gulp usage
Gulp was used in this project for optimisation tasks. Critical path CSS was added inline at the top of each page; scripts were moved to the bottom; images were compressed; HTML, CSS and JavaScript were minified.

All main tasks are included in the default gulp task, so simply run gulp in the command line, where `gulpfile.js is located`, to replicate the optimisations for this project.

All working files are located in the `src` directory. Gulp tasks will output to the `dist` directory.

##Other optimisations
As the gulp task to compress images didn't have the desired results, further compression of the .jpg pizza images was carried out using [compressjpeg](http://compressjpeg.com).

##main.js optimisations
`main.js` was altered in order to improve rendering of the pizza images in `pizza.html`. This page now runs consistently at 60fps. The time taken for the pizzas to resize using the slider is now about 0.5ms.

##updatePositions() function
Moved several elements outside of the for loop to be calculated seperately and stored as variables, which can then be used in the loop.

Replaced 'querySelectorAll' with 'getElementsByClassName', in order to improve speed.

Reduced number of moving pizzas created from 200 to 25.

Used 'transform', instead of 'style.left', as 'left' triggers layout, paint and composite, whereas 'transform' only triggers composite.

Added the backface-visibility: hidden CSS attribute to force the moving pizzas into seperate composite layers. This means that the browser is not required to paint the whole page each time the elements move.

##resizePizzas() function
Again, unnecessary calculations were taken out of the for loop. Instead of calculating the size difference when resizing, the switch statement was used to return a 'newWidth' percentage based on the size chosen with the slider. This value is then applied to every pizza as the loop runs.
