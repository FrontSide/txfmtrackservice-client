/*
 * TXFMTrackService Client
 * (C) 2015 David Rieger
 */

HOST = "www.txfmtrack.com"
PORT = "80"

function r_all_songs() {
    try {
        $.getJSON("http://" + HOST + ":" + PORT + "/api/get/all", function (data) {
        }).done(function(data) {
            print_songs(data ,true)
        }).fail(function() {
            return "Connection failed..."
        })
    } catch(e) {
        return "Connection failed..."
    }
}

function r_song_at_datetime(datetime, EXTENSIVE) {

    fetch_cmd = "get"
    if (EXTENSIVE == true) {
        fetch_cmd = "full"
    }

    try {
        $.getJSON("http://" + HOST + ":" + PORT + "/api/" + fetch_cmd + "/time/" + datetime, function (data) {
        }).done(function(data) {
            print_songs(data)
        }).fail(function() {
            return "Connection failed..."
        })
    } catch(e) {
        return "Connection failed..."
    }
}

function r_song_for_string(searchstring, EXTENSIVE) {

    if (searchstring.trim() == "") {
        start_refresh_interval();
        return r_all_songs()
    }

    fetch_cmd = "get"
    if (EXTENSIVE == true) {
        fetch_cmd = "full"
    }

    try {
        $.getJSON("http://" + HOST + ":" + PORT + "/api/" + fetch_cmd + "/text/" + searchstring, function (data) {
        }).done(function(data) {
            print_songs(data)
        }).fail(function() {
            return "Connection failed..."
        })
    } catch(e) {
        return "Connection failed..."
    }
}

var current_song_time
function print_songs(data, highlightFirst) {
    print = ""
    /*Iterate Dates*/
    var lastdate = null
    var first = true;
    var EXIT_EXECUTION = false
    $.each(data, function(k, v){

        var this_date = k.split(" ")[0]
        var this_time = k.split(" ")[1]

        if (!highlightFirst) {
            current_song_time = false
        }

        if (first && highlightFirst){

            first = false;

            /* Dont't refresh if song hasn't changes */
            if (this_time == current_song_time) {
                EXIT_EXECUTION = true;
                return;
            }

            current_song_time = this_time

            print += "<tr class='tr-first'>"

        } else {
            print += "<tr>"
        }
        print += "<td class='nobg'>"
        if (this_date != lastdate) {
            print +=  "<b>" + this_date + "</b>"
            lastdate = this_date
        }
        print += "</td>"
        print += "<td>"
        print +=  this_time
        print += "</td>"
        print += "<td>"
        print +=  v["title"]
        print += "</td>"
        print += "<td>"
        print +=  v["artist"]
        print += "</td>"
        print += "</tr>"


    })

    if (EXIT_EXECUTION) {
        return;
    }

    $("#songlist").html(print)

    $("tr.tr-first").removeClass('loaded');
    $("#songlist").removeClass('loaded');

    setTimeout(function(){
      $("#songlist").addClass('loaded');
      $("tr.tr-first").addClass('loaded');
  }, 500);
}

function startup() {

    /* Print all at load and in 30 sec interval */
    r_all_songs()
    start_refresh_interval();

    $('#datetimepicker1').datetimepicker({
        format: 'D.M.YYYY HH:mm:ss'
    });

    $("#datetimepicker1").on("dp.change", function (e) {
        stop_refresh_interval()
        r_song_at_datetime($("#datetimesearch").val())
        r_song_at_datetime($("#datetimesearch").val(), true) //Extensive
    });

    $("#textsearch").on("keyup", function (e) {
        stop_refresh_interval()
        r_song_for_string($("#textsearch").val())
        r_song_for_string($("#textsearch").val(), true) //Extensive
    });

    $("#resetbutton").click(function(){
        r_all_songs()
        start_refresh_interval()
    });

}

var refresh_iv
function start_refresh_interval() {
    clearInterval(refresh_iv)
    refresh_iv = setInterval(r_all_songs, 30000)
}

function stop_refresh_interval() {
    clearInterval(refresh_iv)
}

startup()
