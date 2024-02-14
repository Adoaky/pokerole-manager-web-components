import routes from './routes.js';

document.addEventListener("DOMContentLoaded", () =>{

    document.addEventListener("click", event => {
        //define targeted event
        const {target} = event;
        // check target for link
        if(!target.matches("[data-link='internal']")) return;
        // prevent default
        event.preventDefault();
    
        router(event);
    });
    
    const findRef = (target) => {
        let output = routes.find( rout => rout.path === target );
        return output.ref;   
    }
    
    const router = (event) => {
        event.preventDefault();
        window.history.pushState({} , "", event.target.href);
        urlLocationHandler();
    };
    
    const urlLocationHandler = async () => {
        const Location = window.location.pathname ;
    
        if( Location.length == 0) Location = findRef("/index.html");
    
        // Find Template
        const route = routes.find( target => target.ref === Location ) || routes.find( target => target.ref === "404" );
    
        // GET Template and place content
        const html = await fetch(route.path).then( response  =>  response.text() );
        document.querySelector("main").innerHTML = html;
        document.title = route.title;
    };
    
    window.onpopstate = urlLocationHandler;
    window.route = router;


    urlLocationHandler();
});
