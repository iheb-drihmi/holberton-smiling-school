$(document).ready(function () {
    // Function to append a new quote element
    function appendQuoteElement(picUrl, name, title, text, index) {
      $(".section-quote .carousel-inner").append(`
            <div class="carousel-item ${index == 0 ? "active" : ""}">
                <div class="row justify-content-between">
                    <div class="col-sm-4 text-center text-md-right my-auto pr-md-5">
                        <img src="${picUrl}" alt="slide" class="rounded-circle" height="160px" weight="160px">
                    </div>
                    <div class="col-sm-8 py-2">
                        <p class="mt-5 mt-sm-0 pl-md-2">${text}</p>
                        <p class="font-weight-bold mb-n1 mt-5">${name}</p>
                        <p><em>${title}</em></p> 
                    </div>
                </div>  
            </div>
        `);
    }
  
    // Function to append a new card element
    function appendCardElement(
      author,
      picUrl,
      thumbUrl,
      stars,
      title,
      subTitle,
      duration,
      index,
      selector
    ) {
      $(selector).append(`
            <div class="carousel-item ${
              index == 0 ? "active" : ""
            } col-12 col-sm-6 col-md-4 col-lg-3">
                <div class="card border-0" style="max-width: 25.5rem;">
                    <div class="position-relative image-group">
                        <img src="./images/play.png" alt="play" width="64px" class="play position-absolute">
                        <img src="${thumbUrl}" alt="card-1" class="card-img-top img-fluid" height="154px">
                    </div>
                    <div class="card-body">
                        <h5 class="card-title font-weight-bold">${title}</h5>
                        <p class="card-text text-muted">${subTitle}</p>
                        <div class="row justify-content-start align-items-center p-4">
                            <img src="${picUrl}" alt="${author}" width="30px" class="rounded-circle mr-4">
                            <p class="m-0 font-weight-bold">${author}</p>
                        </div>
                        <div class="row justify-content-between px-4">
                            <div class="d-inline-block">
                                ${generateStarRating(stars)}
                            </div>
                            <p class="font-weight-bold">${duration}</p>
                        </div>
                    </div>
                </div>      
            </div>
        `);
    }
  
    // Function to append a new course element
    function appendCourseElement(
      thumbUrl,
      title,
      subTitle,
      picUrl,
      author,
      stars,
      duration
    ) {
      $("#matchingCourses").append(`
              <div class="col-12 col-sm-6 col-md-4 col-lg-3 mt-4">
                  <div class="card border-0">
                      <div class="position-relative image-group">
                          <img src="./images/play.png" alt="play" width="64px" class="play position-absolute">
                          <img src="${thumbUrl}" alt="card" class="card-img-top img-fluid" height="154px">
                      </div>
                      <div class="card-body">
                          <h5 class="card-title font-weight-bold">${title}</h5>
                          <p class="card-text text-muted">${subTitle}</p>
                          <div class="row justify-content-start align-items-center p-4">
                              <img src="${picUrl}" alt="${author}" width="30px" class="rounded-circle mr-4">
                              <p class="m-0 font-weight-bold">${author}</p>
                          </div>
                          <div class="row justify-content-between px-4">
                              <div class="d-inline-block">
                                  ${generateStarRating(stars)}
                              </div>
                              <p class="font-weight-bold">${duration}</p>
                          </div>
                      </div>
                  </div>   
              </div>
          `);
    }
  
    // Function to generate the star rating
    function generateStarRating(stars) {
      let starHtml = "";
      stars = Math.min(stars, 5);
      for (let i = 0; i < stars; i++) {
        starHtml += `<img src="./images/star_on.png" alt="star on" width="15px">\n`;
      }
      for (let i = 0; i < 5 - stars; i++) {
        starHtml += `<img src="./images/star_off.png" alt="star off" width="15px">\n`;
      }
      return starHtml;
    }
  
    // Function to display the quotes
    function displayQuotes() {
      toggleLoader(true, ".section-quote .carousel-inner");
      $.get("https://smileschool-api.hbtn.info/quotes", function (data) {
        data.forEach((quote, index) => {
          appendQuoteElement(
            quote.pic_url,
            quote.name,
            quote.title,
            quote.text,
            index
          );
        });
        toggleLoader(false, ".section-quote .carousel-inner");
      });
    }
  
    // Function to display the carousel videos
    function displayCarouselVideos(carouselSelector, apiURL, contentSelector) {
      toggleLoader(true, carouselSelector + " .carousel-inner");
      $.get(apiURL, function (data) {
        data.forEach((video, index) => {
          appendCardElement(
            video.author,
            video.author_pic_url,
            video.thumb_url,
            video.star,
            video.title,
            video.sub_title,
            video.duration,
            index,
            contentSelector
          );
        });
        while ($(carouselSelector + " .carousel-item").length < 5) {
          data.forEach((video) => {
            appendCardElement(
              video.author,
              video.author_pic_url,
              video.thumb_url,
              video.star,
              video.title,
              video.sub_title,
              video.duration,
              -1,
              contentSelector
            );
          });
        }
        toggleLoader(false, carouselSelector + " .carousel-inner");
      });
    }
  
    // Function to populate the search filters
    function populateSearchFilters() {
      $.get("https://smileschool-api.hbtn.info/courses", function (data) {
        $(".section-filters input").val(data.q);
        let searchInput = $(".section-filters input").val();
        let selectedTopic = $("#topic button").attr("data-name");
        let selectedSort = $("#sortBy button").attr("data-name");
  
        data.topics.forEach((topic) => {
          $("#topic .dropdown-menu").append(
            `<a class="dropdown-item f-medium px-4 py-2" data-name="${topic}" href="#">${formatText(
              topic
            )}</a>`
          );
        });
  
        $(".section-filters input").change(function () {
          searchInput = $(this).val();
          displayCourses(searchInput, selectedTopic, selectedSort);
        });
  
        $("#topic button").text(formatText(data.topics[0]));
        $("#topic .dropdown-menu a").click(function () {
          selectedTopic = $(this).attr("data-name");
          $("#topic button").text($(this).text());
          displayCourses(searchInput, selectedTopic, selectedSort);
        });
  
        data.sorts.forEach((sort) => {
          $("#sortBy .dropdown-menu").append(
            `<a class="dropdown-item f-medium px-4 py-2" data-name="${sort}" href="#">${formatText(
              sort
            )}</a>`
          );
        });
  
        $("#sortBy button").text(formatText(data.sorts[0]));
        $("#sortBy .dropdown-menu a").click(function () {
          selectedSort = $(this).attr("data-name");
          $("#sortBy button").text($(this).text());
          displayCourses(searchInput, selectedTopic, selectedSort);
        });
      });
    }
  
    // Function to format the text
    function formatText(text) {
      return text
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    }
  
    // Function to display the courses
    function displayCourses(search = "", topic = "", sort = "") {
      toggleLoader(true, ".section-result .section-inner");
      $("#matchingCourses").empty();
      let url = `https://smileschool-api.hbtn.info/courses?q=${search}&topic=${topic}&sort=${sort}`;
  
      $.get(url, function (data) {
        data.courses.forEach((course) => {
          appendCourseElement(
            course.thumb_url,
            course.title,
            course.sub_title,
            course.author_pic_url,
            course.author,
            course.star,
            course.duration
          );
        });
  
        let courseCount = data.courses.length;
        $(".section-result p.courses-count").text(
          courseCount + (courseCount > 1 ? " videos" : " video")
        );
        toggleLoader(false, ".section-result .section-inner");
      });
    }
  
    // Function to toggle the loader
    function toggleLoader(shouldShow, selector) {
      $(selector + " .loader").toggle(shouldShow);
    }
  
    // Function to handle the carousel slide
    function handleCarouselSlide(event, selector) {
      const currentItem = $(event.relatedTarget);
      const idx = currentItem.index();
      const itemsPerSlide = 4;
      const totalItems = $(selector + " .carousel-item").length;
  
      if (idx >= totalItems - (itemsPerSlide - 1)) {
        const itemsToAppend = itemsPerSlide - (totalItems - idx);
        for (let i = 0; i < itemsToAppend; i++) {
          if (event.direction == "left") {
            $(selector + " .carousel-item")
              .eq(i)
              .appendTo(selector + " .carousel-inner");
          } else {
            $(selector + " .carousel-item")
              .eq(0)
              .appendTo(selector + " .carousel-inner");
          }
        }
      }
    }
  
    // Initialize event listeners
    $("#carouselVideos").on("slide.bs.carousel", function (e) {
      handleCarouselSlide(e, "#carouselVideos");
    });
  
    $("#carouselLatestVideos").on("slide.bs.carousel", function (e) {
      handleCarouselSlide(e, "#carouselLatestVideos");
    });
  
    if ($(".section-quote").length > 0) {
      displayQuotes();
    }
  
    if ($("#carouselVideos").length > 0) {
      displayCarouselVideos(
        "#carouselVideos",
        "https://smileschool-api.hbtn.info/popular-tutorials",
        "#carouselVideos .carousel-inner"
      );
    }
  
    if ($("#carouselLatestVideos").length > 0) {
      displayCarouselVideos(
        "#carouselLatestVideos",
        "https://smileschool-api.hbtn.info/latest-videos",
        "#carouselLatestVideos .carousel-inner"
      );
    }
  
    if ($(".section-result").length > 0) {
      populateSearchFilters();
      displayCourses();
    }
  });
  