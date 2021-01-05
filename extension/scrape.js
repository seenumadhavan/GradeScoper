
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.greeting == "time to scrape") {
            // chrome.tabs.executeScript({
              console.log("found gradescope, about to execute");
              (() => {
                const text = document.documentElement.innerHTML;
                const matchesIterator = [...text.matchAll(/(?:scope=\"row\"><a aria-label(?:.+?)(?=>)>(.+?)(?=<\/a>)|scope=\"row\">(.+?)(?=<\/th))(?:(?!Due\s+at).)*Due\s+at\s+([^\s]+)\s+([0-3][0-9])\s+at\s+(\d?\d:\d\d)(AM|PM)/g)];
                const courseName = [...text.matchAll(/(?:.+?)(?=courseHeader--title)courseHeader--title\">(.+?)(?=<)/g)];
                console.log(courseName);
                //console.log(text.match(/<a aria-label=\"View ([^\"]+)(?:(?!Due at).)*Due at ([^\s]+) ([0-3][0-9]) at (\d\d:\d\d)(AM|PM)/));
                let matches = Array.from(matchesIterator);
                console.log(matches);

                sendResponse({farewell: "goodbye"});

            
              })()

            // })
        }
});
  


  //Ex: there is a submission

  //<tr role="row" class="even"><th class="table--primaryLink" role="rowheader" scope="row"><a aria-label="View Lecture 33 - Thread-Level Parallelism I" href="/courses/150586/assignments/736818/submissions/55399866">Lecture 33 - Thread-Level Parallelism I</a></th><td class="submissionStatus"><div class="submissionStatus--score">4.0 / 4.0</div></td><td class="sorting_1 sorting_2"><div class="submissionTimeChart"><div class="progressBar--caption"><span aria-label="Released at November 09" class="submissionTimeChart--releaseDate">Nov 09</span><span aria-label="Due at November 14 at 11:59PM" class="submissionTimeChart--dueDate">Nov 14 at 11:59PM</span></div></div></td></tr>
  
  //Ex: no submission
  
  //<tr role="row" class="even"><th class="table--primaryLink" role="rowheader" scope="row">Thursday DSP 200% Final Exam (8 AM - 2 PM)</th><td class="submissionStatus submissionStatus-warning"><div aria-hidden="true" class="submissionStatus--bullet" role="presentation"></div><div class="submissionStatus--text">No Submission</div></td><td class="sorting_1 sorting_2"><div class="submissionTimeChart"><div class="progressBar--caption"><span aria-label="Released at December 17" class="submissionTimeChart--releaseDate">Dec 17</span><span aria-label="Due at December 17 at  2:20PM" class="submissionTimeChart--dueDate">Dec 17 at  2:20PM</span><br><span aria-label="Late Due Date at December 17 at  2:25PM" class="submissionTimeChart--dueDate">Late Due Date: Dec 17 at  2:25PM</span></div></div></td></tr>
