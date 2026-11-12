const STORAGE_KEY = 'zhijian-novel-lab-v1';
const starter = {
  id: 'suzhou-rain', title: 'Mùa mưa ở Tô Châu', subtitle: 'Một câu chuyện nhỏ ở thành phố bên sông', level: 'Sơ cấp–Trung cấp', tags: ['城市','重逢','日常'],
  chapters: [
    {title:'Cơn mưa đầu mùa', zh:'雨停的时候，苏州的巷子里还留着淡淡的水汽。林晚推开旧书店的门，风铃轻轻响了一声。她没有想到，那个多年未见的人，会坐在窗边等她。', vi:'Khi cơn mưa dứt, trong những con ngõ ở Tô Châu vẫn còn vương chút hơi nước. Lâm Vãn đẩy cửa hiệu sách cũ, chiếc chuông gió khẽ ngân lên. Cô không ngờ người đã nhiều năm không gặp ấy lại đang ngồi bên cửa sổ chờ mình.', words:[['巷子','xiàngzi · danh từ','con ngõ'],['风铃','fēnglíng · danh từ','chuông gió'],['多年未见','duōnián wèijiàn · cụm từ','nhiều năm không gặp']]},
    {title:'Chiếc ô màu xanh', zh:'窗外的雨又下了起来。周远站起身，把一把蓝色的伞递给她。“你还是忘了带伞。”他说。林晚笑了笑，发现有些话虽然隔了很多年，却仍然像昨天一样熟悉。', vi:'Ngoài cửa sổ, mưa lại bắt đầu rơi. Chu Viễn đứng dậy, đưa cho cô một chiếc ô màu xanh. “Em vẫn quên mang ô nhỉ,” anh nói. Lâm Vãn khẽ cười, nhận ra có những lời dù cách xa bao năm vẫn thân thuộc như mới hôm qua.', words:[['递给','dìgěi · động từ','đưa cho'],['忘了带','wàng le dài · cụm từ','quên mang theo'],['熟悉','shúxī · tính từ','thân thuộc']]},
    {title:'Con đường ven sông', zh:'他们沿着河边慢慢往前走。雨后的灯光映在水面上，像一封没有写完的信。周远问她这些年过得怎么样。林晚看着远处的桥，轻声回答：“还好，只是偶尔会想起这里。”', vi:'Họ thong thả bước dọc bờ sông. Ánh đèn sau mưa in xuống mặt nước, như một bức thư còn viết dở. Chu Viễn hỏi những năm qua cô sống thế nào. Lâm Vãn nhìn cây cầu phía xa, khẽ đáp: “Cũng ổn, chỉ là đôi khi em nhớ nơi này.”', words:[['沿着','yánzhe · giới từ','dọc theo'],['映在','yìng zài · động từ','in trên'],['偶尔','ǒu’ěr · phó từ','thỉnh thoảng']]}
  ]
};
let state = loadState();
let currentStoryId = state.currentStoryId || starter.id;
let chapterIndex = 0;
let mode = state.mode || 'zh-vi';
let vocabVisible = true;

function loadState(){try{return JSON.parse(localStorage.getItem(STORAGE_KEY))||{stories:[],answers:{},bookmarks:[]}}catch{return{stories:[],answers:{},bookmarks:[]}}}
function saveState(){localStorage.setItem(STORAGE_KEY,JSON.stringify(state))}
function stories(){return [starter,...(state.stories||[])]}
function currentStory(){return stories().find(s=>s.id===currentStoryId)||starter}
function chapter(){return currentStory().chapters[chapterIndex]||currentStory().chapters[0]}
function answerKey(){return `${currentStoryId}:${chapterIndex}:${mode}`}
function byId(id){return document.getElementById(id)}

function renderChapter(){
 const story=currentStory(), ch=chapter();
 byId('crumbStory').textContent=story.title.toLocaleUpperCase('vi');
 byId('chapterTitle').textContent=ch.title; byId('chapterSubtitle').textContent=story.subtitle||'Một câu chuyện để luyện tiếng Trung';
 byId('chapterMeta').textContent=`CHƯƠNG ${String(chapterIndex+1).padStart(2,'0')} · 5 PHÚT`;
 byId('sourceText').textContent=mode==='zh-vi'?ch.zh:ch.vi;
 byId('sourceText').classList.toggle('chinese-text',mode==='zh-vi'); byId('sourceText').lang=mode==='zh-vi'?'zh':'vi';
 byId('sourceLanguage').textContent=mode==='zh-vi'?'VĂN BẢN TIẾNG TRUNG':'VĂN BẢN TIẾNG VIỆT';
 byId('answerTitle').textContent=mode==='zh-vi'?'Viết bản dịch tiếng Việt':'Viết lại bằng tiếng Trung';
 byId('answerInput').placeholder=mode==='zh-vi'?'Hãy viết cách bạn hiểu đoạn văn này...':'用中文写下你对这段文字的理解…';
 byId('hintText').textContent=mode==='zh-vi'?ch.vi:ch.zh;
 byId('hintPanel').classList.add('hidden');
 byId('answerInput').value=(state.answers||{})[answerKey()]||'';
 updateAnswerStatus();
 byId('wordCount').textContent=`${Array.from(ch.zh).length} 字`;
 byId('progressLabel').textContent=`ĐOẠN ${String(chapterIndex+1).padStart(2,'0')} / ${String(story.chapters.length).padStart(2,'0')}`;
 byId('progressBar').style.width=`${((chapterIndex+1)/story.chapters.length)*100}%`;
 byId('prevBtn').disabled=chapterIndex===0; byId('nextBtn').disabled=chapterIndex===story.chapters.length-1;
 byId('railTitle').textContent=story.title;
 byId('vocabList').innerHTML=(ch.words||[]).map(w=>`<div class="vocab-row"><div><b>${escapeHtml(w[0])}</b><small>${escapeHtml(w[1])}</small></div><span>${escapeHtml(w[2])}</span></div>`).join('')||'<div class="vocab-row"><span>Chưa có từ vựng cho đoạn này</span></div>';
 byId('vocabList').classList.toggle('hidden',!vocabVisible); byId('vocabToggle').innerHTML=vocabVisible?'Ẩn từ gợi ý <span>⌃</span>':'Hiện từ gợi ý <span>⌄</span>';
 byId('bookmarkBtn').classList.toggle('saved',(state.bookmarks||[]).includes(`${currentStoryId}:${chapterIndex}`));
 document.querySelectorAll('.mode-option').forEach(b=>b.classList.toggle('selected',b.dataset.mode===mode));
 byId('storyNav').innerHTML=stories().map(s=>`<button class="story-link ${s.id===currentStoryId?'current':''}" data-story="${s.id}"><span class="story-dot"></span>${escapeHtml(s.title)}<small>${String(s.chapters.length).padStart(2,'0')}</small></button>`).join('');
 byId('storyCount').textContent=String(stories().length).padStart(2,'0');
 byId('streakLabel').textContent=Object.keys(state.answers||{}).length?'Bạn đang giữ nhịp học':'Bắt đầu hành trình';
 byId('statPassages').textContent=Object.keys(state.answers||{}).filter(k=>state.answers[k].trim()).length;
 byId('statStories').textContent=stories().length; byId('statMode').textContent=mode==='zh-vi'?'中 → 越':'越 → 中';
}
function updateAnswerStatus(){const has=(byId('answerInput').value||'').trim();byId('answerStatus').classList.toggle('done',!!has);byId('answerStatus').innerHTML=has?'<i></i> ĐÃ CÓ BẢN DỊCH':'<i></i> CHƯA HOÀN THÀNH';}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function toast(msg){const t=byId('toast');t.textContent=msg;t.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove('show'),2200)}
function showView(which){document.querySelectorAll('.view').forEach(v=>v.classList.add('hidden'));byId(which+'View').classList.remove('hidden');document.querySelectorAll('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.view===which));if(which==='library')renderLibrary()}
function renderLibrary(){byId('libraryGrid').innerHTML=stories().map(s=>`<article class="library-card" data-story-card="${s.id}"><div class="library-cover">${s.id==='suzhou-rain'?'雨落苏州':'故事'}</div><h3>${escapeHtml(s.title)}</h3><p>${s.chapters.length} đoạn · ${escapeHtml(s.level||'Truyện do bạn thêm')}</p></article>`).join('');}
function openDialog(){byId('addDialog').showModal()}

document.querySelectorAll('.nav-item').forEach(b=>b.addEventListener('click',()=>showView(b.dataset.view)));
document.querySelectorAll('.mode-option').forEach(b=>b.addEventListener('click',()=>{mode=b.dataset.mode;state.mode=mode;saveState();renderChapter()}));
byId('answerInput').addEventListener('input',()=>{state.answers=state.answers||{};state.answers[answerKey()]=byId('answerInput').value;saveState();updateAnswerStatus()});
byId('checkBtn').addEventListener('click',()=>{state.answers=state.answers||{};state.answers[answerKey()]=byId('answerInput').value;saveState();updateAnswerStatus();toast(byId('answerInput').value.trim()?'Đã lưu bản dịch trên thiết bị này.':'Hãy viết vài dòng trước nhé.')});
byId('revealBtn').addEventListener('click',()=>{byId('hintPanel').classList.remove('hidden');byId('hintPanel').scrollIntoView({behavior:'smooth',block:'nearest'})});
byId('hideHint').addEventListener('click',()=>byId('hintPanel').classList.add('hidden'));
byId('prevBtn').addEventListener('click',()=>{if(chapterIndex>0){chapterIndex--;renderChapter()}});
byId('nextBtn').addEventListener('click',()=>{if(chapterIndex<currentStory().chapters.length-1){chapterIndex++;renderChapter()}});
byId('bookmarkBtn').addEventListener('click',()=>{state.bookmarks=state.bookmarks||[];const key=`${currentStoryId}:${chapterIndex}`;state.bookmarks=state.bookmarks.includes(key)?state.bookmarks.filter(x=>x!==key):[...state.bookmarks,key];saveState();renderChapter();toast(state.bookmarks.includes(key)?'Đã lưu đoạn vào mục yêu thích.':'Đã bỏ lưu đoạn này.')});
byId('vocabToggle').addEventListener('click',()=>{vocabVisible=!vocabVisible;byId('vocabList').classList.toggle('hidden',!vocabVisible);byId('vocabToggle').innerHTML=vocabVisible?'Ẩn từ gợi ý <span>⌃</span>':'Hiện từ gợi ý <span>⌄</span>'});
byId('listenBtn').addEventListener('click',()=>{if(!('speechSynthesis'in window)){toast('Trình duyệt này chưa hỗ trợ đọc văn bản.');return}speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(chapter().zh);u.lang='zh-CN';u.rate=.82;speechSynthesis.speak(u)});
byId('openAdd').addEventListener('click',openDialog);byId('addPassage').addEventListener('click',openDialog);byId('libraryAdd').addEventListener('click',openDialog);
byId('addForm').addEventListener('submit',e=>{e.preventDefault();const title=byId('newStoryTitle').value.trim(),chapterTitle=byId('newChapterTitle').value.trim(),zh=byId('newChinese').value.trim(),vi=byId('newVietnamese').value.trim();if(!title||!chapterTitle||!zh||!vi)return;const id='story-'+Date.now();state.stories=[...(state.stories||[]),{id,title,subtitle:'Đoạn truyện do bạn thêm',level:'Nội dung cá nhân',tags:['我的故事'],chapters:[{title:chapterTitle,zh,vi,words:[]}]}];state.currentStoryId=id;currentStoryId=id;chapterIndex=0;saveState();byId('addDialog').close();e.target.reset();showView('reader');renderChapter();toast('Đã thêm truyện vào thư viện.')});
byId('storyNav').addEventListener('click',e=>{const b=e.target.closest('[data-story]');if(!b)return;currentStoryId=b.dataset.story;chapterIndex=0;state.currentStoryId=currentStoryId;saveState();showView('reader');renderChapter()});
byId('libraryGrid').addEventListener('click',e=>{const card=e.target.closest('[data-story-card]');if(!card)return;currentStoryId=card.dataset.storyCard;chapterIndex=0;state.currentStoryId=currentStoryId;saveState();showView('reader');renderChapter()});
byId('mobileMenu').addEventListener('click',()=>byId('sidebar').classList.toggle('open'));
document.addEventListener('click',e=>{if(e.target.closest('.nav-item')&&innerWidth<860)byId('sidebar').classList.remove('open')});
renderChapter();
