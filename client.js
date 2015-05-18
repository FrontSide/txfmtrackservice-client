/*
 * TXFMTrackService Client
 * (C) 2015 David Rieger
 */

HOST = "localhost"
PORT = "8384"

function r_all_songs() {
    console.log("request all songs...")
    try {
        $.getJSON("http://" + HOST + ":" + PORT + "/get/all", function (data) {
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
    console.log("request song at " +  datetime)
    try {
        $.getJSON("http://" + HOST + ":" + PORT + "/get/" + datetime, function (data) {
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
    console.log(data.JSON)
    $("#songlist").html("sdfsdf")
    /*Iterate Dates*/
    $.each(data, function(k, v){
        print += "<tr>"
        print += "<td>"
        print +=  k.split(" ")[0]
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

    console.log("re-render songlist")
    $("#songlist").html(print)
}

function listen_datetimesearch() {

    $('#datetimepicker1').datetimepicker({
        format: 'D.M.YYYY HH:mm:ss'
    });

    $("#datetimepicker1").on("dp.change", function (e) {
        r_song_at_datetime($("#datetimesearch").val())
    });

    $("#resetbutton").click(function(){
        r_all_songs()
    });

}

/* Print all at load */
r_all_songs()

/* Search listener */
listen_datetimesearch()
