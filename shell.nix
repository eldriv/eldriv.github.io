{ nixpkgs, pkgs, ... }:
with pkgs; rec {
  eldriv = mkShell {
    buildInputs = [ pandoc gnumake screen ];
  };
  default = eldriv;
}