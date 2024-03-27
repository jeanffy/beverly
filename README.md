# Beverly

A Kubernetes dashboard

## Prerequisites

- `kubectl` installed
- `$HOME/.kube/config` configured with environments to be viewed

## Usage

- `npm install -g beverly`
- `beverly`

This will launch a web server in the background and open your default browser to the main page.

To quit, just close the program that is running in the terminal window.

## Configuration

Very simple configuration can be made with environment variables:

- `KUBECONFIG_PATH`: change kube configuration file path (default is `$HOME/.kube/config`)
- `API_LISTEN_PORT`: change server listen port (default is `28142`)
- `DEBUG_CMD=1`: to print kubectl commands in logs
