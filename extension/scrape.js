chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
      if (request.greeting == "time to scrape") {
          // chrome.tabs.executeScript({
            //FORCE REFRESH
            console.log("found gradescope, about to execute");
            (() => {
              const text = document.documentElement.innerHTML;
              const matchesIterator = [...text.matchAll(/(?:scope=\"row\"><a aria-label(?:.+?)(?=>)>(.+?)(?=<\/a>)|scope=\"row\">(.+?)(?=<\/th))(?:(?!Due\s+at).)*Due\s+at\s+([^\s]+)\s+([0-3][0-9])\s+at\s+(\d?\d:\d\d)(AM|PM)/g)];
              const courseName = [...text.matchAll(/(?:.+?)(?=courseHeader--title)courseHeader--title\">(.+?)(?=<)/g)];
              console.log(courseName);
              //console.log(text.match(/<a aria-label=\"View ([^\"]+)(?:(?!Due at).)*Due at ([^\s]+) ([0-3][0-9]) at (\d\d:\d\d)(AM|PM)/));
              let matches = Array.from(matchesIterator);
              console.log(matches);

              sendResponse({farewell: matches});

          
            })()

          // })
      }
});