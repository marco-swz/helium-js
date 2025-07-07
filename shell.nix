{ pkgs ? import <nixpkgs> {} }:
    pkgs.mkShell {
        nativeBuildInputs = with pkgs.buildPackages; [ 
            playwright
            playwright-test
        ];

    shellHook = ''
        export LC_ALL="en_US.UTF-8"
        export PLAYWRIGHT_BROWSERS_PATH=${pkgs.playwright.browsers}
    '';
}


