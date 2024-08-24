{
    description = "Development environment";

    inputs = {
        nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
        flake-utils.url = "github:numtide/flake-utils";
    };

    outputs = inputs@{ self, nixpkgs, flake-utils, ... }:
        flake-utils.lib.eachSystem [ "x86_64-linux" ] (system: 
            let
                pkgs = import nixpkgs {
                    inherit system;
                };

            in rec {
                devShell = pkgs.mkShell {
                    buildInputs = with pkgs; [ 
                    ];
                };
            });
}
