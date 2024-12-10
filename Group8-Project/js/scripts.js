/**
 * File: script.js
 * 
 * Description: This file contains all the JavaScript code that is required to provide interactivity in the website
 */

/**
 * APIs USED
 * 
 * 1. News API
 *    https://newsapi.org/
 * 
 * 2. Random Facts API
 *    http://numbersapi.com/
 */


/**
 * DESCRIPTION
 * 
 * Document.ready() function ensures that code only executes once the website is fully loaded. 
 * This prevents errors that would occur when JavaScript code is executed on elements before they are available
 * 
 * VARIABLES
 * 1. $homePageSlider: The section that will display the home page slider in Home Page
 * 2. $newsSection: The section that will display the news loaded via AJAX in Home Page
 * 3. $didYouKnowSection: The section that will display the Interesting facts loaded via AJAX in the About Us Page
 * 4. $didYouKnowButton: The button that will load a new interesting fact once clicked in avout us page
 * 5. $contactForm: The contact form in the Contact Us page
 * 6. $progessBar: The progress bar in the contact us page
 * 7. $messageSentModal: The modal to display once message is sent in contact us page
 */
$(document).ready(function() {

    // home page slider
    let $homePageSlider = $('#home-slider');

    // news section
    let $newsSection = $('#news');

    // did you know section
    let $didYouKnowSection = $('#did-you-know');

    // did you know button
    let $didYouKnowButton = $("#did-you-know-button");

    // contact form
    let $contactForm = $("#contact-form");

    // progress bat
    let $progressBar = $("#progress-bar");
    
    // message sent modal
    let $messageSentModal = $('#message-sent-modal');
    
    /**
     * HOME PAGE
     */

    // -> Page Slider Section

    // If home-slider div exists, display the jQuery Slider Plugin
    if($homePageSlider.length){
        // Display slideshow using SliderPro plugin
        $homePageSlider.sliderPro({
            width: '100%',
            height: 700,
            arrows: true,
            buttons: true,
            waitForLayers: true,
            fade: true,
            autoplay: true,
            autoScaleLayers: false
        });
    }

    // -> News Section

    // If news div exists, dislay the latest news from API
    if($newsSection.length){
        // Fetch and display latest news from newsapi.org
        fetchNews();
    }

    /**
     * ABOUT US PAGE
     */

    // -> Did you know Section

    // If did you know section div exists, dislay fact from API
    if($didYouKnowSection.length){
        // fetch fact on page load
        fetchDidYouKnowFacts();

        // button click event listener to fetch new fact
        $didYouKnowButton.on('click', function(){
            fetchDidYouKnowFacts();
        });
    }

    /**
     * CONTACT US PAGE
     */

    // -> Contact Form Section
    
    // If contact form exists, attach jQuery radiocheckbox widget an progress bar
    if($contactForm.length){
        // instantiate checkbox radio widget
        $('input[type=radio]').checkboxradio();

        // instantiate progress bar
        $progressBar.progressbar({value: 0});
        
        // submit event listener for when the form is submitted
        $contactForm.on('submit', function(e){
            // prevent the page from refreshing
            e.preventDefault();

            // display fictious response that the message was sent

            // display the progress bar using interval
            let value = 0;

            // interval to fill up the progress bar
            let interval = setInterval(function(){
                // increment the value by one each time
                value += 1;

                // set the new progress bar value
                $progressBar.progressbar( "option", "value", value);
                
                // if the value is >= 100, it means that the progress bar is full, clear the interval
                if(value >= 100){
                    // stop the interval
                    clearInterval(interval);

                    // display modal that the message was sent
                    $messageSentModal.modal();

                    // reset the form
                    $contactForm[0].reset();

                    // reset the progress bar to 0
                    $progressBar.progressbar( "option", "value", 0);
                }
            }, 15);
        });
    }


    /**
     * FUNCTIONS
     */

    /**
     * DESCTIPTION
     * Fetch interesting did you know from NumbersAPI.com and display them in did you know section
     * 
     * URL: http://numbersapi.com/random
     */
    function fetchDidYouKnowFacts(){
        // perform AJAX request to [http://numbersapi.com/random] to get a random fact
        $.ajax({
            url: "http://numbersapi.com/random",
            success: function(result){
                // display the fact received in did you know section
                $didYouKnowSection.html(result);
            },
            error: function(xhr, status, error){
                alert(error);
            }
    
        });
    }

    /**
     * DESCRIPTION
     * 
     * Fetch news from NewsAPI.org and display in News Section
     * 
     * URL: https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=5f3d797db74245049e0be763b705fcf4
     */
    function fetchNews(){
        // perform AJAX request to [https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=5f3d797db74245049e0be763b705fcf4] to get latest news
        $.ajax({
            url: "https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=5f3d797db74245049e0be763b705fcf4",
            success: function(result){
                // display the loading icon
                $newsSection.html('<p class = "text-center"><i class="fa fa-spinner fa-spin"></i></p>');
                
                // variable to hold HTML that is generated while looping through articles
                let html = ``;
                
                // loop through the result.articles array to display news
                result.articles.forEach(function(article){
                    // set news image
                    let image = article.urlToImage ? article.urlToImage : './img/article.jpg';

                    let date = new Date(article.publishedAt);
                    
                    // append html
                    html += `
                        <div class="news-card">
                            <div class = "image" style = "background-image: url(${image})"></div>
                            
                            <div class = "news-content">
                                <p class="title"><a target="_blank" href="${article.url}">${article.title}</a></p>
                                <p class="author">by ${article.author} on ${date.toLocaleString()}</p>
                                <p class="content">${article.content ? article.content : '' }</p>
                            </div>
                        </div>
                    `;
                });

                // dsplay in news section
                $newsSection.html(html);
            },
            error: function(xhr, status, error){
                alert(error);
            }
    
        });
    }
});