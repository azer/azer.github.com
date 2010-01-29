var test_image = function(){
  var el = document.createElement('img');
  el.addEventListener('load',function(){
    test_image.result = true;
  },false);
  el.src = 'http://farm4.static.flickr.com/3501/3798200965_91791e1b97_m.jpg';
  document.body.appendChild( el );
}
test_image.async = true;
