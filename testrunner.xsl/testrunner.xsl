<?xml version="1.0" encoding="ISO-8859-1"?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template match="/">
  <html>
  <head>
    <style type='text/css'>
      <![CDATA[
      html, body { background:#f2f2f2; font:12px Arial,sans-serif; color:#111; padding:0px; margin:0; }
      fieldset { background:#fff; }
      fieldset legend { background:#ffff00; color:#ff0000; font-weight:bold; text-transform:uppercase;  }

      table { width:100%; height:100%; }
      table .Listwrapper { width:30%; }

      .ModuleList { height:100%; }
      .ModuleList select { width:100%; height:500px; background:#fff; padding:5px; }
      .ModuleList select option { display:block; padding:4px; font:12px Arial,sans-serif; }
      .ModuleList .Failure { background-color:rgb(255,150,150); } 
      .ModuleList .Success { background-color:rgb(150,255,150); } 

      .Log { height:100%; }
      .Log textarea { width:100%; height:100%; border:1px dotted #ccc; background-color:rgb( 240,250,250 ); color:#333; }

      .TestWindow { display:none; }
      ]]>
    </style>
    <script>
      <![CDATA[
      function init(){
        document.getElementById('run_sel').addEventListener('click',run_selected,false);
        document.getElementById('run_all').addEventListener('click',run_all,false);
        resize();
      }

      function load(option){
        log('Loading '+option.value+'..');
        var frame = document.createElement('iframe');
        frame.setAttribute('id','testwindow');
        frame.setAttribute('class','TestWindow');
        document.documentElement.appendChild(frame);
        var dependencies = option.getAttribute('dependencies').split(';');

        setTimeout(function(){
          with(frame){

            /* load dependencies */
            for(var i=-1,len=dependencies.length; ++i<len;){
             var el = document.createElement('script');   
             el.src = dependencies[i];
             contentWindow.document.documentElement.appendChild( el );
            }

            // load test script
            var test_mod = document.createElement('script');
            test_mod.src = option.value;
            contentWindow.document.documentElement.appendChild( test_mod );

            contentWindow.assert = function(expr){ if(!expr){ throw Error('Assertion Error: '+expr); }  };
            contentWindow.compare = function(){ if(arguments[0]!=arguments[1])throw Error('Comparasion Error ('+arguments[0]+' != '+arguments[1]+')')  };
            contentWindow.log = log;

            test_mod.addEventListener('load',function(){
              execute(frame,option);
            },false);
            

          }
        },50);

      }

      function execute(frame_el,option){
        // store errors
        var errors = [];
        var win = frame_el.contentWindow;
        var functions = [];

        // collect functions whose name starts width 'test' (e.g: testSomething)
        for(var key in win){
          if(key.substring(0,5)=='test_' && typeof win[ key  ] == 'function' ){
            functions.push([ win[key], key ]);
          }
        }

        // execute found functions
        var start_date=Number(new Date());
        for(var i=-1,len=functions.length; ++i<len;){
          try {
            functions[i][0]();
          } catch(e){
            errors.push( [ functions[i][1], e ] );
          }
        }
        var testduration = ((Number(new Date())-start_date)/1000)+'s';

        option.className = errors.length?'Failure':'Success';
        
        // print errors
        for(var i=-1,len=errors.length; ++i<len;){
          var error = errors[i];
          log('\n================================');
          log('ERROR: ' + error[0] + ' ('+option.value+')');
          log(error[1].name+': '+error[1].message)
          log( '-------------------------------');
          log( error[1].stack );
          log( '-------------------------------');
          log('================================\n');
        }

        // print test result
        log(option.value+': Ran '+functions.length+' tests in '+testduration);
        if(errors.length)
          log(option.value+': FAILED(errors='+errors.length+')');
        else
          log(option.value+': OK.');
        
        // remove frame
        setTimeout(function(){
          document.documentElement.removeChild( frame_el  );
        },100);
      }

      function run_selected(){
        document.getElementById('logview').value='';
        var list = document.getElementById('module_list');
        var option = list.options[list.selectedIndex];
        list.selectedIndex = -1;
        load(option);
      }

      function run_all(){
        document.getElementById('logview').value='';
        var list = document.getElementById('module_list');
        for(var i=-1,len=list.options.length; ++i<len;){
          var option = list.options[i];
          load(option);
        }
      }

      function log(){
        var rec = Array.prototype.join.call( arguments, ' ');
        var logview = document.getElementById('logview');
        logview.value+=rec+'\n';
      }

      function resize(){
        var vpheight=Math.max( document.body.clientHeight, document.documentElement.clientHeight );
        var modlist = document.getElementById('module_list');
        var monitor = document.getElementById('logview');
        monitor.style.height=vpheight-62+'px';
        modlist.style.height=vpheight-70+'px';
      }

      window.addEventListener('DOMContentLoaded',init,false);
      window.addEventListener('resize',resize,false);
      ]]>
    </script>
  </head>
  <body>
    <table>
      <tr>
        <td class='ListWrapper'>
          <fieldset class='ModuleList'>
            <legend>Test Cases</legend>
            <select id='module_list' multiple='true'>
              <xsl:for-each select="testcases/case">
              <option>
                <xsl:attribute name="dependencies">
                  <xsl:for-each select="dependency">
                    <xsl:value-of select="@src" />;
                  </xsl:for-each>
                </xsl:attribute>
                <xsl:value-of select='file/@src' />
              </option>
              </xsl:for-each>
            </select>
            <button id='run_sel'>Run Selected</button>
            <button id='run_all'>Run All</button>
          </fieldset>
        </td>
        <td>
          <fieldset class='Log'>
            <legend>MONITOR</legend>
            <textarea id='logview'></textarea>
          </fieldset>
        </td>
      </tr>
    </table>
  </body>
  </html>
</xsl:template>

</xsl:stylesheet>
