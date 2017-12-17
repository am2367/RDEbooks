$(document).ready(function() {
  getSession();
  getBooks();
  var user;
  var book;
  var totalPages;
  var currentPage;
  var currentBookPath;
  var currentBookAuthor;
  var currentBookTitle;
  var bookmarkedPage;
  var rated;


  //send session request
  function getSession() {
    var request = new XMLHttpRequest();
    request.open("POST", "sessions.php", true);
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    request.onreadystatechange = function() {

      if ((this.readyState == 4) && (this.status == 200)) {
        handleSessionReply(this.responseText);
      }
    }
    request.send("request=get");
  }

  //handle the session reply
  function handleSessionReply(response) {
    if (response != "") {
      user = response;
      $('.navbar').find('.dropdown-toggle').text(response);
    } else {
      alert("Your session has expired. Please login again.");
      window.location.href = 'login.html';
    }
  }

  //retrieve list of books
  function getBooks() {
    var http = new XMLHttpRequest();
    http.open("GET", "requestHandler.php?instructions=bookList", true);
    http.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        populateBookPanels(http.responseText);
      }
    };
    http.send();
  }

  //create the book panels
  function populateBookPanels(response) {
    bookDetails = JSON.parse(response);
    $.each(bookDetails, function() {
      bookPanels = "<div class=\"card col-sm-6 col-md-6 col-lg-4\"><div class=\"card-header\">" +
        "<div class=\"star-rating\">" +
        "<span class=\"fa fa-star-o fa-border\" data-rating=\"1\"></span>" +
        "<span class=\"fa fa-star-o\" data-rating=\"2\"></span>" +
        "<span class=\"fa fa-star-o\" data-rating=\"3\"></span>" +
        "<span class=\"fa fa-star-o\" data-rating=\"4\"></span>" +
        "<span class=\"fa fa-star-o\" data-rating=\"5\"></span>" +
        "<a class=\"rating-value\">" + this[3] + "</a><a class=\"pull-right\"" +
        "href=\"https://www.amazon.com/s/ref=nb_sb_noss_2?url=search-alias%3Daps&field-keywords=" + this[0] + " by " + this[1] +
        "\"><img src=\"http://www.niftybuttons.com/amazon/amazon-button5.png\" alt=\"Amazon Button (via NiftyButtons.com)\">" +
        "</div>" +
        "</a></div><div class=\"card-block d-flex justify-content-end\">" +
        "<div class=\"mr-auto p-2\">" + this[0] + " by " + this[1] + "</div></div>" +
        "<div class=\"card-footer\"><button type=\"button\" " + "class=\"btn btn-success\" id='" +
        this[2] + "'>" + "Read" + "</button></div></div>";
      $("#cardRow").append(bookPanels);
      var id = this[2]
      SetRatingStar($('.card:last').find('.star-rating .fa'));
    });

    getUserInfo();
  }
  //return info for current user
  function getUserInfo() {
    var http = new XMLHttpRequest();
    http.open("GET", "requestHandler.php?instructions=userInfo&user=" + user, true);
    http.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        populateUserInfo(http.responseText);
      }
    };
    http.send();
  }

  //populate the user info
  function populateUserInfo(response) {
    userDetails = JSON.parse(response);
    $.each(userDetails, function(count) {
      if ($(this)[2] != 1) {
        $('.mr-auto').each(function() {
          if (($(this)[0].innerText).indexOf(userDetails[count][1]) != -1)
            $(this).parents('.card').find('button').text("Continue Reading");
        });
      }
    });
  }

  //return parsed book
  function getParsedBook(path) {
    var http = new XMLHttpRequest();
    http.open("GET", "requestHandler.php?instructions=getParsedBook&path=" + path, true);
    http.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        getInfo(JSON.parse(http.responseText), path);
      }
    };
    http.send();
  }

  //load the next page
  function loadPage(book) {
    $('#text').replaceWith("<div id='text'>" + book[currentPage].join('') + "</div>");
    $('.modal-footer').find('a').text("Page " + currentPage + " / " + totalPages);
    $('.modal-body').scrollTop(0);
    if ($('.fa-bookmark-o').hasClass('fa-bookmark-o')) {
      if (currentPage != bookmarkedPage) {
        $('.fa-bookmark-o').addClass('fa-bookmark').removeClass('fa-bookmark-o');
      }
    } else if (($('.fa-bookmark-o').hasClass('fa-bookmark-o')) == false) {
      if (currentPage == bookmarkedPage) {
        $('.fa-bookmark').addClass('fa-bookmark-o').removeClass('fa-bookmark');
      }
    }
  }

  //load the book
  function loadBook(response, info, path) {
    book = response;
    totalPages = book.length - 1;
    currentBookAuthor = info['Author'];
    currentBookTitle = info['Title'];
    currentPage = parseInt(info['CurrentPage']);
    bookmarkedPage = parseInt(info['CurrentPage']);
    rated = info['Rated'];
    $('#text').replaceWith("<div id='text'>" + book[1].join('') + "</div>");
    $('.modal-footer').find('a').text("Page " + currentPage + " / " + totalPages);
    $('#modalTitle').text(currentBookTitle);
    $('.fa-bookmark').addClass('fa-bookmark-o').removeClass('fa-bookmark');
    $("#first").prop("disabled", false);
    $("#back").prop("disabled", false);
    $("#forward").prop("disabled", false);
    $("#last").prop("disabled", false);
  }

  //get the current page for the book
  function getInfo(response, path) {
    var http = new XMLHttpRequest();
    http.open("GET", "requestHandler.php?instructions=getInfo&path=" + path + "&user=" + user, true);
    http.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        loadBook(response, JSON.parse(http.responseText), path);
      }
    };
    http.send();
  }

  //save the current page for the book
  $(document).on('click', '.fa-bookmark', function() {
    var http = new XMLHttpRequest();
    http.open("GET", "requestHandler.php?instructions=savePage&user=" + user + "&title=" + currentBookTitle + "&page=" + currentPage, true);
    http.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        $('.fa-bookmark').addClass('fa-bookmark-o').removeClass('fa-bookmark');
        bookmarkedPage = currentPage;
      }
    };
    http.send();
  });

  //update book rating in db
  function submitRating(rating) {
    var http = new XMLHttpRequest();
    http.open("GET", "requestHandler.php?instructions=updateRating&title=" + currentBookTitle + "&rating=" + rating + "&user=" + user, true);
    http.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        refreshPage();
        $('#RatingModal').modal('hide');
        $('.rating-value').text('');
      }
    };
    http.send();
  }

  //refresh the page contents
  function refreshPage() {
    $('#cardRow').children().remove();
    $('#text').replaceWith("<div id='text'><div id='loader'></div></div>");
    $('#modalTitle').text("");
    $('.modal-footer').find('a').text("");
    getBooks();
  }
  //filter books based on search
  $('#textSearch').keyup(function() {
    var filter = $(this).val().toLowerCase();;
    $('#cardRow').children('.card').each(function() {
      if (($(this)[0].innerText.toLowerCase()).indexOf(filter) == -1)
        $(this).hide();
      else
        $(this).show();
    });
  });
  $('#RatingModal').on('click', '#Later', function() {
    $('#RatingModal').modal('hide');
    refreshPage();
  });
  $('#RatingModal').on('click', '#Submit', function() {
    var rating = $(this).parents('.modal').find('.rating-value').text();
    if (rating != "")
      submitRating(rating);
    else {
      alert("Please select a rating of at least 1 star.");
    }
  });
  $('#RatingModal').on('click', '#Stop', function() {
    var rating = $(this).parents('.modal').find('.rating-value').text();
    submitRating("none");
  });
  $('.modal-content').on('click', '#first', function() {
    currentPage = 1;
    loadPage(book);
  });
  $('.modal-content').on('click', '#last', function() {
    currentPage = totalPages;
    loadPage(book);
  });
  $('.modal-content').on('click', '#forward', function() {
    if (currentPage != totalPages) {
      currentPage += 1;
      loadPage(book);
    }
  });
  $('.modal-content').on('click', '#back', function() {
    if (currentPage != 1) {
      currentPage -= 1;
      loadPage(book);
    }
  });
  $('#cardRow').on('click', '.btn-success', function() {
    $('#modal').modal('toggle');
    $("#first").prop("disabled", true);
    $("#back").prop("disabled", true);
    $("#forward").prop("disabled", true);
    $("#last").prop("disabled", true);
    $("#save").prop("disabled", true);
    //console.log($('.fa-bookmark'));
    currentBookPath = this.id;
    getParsedBook(this.id);
  });
  $('#modal').on('hidden.bs.modal', function() {
    if (rated == 0) {
      $('#RatingModal').modal('toggle');
    } else {
      refreshPage();
    }
  });
  //*************************************star rating system************************************************
  var star_rating;

  function SetRatingStar(rating) {
    rating.each(function() {
      if ((rating.siblings('.rating-value').text()) >= ($(this).data('rating'))) {
        $(this).removeClass().addClass('fa fa-star');
      } else if (((rating.siblings('.rating-value').text()) >= (($(this).data('rating')) - 0.5) &&
          (rating.siblings('.rating-value').text()) < (($(this).data('rating')) + 0.5))) {
        $(this).removeClass().addClass('fa fa-star-half-o');
      } else {
        $(this).removeClass().addClass('fa fa-star-o');
      }
    });

  };
  $('#RatingModal').on('click', '.star-rating .fa', function() {
    $(this).parents('.star-rating').find('.rating-value').text($(this).data('rating'));
    $(this).parents('.star-rating').find('.fa').each(function() {
      var currentRating = $(this).parents('.star-rating').find('.rating-value').text();
      if (parseInt(currentRating) >= parseInt($(this).data('rating'))) {
        $(this).removeClass('fa-star-o').addClass('fa-star');
      } else {
        $(this).removeClass('fa-star').addClass('fa-star-o');
      }
    });
  });
  //*******************************************************************************************************

});
