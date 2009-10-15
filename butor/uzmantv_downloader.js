(function(){
  try {
    var vtsearch = document.body.innerHTML.match(/v=([\w-]+)&tok=([\w-]+)/);
    if(!vtsearch||vtsearch.length!=3){
      throw Error('Video ve/veya token bulunamadi')
    }

    var nosearch = document.body.innerHTML.match(/no\=(\d+)/);
    if(!nosearch){
      throw Exception('No bulunamadi');
    }
    
    document.getElementById('vidcon').innerHTML='';

    var url = 'http://st2.uzmantv.com/c/'+vtsearch[1]+'_'+nosearch[1]+'_'+vtsearch[2]+'.flv';
    document.location.href=url;

  } catch(e){
    alert([
      'UzmanTv Video Indirici',
      'Bir hata olustu; ',
      '====',e,'====',
      'Bu scriptin yeni surumunu kontrol edin veya hatayi rapor edin.',
      'http://azer.github.com/butor/uzmantv.html'
    ].join('\n'));
  }
})();
