/*
* newsTicker: Jquery plugin for news ticker
*
* latest version and complete README available on Github:
* https://github.com/jayeshmagare/newsTicker
*
* Copyright 2013 Jayesh Magare (jayesh.magare@gmail.com)
* Please file issues on Github : https://github.com/jayeshmagare/newsTicker/issues
* Licensed under the MIT license.
*/

(function ($) {

    $.fn.newsTicker = function (options) {
        var options = $.extend({}, $.fn.newsTicker.config, options);
		
		/* check that the passed element is actually in the DOM */
		if ($(this).length == 0) {
			if (window.console && window.console.log) {
				window.console.log('Element does not exist in DOM!');
			}
			else {
				alert('Element does not exist in DOM!');		
			}
			return false;
		}
		
		/* ID of the identifier */
		var newsID = '#' + $(this).attr('id');
		$(newsID).hide();
		
        return this.each(function () {
            /* initialize the elements in the collection */
			var settings = {				
				count: 0,
				newsArr: {},
				play: true,
				contentLoaded: false,
				interval:'',
				clearIntrvl:0
			};
			
			/* Next button click button handler */
			$(options.nextBtnDiv).click(function() {
				settings.clearIntrvl = 1;
				putNews();
			});
			
			/* Prev button click button handler */
			$(options.prevBtnDiv).click(function() {
				if (settings.count == 0) {
					settings.count = countSize(settings.newsArr) -2;
				}
				else if (settings.count == 1) {
					settings.count = countSize(settings.newsArr) -1;
				}
				else {
					settings.count = settings.count - 2;
				}
				
				if (settings.count < 0) {
					settings.count = countSize(settings.newsArr)-1;
				}
				settings.clearIntrvl = 1;
				putNews();
			});
			
			/* Play/Pause button click button handler */
			$(options.playPauseID).click(function() {
				if(settings.play == true)
				{
					if(settings.interval)
					{
						settings.clearIntrvl = 1;
						clearInterval(settings.interval);
					}
					settings.play= false;
					debugError('Paused:'+settings.count);
				}
				else				
				{
					debugError('Play :'+settings.count);
					settings.play= true;
					putNews();
				}
			});
			
			initPage();
			
			function initPage()
			{
				populateNews();
				
				if(settings.contentLoaded)
				{
					settings.clearIntrvl = 1;
					putNews();
				}
			}
			
			function runIntervals()
			{
				settings.clearIntrvl=0;	
				settings.interval = setInterval(function(){ putNews() }, options.interval);
					
				$(options.newsData).hover(function() {
						if(settings.interval)
						{
							settings.clearIntrvl = 1;
							clearInterval(settings.interval);
						}
					 }, function(){
						putNews();
					 });
			}

			/* Function to get the size of an Object*/
			function countSize(obj) {
			    var size = 0, key;
			    for (key in obj) {
			        if (obj.hasOwnProperty(key)) size++;
			    }
			    return size;
			};

			/* This function populates news from the array to newsData div */
			function putNews()
			{
				debugError('in News putting :'+settings.count);
				if(settings.clearIntrvl == 1)
				{
					if(settings.interval)
						clearInterval(settings.interval);
						
				}
			
				$(options.newsData).fadeOut('slow',function(){
					var news = settings.newsArr[settings.count].content;
					
					$(options.newsData).html(news).fadeIn('slow');
					settings.count++;
					if (settings.count == countSize(settings.newsArr) ) {
						settings.count = 0;
					}
				});
				
				if(settings.clearIntrvl == 1)
				{
					runIntervals();
				}
			}	
			
			/* This function populates news array from the UL list */
			function populateNews() {
				$.ajax({
				  url: "https://gnews.io/api/v4/top-headlines?&lang=pt&country=br&max=100&apikey=8cdba371902322b999e0d715d87a71ec",
				  dataType: "json",
				  success: function(data) {
					var newsData = data.articles;
					var count = 0;
					for (var i = 0; i < newsData.length; i++) {
					  settings.newsArr[count++] = '<div><a href="' + newsData[i].url + '" target="_blank">' + newsData[i].title + '</a><div id="qr-code-' + i + '"></div></div>';
				  
					  // generate QR code for each news article
					  var qrCode = new QRCode("qr-code-" + i, {
						text: newsData[i].url,
						width: 128,
						height: 128,
						colorDark : "#000000",
						colorLight : "#ffffff",
						correctLevel : QRCode.CorrectLevel.H
					  });
					}
					settings.contentLoaded = true;
				  }
				});
			  }
			
			  
			/* Function for handling debug and error messages */ 
			function debugError(obj) {
				if (options.debugMode) {
					if (window.console && window.console.log) {
						window.console.log(obj);
					}
					else {
						alert(obj);			
					}
				}
			}
        });
    };

    $.fn.newsTicker.config = {
        // set values and custom functions
		interval: "4000",
		newsData: "#newsData",
		prevBtnDiv: "#prevDiv",
		nextBtnDiv: "#nextDiv",
		playPauseID: "#play-pause",
		effect: "fadeIn",
		debugMode:0
    };



  $(function () {
    //fetch('https://gnews.io/api/v3/search?q=brazil&country=br&token=8cdba371902322b999e0d715d87a71ec&lang=pt')

	fetch('https://gnews.io/api/v4/top-headlines?&lang=pt&country=br&max=100&apikey=8cdba371902322b999e0d715d87a71ec')


	
    .then(response => response.json())
    .then(data => {
      //verifica se o array "articles" não é vazio
      if(data.articles && data.articles.length > 0){
        let news = data.articles.map((article, index) => `<li class="news-item" id="news-item-${index}"><a href="${article.url}" target="_blank">${article.title}</a></li>`);

        document.getElementById("newsList").innerHTML = news.join('');
        let currentIndex = 0;
        const newsItems = document.getElementsByClassName("news-item");

        document.getElementById("next").addEventListener("click", () => {
          currentIndex++;
          if (currentIndex >= newsItems.length) {
            currentIndex = 0;
          }
          for (let i = 0; i < newsItems.length; i++) {
            newsItems[i].style.display = "none";
          }
          newsItems[currentIndex].style.display = "block";
        });

        document.getElementById("prev").addEventListener("click", () => {
          currentIndex--;
          if (currentIndex < 0) {
            currentIndex = newsItems.length - 1;
          }
          for (let i = 0; i < newsItems.length; i++) {
            newsItems[i].style.display = "none";
          }
          newsItems[currentIndex].style.display = "block";
        });

        // Adicionar função setInterval para mudar o índice da notícia automaticamente
        setInterval(() => {
          currentIndex++;
          if (currentIndex >= newsItems.length) {
            currentIndex = 0;
          }
          for (let i = 0; i < newsItems.length; i++) {
            newsItems[i].style.display = "none";
          }
          newsItems[currentIndex].style.display = "block";
        }, 3000); // mudar a notícia a cada 3 segundos
      }
    });
  });


}(jQuery));