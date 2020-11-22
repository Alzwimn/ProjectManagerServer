import {Server} from "./Server"

class Launcher {
    
    //instace variables
    private name: string
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