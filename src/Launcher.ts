import {Server} from "./Server/Server"

class Launcher {
    
    //instace variables
    private server: Server

    constructor(){
        this.server = new Server()
    }

    public launchApp(){
        console.log("started app")
        this.server.createServer()
    }

}

new Launcher().launchApp()