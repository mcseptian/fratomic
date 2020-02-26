# Main file

This `components.scss` file main function is to import any `scss` file under `src/components` folder. Any `scss` file that's not begin with underscore will be imported here.

The main file (usually labelled `main.scss`) should be the only Sass file from the whole code base not to begin with an underscore. This file should not contain anything but `@import` and comments. 

In this project the main file named `components` and the `core` file act as suplement. The `components` file is watcher generated to import each components being modified each iteration of time. The `core` file is to import vendor specific or reset css that each component depends on.

Reference: [Sass Guidelines](http://sass-guidelin.es/) > [Architecture](http://sass-guidelin.es/#architecture) > [Main file](http://sass-guidelin.es/#main-file)
