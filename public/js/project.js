
function counterInit() {
    var counter = 0;
    var audioElementCounter = document.createElement('audio');
    audioElementCounter.setAttribute('src', '../audios/count.mp3');
    audioElementCounter.addEventListener('ended', function() {
        this.play();
    }, false);



    audioElementCounter.play();

    setTimeout(function () {
        counter++;
        $('.counter-number-1').addClass('opened')
    },1100);

    setTimeout(function () {
        $('.counter-number-1').removeClass('opened')
    }, 2700);



    setTimeout(function () {
        counter++;
        $('.counter-number-2').addClass('opened')
    },3800);

    setTimeout(function () {
        $('.counter-number-2').removeClass('opened')
    }, 5250);




    setTimeout(function () {
        counter++;
        $('.counter-number-3').addClass('opened')

    },6700);

    setTimeout(function () {
        audioElementCounter.pause();
        $('.counter-number-3').removeClass('opened');
        $('.counter').remove();
    },9500);
}



var audioElementLiftMusic = document.createElement('audio');
audioElementLiftMusic.setAttribute('src', '../audios/elevator-music.mp3');
audioElementLiftMusic.addEventListener('ended', function() {
    this.play();
}, false);


var audioElementLiftArrive = document.createElement('audio');
audioElementLiftArrive.setAttribute('src', '../audios/elevator-arrive.mp3');
audioElementLiftArrive.addEventListener('ended', function() {
    this.play();
}, false);

var audioElementPeter = document.createElement('audio');
audioElementPeter.setAttribute('src', '../audios/elevator-cigiszunet.mp3');
audioElementPeter.addEventListener('ended', function() {
    this.play();
}, false);




var socket = io.connect();
var $messageForm = $('#messageForm');
var $messageFormButton = $('#messageFormButton');
var $message = $('#message');
var $chat = $('#chat');


var $userForm = $('#userForm');
var $userFormArea = $('#userFormArea');
var $users = $('#users');
var $username = $('#username');
var checkbox = $('.custom-checkbox');
var $welcomeText = $('#welcome-text');


// PAGES

var userFormPage = $('#userFormArea');
var welcomeText = $('#welcome-text');
var mainPage = $('#mainPage');
var avatarPage = $('#avatar-page');
var loader = $('#loader');


// ETC

var transitionTime = 500; // ms






$(function () {

    $messageForm.submit(function (e) {
        e.preventDefault();
        socket.emit('send message', $message.val());
        $message.val('');
    });

    socket.on('new message', function (data) {
        $chat.append('<div class="well"><p><span> ' + data.user + ': </span>' + data.msg + '</p></div>');
        $chat.animate({ scrollTop: $chat.prop("scrollHeight")}, 1000);
    });





    // ADD NEW USERNAME
    $('#clear').click(function () {
        localStorage.clear();
        location.reload()
    });


    // IF USERNAME STORED
    if (localStorage.getItem("username") != null) {
        socket.emit('new user', localStorage.getItem("username"), function (data) {

            if(data){
                $userFormArea.hide();
                $(mainPage).addClass('open-window-main');

                setTimeout(function () {
                    $("#" + localStorage.getItem("username")).prop('disabled', false);
                },10);
            }
        });
    }

    // USERFORM SUBMITTING
    $userForm.submit(function (e) {

        e.preventDefault();

        var usernameValue = $username.val();
        fillWelcomeText(usernameValue);

        $('#avatar img').addClass(usernameValue);

        socket.emit('new user', usernameValue, function (data) {
            if(data){
                $(userFormPage).addClass('triggered');
                $(welcomeText).addClass('open-window');

                setTimeout(function () {
                   $welcomeText.addClass('triggered');

                   $(avatarPage).addClass('open-window');
                },2000);

                $('#avatar .btn').click(function () {
                    var $currentimage = $('.' + localStorage.getItem("username") );
                    $users.append($currentimage);
                    console.log($currentimage);

                    $(avatarPage).addClass('triggered');

                    $(mainPage).addClass('open-window');
                    setTimeout(function () {
                        $('body').addClass('main-opened');
                    },2500);
                });
            }
        });
        // usernameValue = '';
    });


    // GET USERS
    socket.on('get users', function (data) {
        var html = '';
        for (i = 0; i < data.length; i++){
            html += '<label class="'+data[i].status+'" id="'+data[i].username+'">'+data[i].username+'</label>';
            console.log(data[i].username);
            localStorage.username = data[i].username;
        }


        $users.html(html);


        $('#users label').on('click', function(){
            $(this).toggleClass('waiting ready');
        });


        $('#users label').click(function () {
            socket.emit('valuechange', $(this).attr("class"));
        });
    });




    // USER CHECK ACTION
    socket.on('XXX', function(data){

        data.forEach(function(element) {
            if (element.status == 'ready'){
                $('#' + element.username).addClass('ready');
                $('#' + element.username).removeClass('waiting');
            } else {
                $('#' + element.username).removeClass('ready');
                $('#' + element.username).addClass('waiting');
            }
            // if ($('.custom-checkbox:checked').length == $('.custom-checkbox').length){
            //     $('#lift-page').fadeIn("slow");
            //     $('#openweathermap-widget, #windyty, #mainPage, #bgvid').fadeOut("slow");
            //
            //     counterInit();
            //
            //     setTimeout(function () {
            //         $('.lift svg').addClass('ready')
            //         audioElementLiftMusic.play();
            //     }, 10000)
            // }
        });
    });







    // LIFT MOVE
    $(document).keydown(function(e){
        if (e.keyCode == 40) {
            socket.emit('moveLift', '+=5px')
        }
        if (e.keyCode == 38) {
            socket.emit('moveLift', '-=5px');
        }

        if ($(".lift svg").css('top') < $('.lift').offset().top ) {
            $('body').css({'display' : 'none'});
            audioElementLiftMusic.pause();
            audioElementLiftArrive.play();

            setTimeout(function () {
                audioElementPeter.play();
            },500)
        }
        if ($(".lift svg").css('top') >= 600 + 'px' ) {
            $('body').css({'display' : 'none'});
            audioElementLiftMusic.pause();
            audioElementLiftArrive.play();
            setTimeout(function () {
                audioElementPeter.play();
            },500);
            setTimeout(function () {
                audioElementPeter.pause();
                audioElementLiftArrive.pause();
            },1200)
        }
    });

    socket.on('liftmove', function (data) {
        $(".lift svg").css({'top': data});
    });




    // SOCKET DEBUGGING
    // localStorage.debug = '*';
});



// Check if a user is already logged in once
function checkRecurrantUser() {
    if (localStorage.getItem("username") != null) {
        $(mainPage).removeClass('untriggered');
        $(mainPage).addClass('open-window');

        $('body').addClass('main-opened');
    }
    else {
        $(userFormPage).removeClass('untriggered');
        $(userFormPage).addClass('open-window');
    }
}
// Fill the swiping Welcome Text
function fillWelcomeText(name) {
    $(welcomeText).find('h1').append(name + '!');
}



// Trigger the loader
function loaderInit(duration) {

    if( typeof duration !== 'undefined' ) {
        var duration = duration;
    } else {
        var duration = 1000;
    }

    setTimeout(function () {
        $(loader).addClass('triggered');
    },duration);

    setTimeout(function () {
        $(loader).remove()
    },duration + transitionTime);
}









$(document).ready(function () {

    // CHECK USERNAME STORAGE
    checkRecurrantUser();

    setTimeout(function () {
        $("#" + localStorage.getItem("username")).prop('disabled', false);
    },10);
});


$(window).on('load', function () {

    // INIT LOADER
    loaderInit(0);
});

var defaultImage = "https://api.adorable.io/avatars/285/abott@";

function randomString() {
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    var string_length = 3;
    var randomstring = '';
    for (var i=0; i<string_length; i++) {
        var rnum = Math.floor(Math.random() * chars.length);
        randomstring += chars.substring(rnum,rnum+1);
    }
    return randomstring;
}
$('#avatar .submit').click(function () {

    $('#avatar img').attr("src",defaultImage + randomString() + '.png');
});