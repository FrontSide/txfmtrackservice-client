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
            print_songs(data)
        }).fail(function() {
            return "Connection failed..."
        })
    } catch(e) {
        return "Connection failed..."
    }
}

function r_song_at_datetime(datetime) {
    try {
        $.getJSON("http://" + HOST + ":" + PORT + "/api/get/time/" + datetime, function (data) {
        }).done(function(data) {
            print_songs(data)
        }).fail(function() {
            return "Connection failed..."
        })
    } catch(e) {
        return "Connection failed..."
    }
}

function r_song_for_string(searchstring) {
    if (searchstring.trim() == "") {
        return r_all_songs()
    }
    try {
        $.getJSON("http://" + HOST + ":" + PORT + "/api/get/text/" + searchstring, function (data) {
        }).done(function(data) {
            print_songs(data)
        }).fail(function() {
            return "Connection failed..."
        })
    } catch(e) {
        return "Connection failed..."
    }
}

function print_songs(data) {
    print = ""
    $("#songlist").html("sdfsdf")
    /*Iterate Dates*/
    var lastdate = null
    $.each(data, function(k, v){
        print += "<tr>"
        print += "<td class='nobg'>"
        if (k.split(" ")[0] != lastdate) {
            print +=  "<b>" + k.split(" ")[0] + "</b>"
            lastdate = k.split(" ")[0]
        }
        print += "</td>"
        print += "<td>"
        print +=  k.split(" ")[1]
        print += "</td>"
        print += "<td>"
        print +=  v["title"]
        print += "</td>"
        print += "<td>"
        print +=  v["artist"]
        print += "</td>"
        print += "</tr>"


    })

    $("#songlist").html(print)

    $("#songlist").removeClass('loaded');

    setTimeout(function(){
      $("#songlist").addClass('loaded');
  }, 500);
}

function listen_datetimesearch() {

    $('#datetimepicker1').datetimepicker({
        format: 'D.M.YYYY HH:mm:ss'
    });

    $("#datetimepicker1").on("dp.change", function (e) {
        clearInterval(refresh_iv)
        r_song_at_datetime($("#datetimesearch").val())
    });

    $("#textsearch").on("keyup", function (e) {
        clearInterval(refresh_iv)
        r_song_for_string($("#textsearch").val())
    });

    $("#resetbutton").click(function(){
        r_all_songs()
        clearInterval(refresh_iv)
        var refresh_iv = setInterval(r_all_songs, 30000);
    });

}

/* Print all at load and in 30 sec interval */
r_all_songs()
var refresh_iv = setInterval(r_all_songs, 30000);

/* Search listener */
listen_datetimesearch()
