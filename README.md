# See some articles here—[eldriv](https://eldriv.github.io/)

# Colophon
This website is built with [Emacs](https://www.gnu.org/software/emacs/), [Pandoc](https://pandoc.org/index.html), and [Org](https://orgmode.org/). 
Hosting provider: [Github Pages](https://pages.github.com) and [GIF](https://giphy.com/]).

# Building 
Clone the repository
   
     $ git clone git@github.com:eldriv/eldriv.github.io.git

If you have changes, rebuld it with:
   
    $ make rebuild

# Flakes

For NixOS who use flakes, you can simply run:
   
     $ nix develop .#meh
     $ make

