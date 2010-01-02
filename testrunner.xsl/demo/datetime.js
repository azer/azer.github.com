birthday = new Date("December 17, 1995 03:24:00");

var test_conv = function(){
  compare( birthday.getDate(), 17 );
}

var test_unixtime = function(){
  compare( birthday.getTime(), 819163440000 );
}
