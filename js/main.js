(function(){
  var S = window.SITE, page = document.body.dataset.page;
  var ST = {done:'已完成', now:'進行中', plan:'預定', tbd:'待確認'};
  var KIND = {nw:'北棟、西棟', av:'視聽文化館', small:'小工程'};
  var esc = function(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})};
  var stamp = function(s){return '<span class="stamp '+s+'">'+ST[s]+'</span>'};

  var NAV = [
    ['A-01','index.html','總表'],
    ['A-02','nw.html','北棟、西棟改建'],
    ['A-03','av.html','視聽文化館耐震補強'],
    ['A-04','chronicle.html','校園工程大事記'],
    ['A-05','faq.html','問答與聯絡']
  ];
  var cur = {home:'index.html',nw:'nw.html',av:'av.html',chronicle:'chronicle.html',faq:'faq.html'}[page];

  function sheetById(id){return S.sheets.filter(function(x){return x.id===id})[0]}

  function titleblock(sh){
    return '<table class="titleblock"><tbody>'+
      '<tr><th>工程名稱</th><td>'+esc(sh.name)+'</td><th>圖號</th><td class="no">'+sh.no+'</td></tr>'+
      '<tr><th>目前階段</th><td>'+esc(sh.stageNow)+'</td><th>更新</th><td>'+esc(S.updated)+'</td></tr>'+
      '<tr><th>辦理單位</th><td>'+esc(sh.owner)+'</td><th>完工</th><td>'+esc(sh.finish)+'</td></tr>'+
      '<tr><th>設計單位</th><td>'+esc(sh.designer)+'</td><th>施工單位</th><td>'+esc(sh.contractor)+'</td></tr>'+
      '</tbody></table>';
  }
  function stages(sh){
    return '<ol class="stages" style="--n:'+sh.stages.length+'">'+sh.stages.map(function(x){
      return '<li class="'+x.s+'"><span class="st">'+esc(x.n)+'</span><span class="w">'+esc(x.w)+'</span></li>'}).join('')+'</ol>';
  }
  function rows(list, noKind){
    return '<ul class="rows">'+list.map(function(e){
      return '<li><span class="date">'+esc(e.date)+'</span><div><div class="t">'+(noKind?'':'<span class="k">'+KIND[e.kind]+'</span>')+esc(e.title)+'</div>'+(e.d?'<p class="d">'+esc(e.d)+'</p>':'')+'</div>'+stamp(e.s)+'</li>'}).join('')+'</ul>';
  }

  var body = '';
  if(page==='home'){
    body += '<h1>內湖國小 工程專區</h1>'+
      '<p>校園目前有兩件大工程：視聽文化館正在施工，北棟、西棟改建正在完成細部設計。這裡說明各自做到哪裡，以及對上學有什麼影響。</p>'+
      '<div class="notice" role="note"><h2>'+esc(S.notice.title)+'</h2><p>'+esc(S.notice.text)+'</p></div>'+
      '<div class="two">'+S.sheets.map(function(sh){
        var ph = sh.photo ? '<img src="'+sh.photo+'" alt="'+esc(sh.photoAlt)+'">' : '施工照片待補';
        return '<section class="sheet"><div class="ph">'+ph+'</div><h2>'+esc(sh.short)+'</h2>'+stages(sh)+
          '<table class="titleblock"><tbody><tr><th>目前階段</th><td>'+esc(sh.stageNow)+'</td></tr><tr><th>完工</th><td>'+esc(sh.finish)+'</td></tr><tr><th>圖號</th><td class="no">'+sh.no+'</td></tr></tbody></table>'+
          '<a class="more" href="'+sh.page+'">看完整圖說：'+esc(sh.short)+'</a></section>'}).join('')+'</div>'+
      '<h2>最近的事</h2>'+rows(S.chronicle.slice().sort(function(a,b){return b.sort-a.sort}).filter(function(e){return e.s!=='tbd'}).slice(0,5))+
      '<p style="margin-top:1rem"><a href="chronicle.html">看全部大事記（含校內小工程）</a></p>';
  }
  if(page==='nw' || page==='av'){
    var sh = sheetById(page);
    body += '<h1>'+esc(sh.name)+'</h1>'+titleblock(sh)+'<h2>進度</h2>'+stages(sh)+
      '<h2>為什麼要做</h2>'+sh.why.map(function(w){return '<h3>'+esc(w.t)+'</h3><p>'+esc(w.d)+'</p>'}).join('');
    if(sh.buildings){
      body += '<h2>新校舍</h2>'+sh.buildings.map(function(b){
        return '<h3>'+esc(b.name)+'　<span style="font-weight:400;font-size:.95rem">'+esc(b.sub)+'｜'+esc(b.area)+'</span></h3><table class="floor"><tbody>'+
          b.floors.map(function(f){return '<tr><td>'+f[0]+'</td><td>'+esc(f[1])+'</td></tr>'}).join('')+'</tbody></table><p>'+esc(b.common)+'</p>'}).join('')+
      '<h2>施工期間（預定）</h2><ul>'+sh.during.map(function(x){return '<li>'+esc(x)+'</li>'}).join('')+'</ul><p>'+esc(sh.duringNote)+'</p>';
    } else {
      body += '<h2>補強與修繕內容</h2><table class="floor"><tbody>'+sh.scope.map(function(x){return '<tr><td style="width:6em">'+esc(x[0])+'</td><td>'+esc(x[1])+'</td></tr>'}).join('')+'</tbody></table>'+
        '<h2>施工期間</h2><p>115 年 11 月 2 日開工，預定 116 年 1 月 31 日完工。施工期間校園不開放，施工範圍以圍籬隔開。有噪音或影響上課的作業，施工前會先與學校協調時間。通行方式以學校公告為準。</p>';
    }
    if(sh.gallery){
      body += '<h2>施工照片</h2><div class="gal">'+sh.gallery.map(function(g){return '<figure><img src="'+g.file+'" alt="'+esc(g.cap)+'" loading="lazy"><figcaption>'+esc(g.cap)+'</figcaption></figure>'}).join('')+'</div>';
    }
    body += '<h2>這件工程的大事記</h2>'+rows(S.chronicle.filter(function(e){return e.kind===page}).sort(function(a,b){return b.sort-a.sort}), true);
  }
  if(page==='chronicle'){
    body += '<h1>校園工程大事記</h1><p>大工程與校內小工程放在同一條時間軸，新的在上面。</p>'+
      '<div class="filters" role="group" aria-label="篩選">'+[['all','全部'],['nw','北棟、西棟'],['av','視聽文化館'],['small','小工程']].map(function(f,i){return '<button type="button" data-f="'+f[0]+'" aria-pressed="'+(i===0)+'">'+f[1]+'</button>'}).join('')+'</div><div id="list"></div>';
  }
  if(page==='faq'){
    body += '<h1>問答與聯絡</h1><div style="margin-top:1.2rem">'+S.faq.map(function(f){return '<details><summary>'+esc(f.q)+'</summary><p>'+esc(f.a)+'</p></details>'}).join('')+'</div>'+
      '<h2>聯絡</h2><p>'+esc(S.contact.unit)+'<br>電話：'+esc(S.contact.tel)+'<br>信箱：<a href="mailto:'+S.contact.email+'">'+esc(S.contact.email)+'</a></p>';
  }

  var nav = '<nav class="index" aria-label="圖號目錄"><div class="school">'+esc(S.school)+'<br>工程專區</div><ol>'+
    NAV.map(function(n){return '<li><a href="'+n[1]+'"'+(n[1]===cur?' aria-current="page"':'')+'><span class="no">'+n[0]+'</span><span>'+n[2]+'</span></a></li>'}).join('')+'</ol></nav>';
  var foot = '<footer>'+esc(S.school)+' 總務處｜電話 '+esc(S.contact.tel)+'｜最後更新 '+esc(S.updated)+'</footer>';
  document.getElementById('app').innerHTML = nav+'<main><div class="sheet">'+body+'</div>'+foot+'</main>';

  if(page==='chronicle'){
    var all = S.chronicle.slice().sort(function(a,b){return b.sort-a.sort});
    var draw = function(f){document.getElementById('list').innerHTML = rows(all.filter(function(e){return f==='all'||e.kind===f}))};
    draw('all');
    document.querySelectorAll('.filters button').forEach(function(b){
      b.addEventListener('click',function(){
        document.querySelectorAll('.filters button').forEach(function(x){x.setAttribute('aria-pressed',x===b)});
        draw(b.dataset.f);
      });
    });
  }
})();
