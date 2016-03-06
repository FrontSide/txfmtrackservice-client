/*
 * TXFMTrackService Client
 * (C) 2015 David Rieger
 */

HOST = host_config.host
PORT = host_config.port

function r_all_songs() {
    try {
        $.getJSON("http://" + HOST + ":" + PORT + "/api/get/all", function (data) {
        }).done(function(data) {
            print_songs(data, true, true)
            remove_loading_msg()
        }).fail(function() {
            return "Connection failed..."
        })
    } catch(e) {
        return "Connection failed..."
    }
}

function r_song_at_datetime(datetime, EXTENSIVE) {

    fetch_cmd = "get"
    enforce_load_msg_removal = true
    if (EXTENSIVE == true) {
        fetch_cmd = "full"
        append_loading_msg()
        enforce_load_msg_removal = true
    }

    try {
        $.getJSON("http://" + HOST + ":" + PORT + "/api/" + fetch_cmd + "/time/" + datetime, function (data) {
        }).done(function(data) {
            print_songs(data, false, enforce_load_msg_removal)
        }).fail(function() {
            return "Connection failed..."
        })
    } catch(e) {
        return "Connection failed..."
    }
}

searchstring_last_value = "" // Aren't global variables beautiful
function string_ext_check(){
    /* For performance reasons, extensive search is only conducted
     * if nothing has been changed in the search field.
     * This is checked here and upon success, the extensive earch is invoked
     * Clears the given interval (with which it was invoked, hopefully) if the search has started
     */
    searchstring_current_value = $("#textsearch").val().trim()
    if (searchstring_last_value == searchstring_current_value) {
        r_song_for_string(searchstring_current_value, true)
        stop_stringsearch_interval()
        searchstring_last_value = ""
    }
    searchstring_last_value = searchstring_current_value

}

function r_song_for_string(searchstring, EXTENSIVE) {

    if (searchstring.trim() == "") {
        start_refresh_interval();
        r_all_songs()
        return
    }

    enforce_load_msg_removal = false
    fetch_cmd = "get"
    if (EXTENSIVE == true) {
        fetch_cmd = "full"
        append_loading_msg()
        enforce_load_msg_removal = true
    }

    try {
        $.getJSON("http://" + HOST + ":" + PORT + "/api/" + fetch_cmd + "/text/" + searchstring, function (data) {
        }).done(function(data) {
            console.log("Connection successful")
            print_songs(data, false, enforce_load_msg_removal)
        }).fail(function() {
            console.log("Connection Failure")
        })
    } catch(e) {
        console.log("Connection Failure")
    }

}

function append_loading_msg() {
    row = document.createElement('tr');
    cell = document.createElement('td');
    console.log("show load...")

    if (!$("#loading-cell").length) {
        $(cell).addClass("bluebg loading-cell").html("Loading...").appendTo(row)
        return $(row).attr("id", "loading-cell").appendTo("#loadingtable")
    }
}

function remove_loading_msg() {
    if ($("#loading-cell").length) {
        console.log("hide load...")
        $("#loading-cell").remove()
    }
}

var current_song_time
function print_songs(data, highlightFirst, enforce_load_msg_removal) {
    console.log("rendering...")

    //Iterate Dates
    var lastdate = null
    var first = true;
    var EXIT_EXECUTION = false

    var _num_elements = Object.keys(data).length
    $.each(data, function(k, v){
        var this_date = k.split(" ")[0]
        var this_time = k.split(" ")[1].split(":").slice(0,2).join(":")

        if (!highlightFirst) {
            current_song_time = false
        }

        row = document.createElement('tr');

        if (first){
            first = false;

            /* Dont't refresh if song hasn't changes */
            if (this_time == current_song_time) {
                console.log("this time is current time")
                EXIT_EXECUTION = true;
                return false //Only if return !false! the each loop is exited!
            } else {
                $("#songlist").html("")
            }

            current_song_time = this_time

            if (highlightFirst){
                $(row).addClass("tr-first")
            }

        }

        $(row).appendTo("#songlist")

        cell = document.createElement('td');
        $(cell).addClass("nobg").appendTo(row)

        if (this_date != lastdate) {
            $(cell).html("<b>" + this_date + "</b>")
            lastdate = this_date
        }

        cell = document.createElement('td');
        $(cell).appendTo(row).html(this_time)

        cell = document.createElement('td');
        $(cell).appendTo(row).html(v["title"])

        cell = document.createElement('td');
        $(cell).appendTo(row).html(v["artist"])

        if (!--_num_elements && enforce_load_msg_removal) {
            remove_loading_msg()
        }

    })

    if (EXIT_EXECUTION) {
        return;
    }

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

    console.log("Starting...")

    $('#datetimepicker1').datetimepicker({
        format: 'D.M.YYYY HH:mm:ss'
    });

    $("#datetimepicker1").on("dp.change", function (e) {
        stop_refresh_interval()
        r_song_at_datetime($("#datetimesearch").val())
        append_loading_msg()
        r_song_at_datetime($("#datetimesearch").val(), true) //Extensive
    });

    $("#textsearch").on("keyup", function (e) {
        stop_refresh_interval()

        append_loading_msg()
        r_song_for_string($("#textsearch").val())

        start_stringsearch_interval() // for extensive search

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

var stringsearch_iv
function start_stringsearch_interval() {
    clearInterval(stringsearch_iv)
    stringsearch_iv = setInterval(string_ext_check, 2000)
}

function stop_stringsearch_interval() {
    clearInterval(stringsearch_iv)
}

$(document).ready( function() {
    startup()
})
