{ nixpkgs, pkgs, ... }:
with pkgs; rec {
  meh = mkShell {
    buildInputs = [ pandoc gnumake screen ];
  };
  default = eldriv;
}