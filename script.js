chrome.tabs.query({active : true , currentWindow : true },async (tabs) => {

//     console.log(tabs)
// async function getData(){

    // declaring all the required DOM variables
    let main_container = document.getElementsByClassName("main_container")[0];
    let spinner = document.getElementsByClassName("spinner")[0];
    let gram_span = document.getElementsByClassName("gram_span")[0];
    let percent_span = document.getElementsByClassName("percent_span")[0];
    let status_span = document.getElementsByClassName("status_span")[0];


    // making the spinner visible and DOM hidden until the data is not loaded
    main_container.style.display = "none";
    spinner.style.display = "block";

    // let url = "https://leetcode.com" ;

    //extracting the url from current open tab
    let url = tabs[0].url;

    // request options for reverse proxy
    const options = {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            Origin: 'www.example.com',
            'X-Requested-With': 'www.example.com',
            'X-RapidAPI-Key': '8b5e5fb130msh82e3b884983214fp1af14fjsn1667ae51aef5',
            'X-RapidAPI-Host': 'http-cors-proxy.p.rapidapi.com'
        },
        body: `{"url":"https://api.websitecarbon.com/site?url=${url}"}`
    };
    

    //sending the request on website carbon with the help of reverse proxy (because of CORS policy)
    let response = await fetch("https://http-cors-proxy.p.rapidapi.com/",options);
    let result = await response.json();


    // making the spinner hidden and DOM visible when data is loaded
    spinner.style.display = "none";
    main_container.style.display = "flex";


    //declaring variables to store the necessary response data
    let greenStatus = result.green ;
    let carbonPercent = result.cleanerThan*100;
    let carbonGrams = result.statistics.co2.renewable.grams ;

    //calculating the grams of carbon release per visit of current website
    carbonGrams = Math.round((carbonGrams + Number.EPSILON)*100)/100;


    //setting the response values in DOM 
    gram_span.innerText = carbonGrams;
    percent_span.innerText = carbonPercent;
    

    if(greenStatus == true){
        status_span.innerText = "green"
    }else if(greenStatus == "unknown"){
        status_span.innerText = "unknown data for this"
    }else if(greenStatus == false){
        status_span.innerText = "non-green";
    }



    //declared the function for the animation in showing percentage
    function makeAnimation(element , start , end , duration){
        let startTimestamp = null;

        const step = (timestamp) => {
            if(!startTimestamp) startTimestamp = timestamp ;
            const progress = Math.min((timestamp - startTimestamp)/duration,1);
            element.innerHTML = Math.floor(progress*(end-start)+start);
            if(progress < 1){
                window.requestAnimationFrame(step);
            }
        }
        window.requestAnimationFrame(step);
    }


    //calling the animation function
    makeAnimation(percent_span,0,carbonPercent,5000);
// }

// getData();

})