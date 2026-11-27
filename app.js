/* app.js - MangaZERO
   Every inline executable <script> block from the single-file build, in
   original order, code unchanged. Loaded as a classic script (no type=module)
   so inline handlers such as onclick="openMangaPage(...)" still resolve
   against the global scope. 6 blocks. */

/* ===== inline script 1 of 6 | original line 3143 | <script > ===== */

"use strict";

// Global admin email for comment/profile code defined outside the main app scope.
// The main app also has a local ADMIN_EMAIL constant; this global keeps earlier
// comment handlers from throwing "ADMIN_EMAIL is not defined".
var ADMIN_EMAIL = "maxking1789@gmail.com";

// Title helper used by the early comments script.
// The main app defines normalizeTitle later in a separate script scope,
// so comments must not depend on that later function.
function mzCommentNormalizeTitle(t){
    if(Array.isArray(t)){ t=t[0]; }
    var x=String(t||"member").toLowerCase();
    return ["admin","moderator","supporter","member","veteran"].indexOf(x)>=0 ? x : "member";
}
function mzGetUserTitles(data){
    var arr=Array.isArray(data)?data:(data&&Array.isArray(data.titles)?data.titles:(data&&data.title?[data.title]:[]));
    arr=arr.map(function(x){return mzCommentNormalizeTitle(x);}).filter(function(x,i,a){return a.indexOf(x)===i;});
    if(!arr.length)arr=['member'];
    return arr.slice(0,2);
}
window.mzGetUserTitles=mzGetUserTitles;
window.mzCommentNormalizeTitle=mzCommentNormalizeTitle;

/* =========================================
   فلتر الكلام غير المناسب (بدون أي مفتاح أو سيرفر)
========================================= */
var MZ_BAD_WORDS=[
    "كسمك","كسم","كسها","كسمو","شرموط","شرموطه","شراميط","طيز","زبك","زبي","نياك","متناك","منيك","عرص","معرص",
    "قحبه","قحاب","عاهره","خول","خولات","زباله","حقير","حقيره","حيوان","حمار","غبي","غبيه","تافه","كلب","كلاب",
    "يلعن","لعنه","لعنة","ابن الكلب","ولد الكلب","شرموطة",
    "fuck","fucking","fucker","shit","bitch","asshole","dick","pussy","whore","slut","bastard","nigga","nigger","cunt"
];
var MZ_BAD_SHORT=["كس","زب","خرا","نيك"];

function mzNormalizeArabic(t){
    return String(t||"")
        .toLowerCase()
        .replace(/[\u064B-\u0652\u0640]/g,"")
        .replace(/[\u0623\u0625\u0622]/g,"\u0627")
        .replace(/\u0649/g,"\u064A")
        .replace(/\u0629/g,"\u0647")
        .replace(/[\u0624\u0626]/g,"\u0621")
        .replace(/(.)\1{2,}/g,"$1$1");
}

function mzHasBadWord(text){
    var n=mzNormalizeArabic(text);
    var compact=n.replace(/[^a-z\u0621-\u064A0-9]/g,"");
    var i,w;
    for(i=0;i<MZ_BAD_WORDS.length;i++){
        w=MZ_BAD_WORDS[i];
        if(n.indexOf(w)>=0||compact.indexOf(w)>=0)return true;
    }
    for(i=0;i<MZ_BAD_SHORT.length;i++){
        w=MZ_BAD_SHORT[i];
        try{
            var re=new RegExp("(^|[^\\p{L}\\p{N}])"+w+"([^\\p{L}\\p{N}]|$)","u");
            if(re.test(n))return true;
        }catch(e){
            if(n.indexOf(" "+w)>-1||n.indexOf(w+" ")>-1)return true;
        }
    }
    return false;
}
window.mzHasBadWord=mzHasBadWord;
window.MZ_BAD_WORDS=MZ_BAD_WORDS;


window.normalizeTitle=mzCommentNormalizeTitle;
// Hard fallback for any legacy handler that resolves normalizeTitle globally.
if(typeof window.normalizeTitle!=='function'){ window.normalizeTitle=mzCommentNormalizeTitle; }



/* =========================================
   DATA
========================================= */

const MZ_CLOUDINARY_CLOUD_NAME = "clx07ido";
const MZ_CLOUDINARY_UPLOAD_PRESET = "mangazero_chapters";
const MZ_CLOUDINARY_UPLOAD_URL =
    "https://api.cloudinary.com/v1_1/" +
    MZ_CLOUDINARY_CLOUD_NAME +
    "/image/upload";

let mangaList = [];


/* =========================================
   LOAD DATA
========================================= */

try {

    const saved =
        localStorage.getItem(
            "mangaZERO_manga"
        );


    if(saved){

        mangaList =
            JSON.parse(saved);

    }


    if(!Array.isArray(mangaList)){

        mangaList = [];

    }

}
catch(error){

    console.error(
        "خطأ في تحميل البيانات:",
        error
    );

    mangaList = [];

}


normalizeMangaData();

/* =========================================
   ELEMENTS
========================================= */

const sitePage =
    document.getElementById(
        "sitePage"
    );

const adminPage =
    document.getElementById(
        "adminPage"
    );

const adminButton =
    document.getElementById(
        "adminButton"
    );

const exitAdmin =
    document.getElementById(
        "exitAdmin"
    );

const searchInput =
    document.getElementById(
        "searchInput"
    );

const homeMangaGrid =
    document.getElementById(
        "homeMangaGrid"
    );

const adminMangaGrid =
    document.getElementById(
        "adminMangaGrid"
    );

const emptyLibrary =
    document.getElementById(
        "emptyLibrary"
    );

const adminEmpty =
    document.getElementById(
        "adminEmpty"
    );

const homeMangaCount =
    document.getElementById(
        "homeMangaCount"
    );

const mangaCount =
    document.getElementById(
        "mangaCount"
    );

const chapterCount =
    document.getElementById(
        "chapterCount"
    );

const addHeader =
    document.getElementById(
        "addHeader"
    );

const addForm =
    document.getElementById("addForm");

const addPlus =
    document.getElementById("addPlus");

const saveManga =
    document.getElementById("saveManga");

const toast =
    document.getElementById("toast");

const mangaPage=document.getElementById("mangaPage");
const mangaPageBack=document.getElementById("mangaPageBack");
const mangaPageTitle=document.getElementById("mangaPageTitle");
const mangaDetailBox=document.getElementById("mangaDetailBox");
const publicChapterList=document.getElementById("publicChapterList");
const chapterListView=document.getElementById("chapterListView");
const chapterReader=document.getElementById("chapterReader");
const readerBack=document.getElementById("readerBack");
const readerTitle=document.getElementById("readerTitle");
const readerPages=document.getElementById("readerPages");


/* =========================================
   TOAST
========================================= */

let toastTimer = null;

function showToast(message){

    if(!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(function(){
        toast.classList.remove("show");
    }, 2200);
}


/* =========================================
   SAVE DATA
========================================= */

function saveData(){
    try{
        localStorage.setItem("mangaZERO_manga", JSON.stringify(mangaList));
        if(window.mzSyncMangaToCloud) window.mzSyncMangaToCloud().catch(function(e){console.error("Cloud sync failed:",e);});
    }catch(error){
        console.error("خطأ في حفظ البيانات:", error);
        showToast("حدث خطأ أثناء حفظ البيانات");
    }
}


/* =========================================
   OPEN ADMIN
========================================= */

async function openAdmin(){
    if(!((window.mzIsAdmin&&window.mzIsAdmin())||window.mzRole==="helper")){showToast("الدخول للوحة الإدارة غير مسموح");return}
    sitePage.style.display = "none";
    adminPage.style.display = "block";

    window.scrollTo(0, 0);

    showAdminSection("manga");

    try{
        history.pushState(
            {admin:true},
            "",
            "#admin"
        );
    }catch(error){
        console.log(error);
    }
}


/* =========================================
   CLOSE ADMIN
========================================= */

function closeAdmin(){

    adminPage.style.display = "none";
    sitePage.style.display = "block";

    window.scrollTo(0, 0);

    try{
        if(location.hash === "#admin"){
            history.replaceState(
                {},
                "",
                window.location.pathname +
                window.location.search
            );
        }
    }catch(error){
        console.log(error);
    }
}


/* =========================================
   ADMIN BUTTON
========================================= */

if(adminButton){

    adminButton.addEventListener(
        "click",
        openAdmin
    );

}


/* =========================================
   EXIT ADMIN
========================================= */

if(exitAdmin){

    exitAdmin.addEventListener(
        "click",
        closeAdmin
    );

}


/* =========================================
   BACK BUTTON
========================================= */

window.addEventListener(
    "popstate",
    function(){

        if(adminPage.style.display === "block"){

            adminPage.style.display = "none";
            sitePage.style.display = "block";

        }

    }
);


/* =========================================
   ADMIN SECTIONS
========================================= */

function showAdminSection(section){

    const sections = {

        manga:
            document.getElementById("mangaSection"),

        reports:
            document.getElementById("reportsSection"),

        support:
            document.getElementById("supportSection"),

        users:
            document.getElementById("usersSection"),

        bans:
            document.getElementById("bansSection"),

        helpers:
            document.getElementById("helpersSection"),

        tasks:
            document.getElementById("tasksSection")

    };


    Object.keys(sections).forEach(
        function(key){

            if(!sections[key]) return;

            sections[key].style.display =
                key === section
                ? "block"
                : "none";

        }
    );


    document
        .querySelectorAll("[data-admin-nav]")
        .forEach(
            function(button){

                button.classList.toggle(
                    "active",
                    button.dataset.adminNav === section
                );

            }
        );


    document
        .querySelectorAll("[data-admin-tab]")
        .forEach(
            function(button){

                button.classList.toggle(
                    "active",
                    button.dataset.adminTab === section
                );

            }
        );

}


/* =========================================
   ADMIN NAV
========================================= */

document
    .querySelectorAll("[data-admin-nav]")
    .forEach(
        function(button){

            button.addEventListener(
                "click",
                function(){

                    showAdminSection(button.dataset.adminNav);
                    if(window.refreshAdminData)window.refreshAdminData();

                }
            );

        }
    );


/* =========================================
   ADMIN TABS
========================================= */

document
    .querySelectorAll("[data-admin-tab]")
    .forEach(
        function(button){

            button.addEventListener(
                "click",
                function(){

                    showAdminSection(button.dataset.adminTab);
                    if(window.refreshAdminData)window.refreshAdminData();

                }
            );

        }
    );


/* =========================================
   ADD FORM
========================================= */

if(addHeader){

    addHeader.addEventListener(
        "click",
        function(){

            addForm.classList.toggle("open");

            if(addForm.classList.contains("open")){

                addPlus.textContent = "−";

            }else{

                addPlus.textContent = "＋";

            }

        }
    );

}


/* =========================================
   ADD MANGA
========================================= */
function readFileAsDataURL(file){return new Promise(function(resolve,reject){if(!file){resolve("");return;}const r=new FileReader();r.onload=function(){resolve(r.result)};r.onerror=reject;r.readAsDataURL(file);});}
if(saveManga){saveManga.addEventListener("click",async function(){if(!window.mzCanManageManga||!window.mzCanManageManga()){showToast("هذه الخاصية للأدمن أو المساعدين فقط");return;}const n=document.getElementById("mangaName"),a=document.getElementById("mangaAuthor"),d=document.getElementById("mangaDescription"),c=document.getElementById("mangaCover");const name=n.value.trim();if(!name){showToast("اكتب اسم المانجا الأول");n.focus();return;}saveManga.disabled=true;saveManga.textContent="جاري إضافة المانجا...";try{const cover=c.files[0]?await readFileAsDataURL(c.files[0]):"";const manga={id:Date.now(),name:name,author:a.value.trim()||"غير معروف",description:d.value.trim()||"لا يوجد وصف",cover:cover,chapters:[],views:0,createdAt:Date.now()};mangaList.push(manga);localStorage.setItem("mangaZERO_manga",JSON.stringify(mangaList));if(window.mzSaveMangaToCloud)await window.mzSaveMangaToCloud(manga);n.value="";a.value="";d.value="";c.value="";addForm.classList.remove("open");addPlus.textContent="＋";renderManga();showToast("تمت إضافة المانجا بنجاح وظهرت على الجميع ✅");}catch(e){console.error(e);showToast("تعذر حفظ المانجا على Firebase");}finally{saveManga.disabled=false;saveManga.textContent="➕ إضافة المانجا";}});}

/* =========================================
   CREATE MANGA CARD
========================================= */
let currentBrowseMode="home";
function getChapterCount(m){return Array.isArray(m.chapters)?m.chapters.length:Number(m.chapters||0);}
function getLocalViewCount(m){return Math.max(0,Number(m&&m.views||0));}
function normalizeMangaData(){let changed=false;mangaList.forEach(function(m){if(!Array.isArray(m.chapters)){m.chapters=[];changed=true;}if(typeof m.cover!=="string"){m.cover="";changed=true;}if(typeof m.views!=="number"){m.views=Number(m.views||0);changed=true;}});if(changed)saveData();}
function createMangaCard(manga,isAdmin){const card=document.createElement("div");card.className="manga-card";card.setAttribute("role","button");card.setAttribute("tabindex","0");card.style.cursor="pointer";const cover=document.createElement("div");cover.className="manga-cover";if(manga.cover){cover.classList.add("has-image");const img=document.createElement("img");img.src=manga.cover;img.alt=manga.name;cover.appendChild(img);}else cover.textContent="📖";const info=document.createElement("div");info.className="manga-info";const title=document.createElement("h3");title.textContent=manga.name;const author=document.createElement("p");author.textContent="✍️ "+(manga.author||"غير معروف");const chapters=document.createElement("p");chapters.textContent="📄 "+getChapterCount(manga)+" فصول";const views=document.createElement("p");views.textContent="👁️ "+getLocalViewCount(manga)+" مشاهدة";const openBtn=document.createElement("button");openBtn.type="button";openBtn.textContent="📖 دخول المانجا";openBtn.style.cssText="width:100%;height:42px;margin-top:12px;border-radius:12px;background:#281b38;color:#fff;font-weight:bold;border:1px solid #4b3562;cursor:pointer";info.append(title,author,chapters,views,openBtn);if(isAdmin){const manage=document.createElement("button");manage.type="button";manage.textContent="📚 إدارة الفصول";manage.style.cssText="width:100%;height:42px;margin-top:8px;border-radius:12px;background:#281b38;color:#d9b7ff;font-weight:bold;border:1px solid #4b3562";manage.onclick=function(e){e.stopPropagation();openMangaPage(manga,true)};info.appendChild(manage);const del=document.createElement("button");del.type="button";del.textContent="🗑️ حذف المانجا";del.style.cssText="width:100%;height:42px;margin-top:8px;border-radius:12px;background:#3b1727;color:#ff9fbd;font-weight:bold;border:0";del.onclick=function(e){e.stopPropagation();deleteManga(manga.id)};info.appendChild(del);}card.append(cover,info);function open(){
    try{
        if(!isAdmin){
                    try{ recordMangaView(manga); }catch(e){ console.warn("view error",e); }
        }
        // Opening a manga from the library is always the public/read view.
        // Admin-only chapter management is available through "📚 إدارة الفصول".
        openMangaPage(manga,false);
    }catch(e){
        console.error("openMangaPage error",e);
        showToast("تعذر فتح صفحة المانجا، حاول مرة أخرى");
    }
}
openBtn.onclick=function(e){e.preventDefault();e.stopPropagation();open()};cover.onclick=function(e){e.preventDefault();e.stopPropagation();open()};title.onclick=function(e){e.preventDefault();e.stopPropagation();open()};card.onclick=function(e){if(e.target.closest("button"))return;open()};card.onkeydown=function(e){if(e.key==="Enter"||e.key===" "){e.preventDefault();open()}};return card;}

/* =========================================
   DELETE MANGA
========================================= */

function deleteManga(id){

    const manga =
        mangaList.find(
            function(item){
                return item.id === id;
            }
        );


    if(!manga){

        showToast("المانجا غير موجودة");

        return;

    }


    const confirmed =
        window.confirm(
            "هل تريد حذف «" +
            manga.name +
            "»؟"
        );


    if(!confirmed) return;


    mangaList =
        mangaList.filter(
            function(item){
                return item.id !== id;
            }
        );


    localStorage.setItem("mangaZERO_manga", JSON.stringify(mangaList));
    if(window.mzDeleteMangaFromCloud) window.mzDeleteMangaFromCloud(id).catch(console.error);
    renderManga();

    showToast("تم حذف المانجا 🗑️");

}


/* =========================================
   RENDER MANGA
========================================= */

function renderManga(mode){
    if(mode) currentBrowseMode=mode;
    mode=currentBrowseMode||"home";
    if(!homeMangaGrid || !adminMangaGrid) return;

    homeMangaGrid.innerHTML = "";
    adminMangaGrid.innerHTML = "";

    if(mangaCount) mangaCount.textContent=mangaList.length;
    if(homeMangaCount) homeMangaCount.textContent="("+mangaList.length+")";

    let totalChapters=0;
    mangaList.forEach(function(manga){totalChapters+=getChapterCount(manga);});
    if(chapterCount) chapterCount.textContent=totalChapters;

    if(!mangaList.length){
        if(emptyLibrary) emptyLibrary.classList.remove("hide");
        if(adminEmpty) adminEmpty.style.display="block";
        return;
    }
    if(emptyLibrary) emptyLibrary.classList.add("hide");
    if(adminEmpty) adminEmpty.style.display="none";

    let list=mangaList.slice();
    if(mode==="latest") list.sort(function(a,b){return Number(b.createdAt||0)-Number(a.createdAt||0);});
    if(mode==="best") list.sort(function(a,b){return getLocalViewCount(b)-getLocalViewCount(a) || Number(b.createdAt||0)-Number(a.createdAt||0);});

    list.forEach(function(manga){homeMangaGrid.appendChild(createMangaCard(manga,false));});
    mangaList.forEach(function(manga){adminMangaGrid.appendChild(createMangaCard(manga,true));});
    if(mode==="best") loadSharedViewsAndRerender();
}

async function loadSharedViewsAndRerender(){
    if(!window.mzFirestore || !mangaList.length || currentBrowseMode!=="best") return;
    try{
        const db=window.mzFirestore;
        const docs=await Promise.all(mangaList.map(function(m){return db.collection("mangaZERO_views").doc(String(m.id)).get();}));
        docs.forEach(function(doc,i){if(doc.exists){mangaList[i].views=Math.max(0,Number(doc.data().views||0));}});
        if(currentBrowseMode!=="best") return;
        const list=mangaList.slice().sort(function(a,b){return getLocalViewCount(b)-getLocalViewCount(a)||Number(b.createdAt||0)-Number(a.createdAt||0);});
        homeMangaGrid.innerHTML="";
        list.forEach(function(m){homeMangaGrid.appendChild(createMangaCard(m,false));});
    }catch(e){console.warn("تعذر تحميل المشاهدات المشتركة",e);}
}


/* =========================================
   MANGA / CHAPTERS
========================================= */
let currentMangaId=null;
let mangaCommentsUnsub=null;
const mangaPageActions=document.getElementById("mangaPageActions");
const showCommentsBtn=document.getElementById("showCommentsBtn");
const showChaptersBtn=document.getElementById("showChaptersBtn");
const mangaCommentsView=document.getElementById("mangaCommentsView");

function esc(x){return String(x||"").replace(/[&<>'"]/g,function(c){return ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;","\"":"&quot;"}[c])});}
function getComments(m){return Array.isArray(m.comments)?m.comments:[];}
function setActiveMangaTab(tab){
    if(!mangaCommentsView||!chapterListView||!showCommentsBtn||!showChaptersBtn)return;
    if(tab==="comments"){
        showCommentsBtn.classList.add("active");
        showChaptersBtn.classList.remove("active");
        chapterListView.style.setProperty("display","none","important");
        mangaCommentsView.style.setProperty("display","block","important");
        const activeManga=window.currentMangaPage || mangaList.find(function(x){return String(x.id)===String(currentMangaId);});
        if(activeManga){
            try{
                renderComments(activeManga);
            }catch(e){
                console.error("render comments on tab:",e);
                // حتى لو حصل خطأ أثناء رسم قائمة التعليقات، لا نخفي محرر الكتابة.
                // نعرض محررًا بسيطًا مباشرة حتى يقدر المستخدم يكتب وينشر.
                const nm=esc(activeManga.name||"المانجا");
                mangaCommentsView.innerHTML='<div class="comments-box"><div class="admin-section-title">💬 تعليقات '+nm+'</div>' +
                    '<div class="comment-form"><input id="commentInput" autocomplete="off" type="text" maxlength="300" placeholder="اكتب تعليقك عن '+nm+'..."><button id="addCommentBtn" type="button">➕ نشر التعليق</button></div><div id="commentsList"><div class="page-empty" style="padding:20px 5px;">يمكنك كتابة تعليقك الآن ✨</div></div></div>';
                const emergencyInput=document.getElementById("commentInput");
                const emergencyBtn=document.getElementById("addCommentBtn");
                if(emergencyInput) emergencyInput.addEventListener("keydown",function(ev){if(ev.key==="Enter"&&!ev.shiftKey){ev.preventDefault();if(emergencyBtn&&!emergencyBtn.disabled)emergencyBtn.click();}});
                if(emergencyBtn) emergencyBtn.onclick=function(){ mzPublishCommentFromUI(emergencyBtn); };
            }
        }else{
            mangaCommentsView.innerHTML='<div class="comments-box"><div class="admin-section-title">💬 التعليقات</div><div class="page-empty">لم يتم العثور على المانجا الحالية.</div></div>';
        }
    }else{
        showChaptersBtn.classList.add("active");
        showCommentsBtn.classList.remove("active");
        mangaCommentsView.style.setProperty("display","none","important");
        chapterListView.style.setProperty("display","block","important");
    }
}
async function loadMangaComments(manga){
    if(!mangaCommentsView||!manga)return;
    if(mangaCommentsUnsub){try{mangaCommentsUnsub();}catch(e){} mangaCommentsUnsub=null;}
    manga.comments=Array.isArray(manga.comments)?manga.comments:[];
    renderComments(manga);
    if(window.mzFirestore){
        try{
            const q=window.mzFirestore.collection("mangaZERO_comments").where("mangaId","==",String(manga.id));
            mangaCommentsUnsub=q.onSnapshot(function(snap){
                const arr=[];
                snap.forEach(function(d){const c=d.data()||{};arr.push(Object.assign({id:d.id},c));});
                arr.sort(function(a,b){return Number(b.createdAt||0)-Number(a.createdAt||0);});
                manga.comments=arr;
                renderComments(manga);
            },function(e){console.warn("تعذر تحميل تعليقات المانجا",e);});
        }catch(e){console.warn(e);}
    }
}
async function getFreshCurrentUserVerified(u){
    const user=u||window.currentUser;
    if(!user)return false;
    if(String(user.email||'').toLowerCase()===ADMIN_EMAIL.toLowerCase())return true;
    try{
        if(window.mzFirestore && user.uid){
            const ps=await window.mzFirestore.collection('mangaZERO_users').doc(String(user.uid)).get();
            if(ps.exists)return (ps.data()||{}).verified===true;
        }
    }catch(e){console.warn('fresh user verified:',e);}
    return !!((window.mzProfileUserData||{}).verified===true);
}

async function getFreshCurrentUserTitle(u){
    const user=u||window.currentUser;
    if(!user)return 'member';
    if(String(user.email||'').toLowerCase()===ADMIN_EMAIL.toLowerCase())return 'admin';
    try{
        if(window.mzFirestore && user.uid){
            const s=await window.mzFirestore.collection('mangaZERO_users').doc(String(user.uid)).get();
            if(s.exists){
                const d=s.data()||{};
                window.mzProfileUserData=Object.assign({},window.mzProfileUserData||{},d);
                return mzCommentNormalizeTitle(d.title);
            }
        }
    }catch(e){console.warn('fresh user title:',e);}
    return mzCommentNormalizeTitle((window.mzProfileUserData||{}).title);
}

function renderComments(manga){
    if(!mangaCommentsView)return;
    manga=manga||{};
    const comments=Array.isArray(manga.comments)?manga.comments:[];
    const admin=typeof window.mzIsAdmin==='function' ? window.mzIsAdmin() : false;
    // لا نعطّل التعليقات حسب نوع الحساب؛ أي مستخدم مسجل الدخول يمكنه التعليق.
    const restricted=false;
    const uid=window.currentUser&&window.currentUser.uid?String(window.currentUser.uid):"";
    const safeTitle=function(v){
        const x=String(v||'member').toLowerCase();
        return ['admin','moderator','supporter','member','veteran'].indexOf(x)>=0?x:'member';
    };
    const titleInfo={admin:['👑','ADMIN','admin'],moderator:['🛡️','مشرف','mod'],supporter:['💎','داعم','support'],veteran:['⚡','مخضرم','veteran'],member:['👤','عضو','member']};
    const safeEsc=function(v){return String(v==null?'':v).replace(/[&<>'"]/g,function(c){return ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','\"':'&quot;'}[c]);});};
    const makeUser=function(name,title,verified){
        const arr=window.mzGetUserTitles?window.mzGetUserTitles(title):[safeTitle(title)];
        const t=titleInfo[arr[0]]||titleInfo.member;
        const isVerified=safeTitle(title)==='admin'||verified===true;
        const verify=isVerified?' <span class="mz-verified-badge" title="حساب موثّق">✓</span>':'';
        return '<span class="mz-comment-name mz-title-name-'+t[2]+'">'+safeEsc(name||'مستخدم')+'</span> '+arr.map(function(k){var z=titleInfo[k]||titleInfo.member;var vv=(k==='admin'||verified===true)?' <span class="mz-verified-badge" title="حساب موثّق">✓</span>':'';return '<span class="mz-title-badge mz-title-'+z[2]+'">'+z[0]+' '+z[1]+vv+'</span>';}).join(' ');
    };
    // نفس الحكاية: الشكل الأساسي بيتعمل مرة واحدة، والتحديثات بتغيّر القائمة بس.
    let input=mangaCommentsView.querySelector('#commentInput');
    let btn=mangaCommentsView.querySelector('#addCommentBtn');
    if(!input||!btn||!mangaCommentsView.querySelector('#commentsList')){
        mangaCommentsView.innerHTML='<div class="comments-box"><div class="admin-section-title" id="commentsBoxTitle" style="padding:0 0 12px;"></div><div class="comment-form"><input id="commentInput" autocomplete="off" type="text" maxlength="300"/><button id="addCommentBtn" type="button">➕ نشر التعليق</button></div><div id="commentsList"></div></div>';
        input=mangaCommentsView.querySelector('#commentInput');
        btn=mangaCommentsView.querySelector('#addCommentBtn');
        if(input)input.addEventListener('keydown',function(e){
            if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();const b=document.getElementById('addCommentBtn');if(b&&!b.disabled)b.click();}
        });
    }
    const titleEl=mangaCommentsView.querySelector('#commentsBoxTitle');
    if(titleEl)titleEl.textContent='💬 تعليقات '+(manga.name||'المانجا');
    if(input){
        input.disabled=restricted;
        input.placeholder=restricted?'التعليق غير متاح أثناء التقييد':('اكتب تعليقك عن '+(manga.name||'المانجا')+'...');
    }
    if(btn && !btn.__mzCommentCooldownTimer && !(btn.dataset&&btn.dataset.mzBusy==='1')){
        btn.disabled=restricted;
        btn.textContent='➕ نشر التعليق';
    }

    let h='';
    if(!comments.length){
        h+='<div class="page-empty" style="padding:20px 5px;">لسه مفيش تعليقات على المانجا دي. كن أول واحد يكتب تعليق ✨</div>';
    }else{
        comments.forEach(function(c){
            c=c||{};
            const isAdminComment=String(c.email||'').toLowerCase()==='maxking1789@gmail.com';
            const name=isAdminComment?'𝑴𝒂𝒙𝑲𝒊𝒏𝒈':(c.user||'مستخدم');
            const badge=isAdminComment?'<span class="admin-name-wrap">'+safeEsc(name)+'</span> <span class="admin-badge"><span class="admin-badge-crown">👑</span>ADMIN <span class="mz-verified-badge" title="حساب موثّق">✓</span></span>':makeUser(name,c.titles||c.title,c.verified===true);
            const mine=!!uid&&String(c.uid||'')===uid;
            const cid=safeEsc(String(c.id||''));
            h+='<div class="comment-item"><div class="comment-user mz-profile-click-target" '+(c.uid?'data-open-profile="'+safeEsc(String(c.uid||''))+'" role="button" tabindex="0"':'')+'>'+ (c.photoURL?'<img class="mz-comment-avatar" src="'+safeEsc(c.photoURL)+'" alt="صورة المستخدم">':'<span class="mz-comment-avatar"><span class="mz-comment-avatar-fallback">👤</span></span>') +'<div class="comment-user-main">'+badge+'</div></div><div class="comment-text">'+safeEsc(c.text||'')+'</div><div class="comment-actions">';
            if(mine&&!isAdminComment)h+='<button class="comment-report-btn" data-edit-comment="'+cid+'">✏️ تعديل</button><button class="comment-report-btn" data-user-delete-comment="'+cid+'">🗑️ حذف</button>';
            if(!mine)h+='<button class="comment-report-btn" data-report-id="'+cid+'">🚩 إبلاغ</button>';
            if(admin)h+='<button class="comment-report-btn" data-delete-comment-id="'+cid+'">🗑️ حذف التعليق</button>';
            h+='</div></div>';
        });
    }
    const listEl=mangaCommentsView.querySelector('#commentsList');
    if(listEl)listEl.innerHTML=h;
    if(btn)btn.onclick=async function(){
        const current=window.currentUser;
        const currentIsAdmin=!!current && String(current.email||'').toLowerCase()==='maxking1789@gmail.com';
        // أي حساب مسجل دخول يقدر يكتب تعليق. المنع الوحيد هنا هو عدم تسجيل الدخول؛
        // صلاحيات Firebase تبقى هي الحماية النهائية للحسابات المحظورة.
        if(!current){showToast('سجل دخولك الأول عشان تقدر تعلق');return;}
        const text=input?input.value.trim():'';
        if(!text){showToast('اكتب التعليق الأول');if(input)input.focus();return;}
        if(typeof mzHasBadWord==='function' && mzHasBadWord(text)){
            showToast('التعليق فيه كلام مش مناسب. عدّله وجرب تاني 🙏');
            if(input)input.focus();
            return;
        }
        const u=window.currentUser;
        if(!u){showToast('سجل دخولك الأول عشان تقدر تعلق');return;}
        btn.dataset.mzBusy='1';btn.disabled=true;btn.textContent='جاري النشر...';
        try{
            const freshTitle=await getFreshCurrentUserTitle(u);
            const freshVerified=await getFreshCurrentUserVerified(u);
            const profile=window.mzProfileUserData||{};
            const c={mangaId:String(manga.id||''),mangaName:manga.name||'',user:profile.username||u.displayName||u.email||'مستخدم',title:freshTitle,verified:freshVerified,email:u.email||'',uid:u.uid||'',text:text,photoURL:profile.photoURL||u.photoURL||'',createdAt:Date.now()};
            if(window.mzFirestore){
                await window.mzFirestore.collection('mangaZERO_comments').add(c);
            }else{
                c.id=String(Date.now());
                manga.comments=Array.isArray(manga.comments)?manga.comments:[];
                manga.comments.unshift(c);
                if(typeof saveData==='function')saveData();
                renderComments(manga);
            }
            if(input)input.value='';
            showToast('تم نشر التعليق ✅');
        }catch(e){
            console.error('add comment failed',e);
            const code=e&&e.code?String(e.code):'';
            const msg=e&&e.message?String(e.message):'';
            showToast('تعذر نشر التعليق: '+(code||'خطأ Firebase')+(msg?(' — '+msg):''));
        }finally{delete btn.dataset.mzBusy;btn.disabled=false;btn.textContent='➕ نشر التعليق';}
    };
    mangaCommentsView.querySelectorAll('[data-edit-comment]').forEach(function(b){b.onclick=async function(){if(typeof guardRestricted==='function'&&!guardRestricted('comment'))return;const id=String(b.dataset.editComment),c=comments.find(x=>String(x&&x.id)===id);if(!c)return;const t=prompt('عدّل تعليقك:',c.text||'');if(t===null||!t.trim())return;try{if(window.mzFirestore)await window.mzFirestore.collection('mangaZERO_comments').doc(id).update({text:t.trim(),updatedAt:Date.now()});else{c.text=t.trim();if(typeof saveData==='function')saveData();renderComments(manga);}showToast('تم تعديل التعليق ✏️');}catch(e){console.error(e);showToast('تعذر تعديل التعليق');}}});
    mangaCommentsView.querySelectorAll('[data-user-delete-comment]').forEach(function(b){b.onclick=async function(){if(typeof guardRestricted==='function'&&!guardRestricted('comment'))return;const id=String(b.dataset.userDeleteComment);if(!confirm('حذف تعليقك؟'))return;try{if(window.mzFirestore)await window.mzFirestore.collection('mangaZERO_comments').doc(id).delete();else{manga.comments=manga.comments.filter(x=>String(x&&x.id)!==id);if(typeof saveData==='function')saveData();renderComments(manga);}showToast('تم حذف التعليق 🗑️');}catch(e){console.error(e);showToast('تعذر حذف التعليق');}}});
    mangaCommentsView.querySelectorAll('[data-report-id]').forEach(function(b){b.onclick=function(e){if(e){e.preventDefault();e.stopPropagation();}reportComment(manga.id,b.dataset.reportId);}});
    mangaCommentsView.querySelectorAll('[data-delete-comment-id]').forEach(function(b){b.onclick=async function(){const id=String(b.dataset.deleteCommentId);if(!confirm('هل تريد حذف هذا التعليق نهائيًا؟'))return;try{if(window.mzFirestore)await window.mzFirestore.collection('mangaZERO_comments').doc(id).delete();else{manga.comments=manga.comments.filter(x=>String(x&&x.id)!==id);if(typeof saveData==='function')saveData();renderComments(manga);}showToast('تم حذف التعليق 🗑️');}catch(e){console.error(e);showToast('تعذر حذف التعليق');}}});
    mangaCommentsView.querySelectorAll('[data-open-profile]').forEach(function(b){
        const open=function(e){if(e){e.preventDefault();e.stopPropagation();}if(typeof window.mzOpenPublicProfile==='function')window.mzOpenPublicProfile(b.getAttribute('data-open-profile'));};
        b.onclick=open;
        b.onkeydown=function(e){if(e.key==='Enter'||e.key===' '){open(e);}};
    });
    try{hydrateCommentProfiles(manga);}catch(e){console.warn('comment profile hydration failed',e);}
}
async function hydrateCommentProfiles(manga){if(!window.mzFirestore||!manga||!Array.isArray(manga.comments))return;const ids=[...new Set(manga.comments.map(function(c){return String(c.uid||'');}).filter(Boolean))];if(!ids.length)return;let changed=false;await Promise.all(ids.map(async function(uid){const d=window.mzGetPublicProfile?await window.mzGetPublicProfile(uid):await getPublicProfile(uid);if(!d)return;const cList=manga.comments.filter(function(c){return String(c.uid||'')===uid;});cList.forEach(function(c){const nextName=String(d.username||d.name||c.user||'مستخدم');const nextTitles=window.mzGetUserTitles?window.mzGetUserTitles(d):[mzCommentNormalizeTitle(d.title)]; const nextTitle=nextTitles[0];const nextVerified=String(d.email||'').toLowerCase()===ADMIN_EMAIL.toLowerCase()||d.verified===true;if(c.user!==nextName){c.user=nextName;changed=true;}if(JSON.stringify(window.mzGetUserTitles?window.mzGetUserTitles(c):[mzCommentNormalizeTitle(c.title)])!==JSON.stringify(nextTitles)){c.titles=nextTitles.slice();c.title=nextTitle;changed=true;}if(!!c.verified!==nextVerified){c.verified=nextVerified;changed=true;}if(String(c.photoURL||'')!==String(d.photoURL||'')){c.photoURL=String(d.photoURL||'');changed=true;}});}));if(changed&&mangaCommentsView&&mangaPage&&mangaPage.style.display!=='none')renderComments(manga);}

async function reportComment(mangaId,commentId){
    try{
        if(typeof guardRestricted==='function'&&!guardRestricted('report'))return;
        const u=window.currentUser;
        if(!u){showToast("سجل دخولك الأول عشان تبلغ 🚩");return;}
        if(!window.mzFirestore){showToast("الإبلاغ غير متاح حاليًا: Firebase غير متصل");return;}

        let manga=(typeof window.currentMangaPage!=='undefined'&&window.currentMangaPage&&String(window.currentMangaPage.id)===String(mangaId))
          ? window.currentMangaPage
          : mangaList.find(function(x){return String(x.id)===String(mangaId);});
        let c=manga&&Array.isArray(manga.comments)
          ? manga.comments.find(function(x){return String(x.id)===String(commentId);})
          : null;

        // Fallback: fetch the comment directly if it is not present in the local list.
        if(!c){
            try{
                const snap=await window.mzFirestore.collection('mangaZERO_comments').doc(String(commentId)).get();
                if(snap.exists)c=Object.assign({id:snap.id},snap.data()||{});
            }catch(fetchErr){console.warn('report comment fetch failed',fetchErr);}
        }
        if(!c){showToast("لم يتم العثور على التعليق المطلوب للإبلاغ عنه");return;}

        const reason=await new Promise(function(resolve){
            const overlay=document.createElement('div');
            overlay.className='mz-report-overlay';
            overlay.innerHTML='<div class="mz-report-modal" role="dialog" aria-modal="true">'+
              '<div class="mz-report-title">🚩 الإبلاغ عن التعليق</div>'+
              '<div class="mz-report-subtitle">اكتب سبب البلاغ بالتفصيل عشان الإدارة تقدر تراجعه.</div>'+
              '<textarea class="mz-report-textarea" maxlength="500" placeholder="اكتب سبب البلاغ هنا..."></textarea>'+
              '<div class="mz-report-actions"><button type="button" class="mz-report-cancel">إلغاء</button><button type="button" class="mz-report-send">إرسال البلاغ 🚩</button></div>'+
            '</div>';
            const ta=overlay.querySelector('.mz-report-textarea'),cancel=overlay.querySelector('.mz-report-cancel'),send=overlay.querySelector('.mz-report-send');
            function close(v){overlay.remove();document.body.style.overflow='';resolve(v);}
            cancel.onclick=function(){close(null);};
            overlay.addEventListener('click',function(ev){if(ev.target===overlay)close(null);});
            send.onclick=function(){const v=ta.value.trim();if(!v){ta.focus();showToast('اكتب سبب البلاغ الأول');return;}send.disabled=true;close(v);};
            document.body.appendChild(overlay);
            document.body.style.overflow='hidden';
            setTimeout(function(){ta.focus();},30);
        });
        if(reason===null)return;
        const report={
          type:'comment',
          mangaId:String(mangaId),
          mangaName:(manga&&manga.name)||c.mangaName||'',
          commentId:String(commentId),
          commentText:c.text||'',
          commentUser:c.user||'مستخدم',
          commentUid:c.uid||'',
          commentEmail:c.email||'',
          reportedByUid:u.uid,
          reportedByEmail:u.email||'',
          reason:String(reason||'بدون سبب'),
          status:'open',
          createdAt:firebase.firestore.FieldValue.serverTimestamp()
        };
        await window.mzFirestore.collection('mangaZERO_reports').add(report);
        showToast('تم الإبلاغ بنجاح ✅');
    }catch(e){
        console.error('reportComment failed:',e);
        if(e&&e.code==='permission-denied')showToast('ليس لديك صلاحية لإرسال البلاغ حاليًا');
        else showToast('تعذر إرسال البلاغ، حاول مرة أخرى');
    }
}
async function recordMangaView(manga){
    if(!manga)return;
    manga.views=getLocalViewCount(manga)+1;
    saveData();
    if(window.mzFirestore){
        try{await window.mzFirestore.collection("mangaZERO_views").doc(String(manga.id)).set({mangaId:String(manga.id),views:firebase.firestore.FieldValue.increment(1),updatedAt:firebase.firestore.FieldValue.serverTimestamp()},{merge:true});}catch(e){console.warn("تعذر حفظ المشاهدة على Firebase",e);}
    }
    if(currentBrowseMode==="best") renderManga("best");
}
function openMangaPage(manga,adminMode){
    if(!manga){showToast("المانجا غير موجودة");return;}
    adminMode=adminMode===true && typeof window.mzIsAdmin==="function" && window.mzIsAdmin();
    mzAdminChapterManagementMode=adminMode;
    document.body.toggleAttribute("data-admin-chapter-mode",adminMode);
    currentMangaId=manga.id;
    window.currentMangaPage=manga;
    if(mangaCommentsUnsub){try{mangaCommentsUnsub();}catch(e){} mangaCommentsUnsub=null;}
    document.body.setAttribute("data-manga-open","1");
    if(sitePage)sitePage.style.setProperty("display","none","important");
    if(adminPage)adminPage.style.setProperty("display","none","important");
    if(mangaPage){mangaPage.style.setProperty("display","block","important");mangaPage.scrollTop=0;}
    mangaPageActions.style.display="grid";
    chapterReader.style.display="none";
    chapterListView.style.display="block";
    mangaCommentsView.style.display="none";
    mangaPageTitle.textContent=manga.name;
    renderMangaPage(manga,adminMode);
    setActiveMangaTab("chapters");
    window.scrollTo(0,0);
}
function renderMangaPage(manga,adminMode){
    const cover=manga.cover?'<img loading="lazy" decoding="async" src="'+manga.cover.replace(/"/g,"&quot;")+'" alt="'+esc(manga.name||"مانجا")+'">':'📖';
    const rating=Math.max(0,Math.min(5,Number(manga.rating||0)));
    const ratingText=rating?rating.toFixed(1):"0.0";
    const ratingCount=Number(manga.ratingCount||0);
    const genres=Array.isArray(manga.genres)?manga.genres:(Array.isArray(manga.tags)?manga.tags:[]);
    const tags=genres.length?genres.slice(0,5):["مانجا"];
    const favKey="mangaZERO_favorite_"+String(manga.id);
    const isFav=localStorage.getItem(favKey)==="1";
    let h='<div class="manga-hero">';
    h+='<div class="manga-hero-main"><div class="manga-hero-cover">'+cover+'</div><div class="manga-hero-info">';
    h+='<h2>'+esc(manga.name||"المانجا")+'</h2>';
    h+='<div class="manga-author">✍️ '+esc(manga.author||"غير معروف")+'</div>';
    const userRating=Number(localStorage.getItem("mangaZERO_user_rating_"+String(manga.id))||0);
    h+='<div class="manga-rating-line"><span class="manga-stars" id="mangaDisplayStars" aria-label="التقييم '+ratingText+' من 5">'+[1,2,3,4,5].map(function(i){return '<span class="rating-star '+(i<=Math.round(rating)?'filled':'')+'" data-display-star="'+i+'">★</span>';}).join('')+'</span><span class="manga-rating-number">'+ratingText+'/5</span><span class="manga-rating-count">'+(ratingCount?ratingCount+" تقييم":"لم يتم التقييم بعد")+'</span></div>';
    h+='<div class="manga-rate-picker" id="mangaRatePicker"><span class="manga-rate-picker-label">تقييمك:</span>'+[1,2,3,4,5].map(function(i){return '<button type="button" class="pick-star '+(i<=userRating?'selected':'')+'" data-pick-rating="'+i+'" aria-label="'+i+' نجوم">★</button>';}).join('')+'</div>';
    h+='<div class="manga-tags">'+tags.map(function(t){return '<span class="manga-tag">'+esc(t)+'</span>';}).join('')+'</div>';
    h+='<p class="manga-desc">'+esc(manga.description||"لا يوجد وصف لهذه المانجا حتى الآن.")+'</p>';
    h+='</div></div>';
    h+='<div class="manga-quick-actions">';
    h+='<button class="manga-quick-btn manga-comment-quick" id="mangaCommentQuick" type="button">➕ أضف تعليق</button>';
    h+='<button class="manga-quick-btn '+(isFav?'manga-fav-on':'')+'" id="mangaFavoriteQuick">'+(isFav?'✓ في مكتبتي':'＋ أضف للمكتبة')+'</button>';
    h+='<button class="manga-quick-btn" id="mangaRateQuick">★ قيّم المانجا</button>';
    h+='</div>';
    h+='<div class="manga-stats">';
    h+='<div class="manga-stat"><strong>👁️ '+getLocalViewCount(manga)+'</strong><span>مشاهدات</span></div>';
    h+='<div class="manga-stat"><strong>📚 '+getChapterCount(manga)+'</strong><span>الفصول</span></div>';
    h+='<div class="manga-stat"><strong>★ '+ratingText+'</strong><span>تقييم القراء</span></div>';
    h+='</div></div>';
    if(adminMode)h+='<div class="add-box manga-admin-box"><div class="add-header" id="chapterAddHeader"><div class="add-title">➕ إضافة فصل جديد</div><div class="add-plus" id="chapterAddPlus">＋</div></div><div class="add-form" id="chapterAddForm"><input id="chapterTitleInput" class="input" type="text" placeholder="اسم الفصل، مثال: الفصل 1"><div class="file-input-wrap"><label for="chapterPagesInput">🖼️ صور صفحات الفصل (يمكن اختيار أكثر من صورة)</label><input id="chapterPagesInput" type="file" accept="image/*" multiple></div><button id="saveChapter" class="save-button">➕ نشر الفصل</button></div></div>';
    mangaDetailBox.innerHTML=h;
    const favBtn=document.getElementById("mangaFavoriteQuick");
    if(favBtn)favBtn.onclick=async function(){
        const on=localStorage.getItem(favKey)==="1";
        localStorage.setItem(favKey,on?"0":"1");
        favBtn.classList.toggle("manga-fav-on",!on);
        favBtn.textContent=on?"＋ أضف للمكتبة":"✓ في مكتبتي";
        const u=window.currentUser;
        if(u&&window.mzFirestore){try{await window.mzFirestore.collection('mangaZERO_public_profiles').doc(u.uid).set({uid:u.uid,favorites:on?firebase.firestore.FieldValue.arrayRemove(String(manga.id)):firebase.firestore.FieldValue.arrayUnion(String(manga.id)),updatedAt:firebase.firestore.FieldValue.serverTimestamp()},{merge:true});}catch(e){console.warn('favorite cloud sync:',e);}}
        showToast(on?"تمت الإزالة من مكتبتك":"تمت إضافة المانجا لمكتبتك ⭐");
    };
    const commentBtn=document.getElementById("mangaCommentQuick");
    if(commentBtn)commentBtn.onclick=function(e){
        if(e){e.preventDefault();e.stopPropagation();}
        mangaPageActions.style.setProperty("display","grid","important");
        mangaCommentsView.style.setProperty("display","block","important");
        chapterListView.style.setProperty("display","none","important");
        showCommentsBtn.classList.add("active");
        showChaptersBtn.classList.remove("active");
        try{
            renderComments(window.currentMangaPage||manga);
        }catch(err){
            console.error("quick comment render:",err);
            const nm=esc((window.currentMangaPage||manga).name||"المانجا");
            mangaCommentsView.innerHTML='<div class="comments-box"><div class="admin-section-title">💬 تعليقات '+nm+'</div><div class="comment-form"><input id="commentInput" autocomplete="off" type="text" maxlength="300" placeholder="اكتب تعليقك عن '+nm+'..."><button id="addCommentBtn" type="button">➕ نشر التعليق</button></div><div id="commentsList"></div></div>';
            const eb=document.getElementById("addCommentBtn");
            if(eb)eb.onclick=function(){mzPublishCommentFromUI(eb);};
        }
        window.scrollTo(0,0);
        setTimeout(function(){
            const ci=document.getElementById("commentInput");
            if(ci&&!ci.disabled){
                ci.removeAttribute("disabled");
                ci.focus();
                ci.scrollIntoView({behavior:"smooth",block:"center"});
            }
        },120);
        return false;
    };
    const rateBtn=document.getElementById("mangaRateQuick");
    const ratePicker=document.getElementById("mangaRatePicker");
    const displayStars=document.getElementById("mangaDisplayStars");
    function refreshUserRatingStars(value){
        if(!ratePicker)return;
        ratePicker.querySelectorAll("[data-pick-rating]").forEach(function(btn){
            const n=Number(btn.getAttribute("data-pick-rating")||0);
            btn.classList.toggle("selected",n<=value);
        });
    }
    function renderMangaRatingUI(avg,count){
        const safeAvg=Math.max(0,Math.min(5,Number(avg)||0));
        const safeCount=Math.max(0,Number(count)||0);
        const num=document.querySelector("#mangaPage .manga-rating-number");
        const countEl=document.querySelector("#mangaPage .manga-rating-count");
        if(num)num.textContent=safeAvg.toFixed(1)+"/5";
        if(countEl)countEl.textContent=safeCount?safeCount+" تقييم":"لم يتم التقييم بعد";
        if(displayStars){
            displayStars.setAttribute("aria-label","التقييم "+safeAvg.toFixed(1)+" من 5");
            displayStars.querySelectorAll("[data-display-star]").forEach(function(star){
                star.classList.toggle("filled",Number(star.getAttribute("data-display-star")||0)<=Math.round(safeAvg));
            });
        }
    }
    async function refreshMangaRatingFromCloud(){
        const db=window.mzFirestore;
        const mangaId=String(manga.id||"");
        const localUserKey="mangaZERO_user_rating_"+mangaId;
        const localUserRating=Number(localStorage.getItem(localUserKey)||0);
        let sum=0,count=0;
        let cloudLoaded=false;

        try{
            if(db){
                const snap=await db.collection("mangaZERO_ratings")
                    .where("mangaId","==",mangaId)
                    .get();

                cloudLoaded=true;
                snap.forEach(function(doc){
                    const d=doc.data()||{};
                    const r=Number(d.rating||0);
                    if(r>=1&&r<=5){
                        sum+=r;
                        count++;
                    }
                });
            }
        }catch(e){
            console.error("تعذر تحميل تقييمات المانجا من Firebase:",e);
        }

        // لو المستخدم قيّم محليًا لكن تقييمه لم يصل للسحابة بعد،
        // نظهر تقييمه مؤقتًا بدل الرجوع للصفر.
        if(localUserRating>=1&&localUserRating<=5){
            const currentUid=window.currentUser&&window.currentUser.uid?String(window.currentUser.uid):"";
            let alreadyIncluded=false;

            // نتأكد من عدم إضافة تقييم المستخدم مرتين.
            if(db&&currentUid){
                try{
                    const ownDoc=await db.collection("mangaZERO_ratings")
                        .doc(mangaId+"_"+currentUid)
                        .get();
                    alreadyIncluded=ownDoc.exists;
                }catch(e){}
            }

            if(!alreadyIncluded){
                sum+=localUserRating;
                count++;
            }
        }

        if(count>0){
            manga.rating=sum/count;
            manga.ratingCount=count;
        }else if(cloudLoaded){
            manga.rating=0;
            manga.ratingCount=0;
        }else{
            manga.rating=Math.max(0,Math.min(5,Number(manga.rating||0)));
            manga.ratingCount=Math.max(0,Number(manga.ratingCount||0));
        }

        localStorage.setItem("mangaZERO_manga",JSON.stringify(mangaList));
        renderMangaRatingUI(Number(manga.rating||0),Number(manga.ratingCount||0));
    }

    window.mzRefreshCurrentMangaRating=refreshMangaRatingFromCloud;
    refreshMangaRatingFromCloud();

    if(rateBtn&&ratePicker)rateBtn.onclick=function(){
        ratePicker.classList.toggle("open");
        if(ratePicker.classList.contains("open"))ratePicker.scrollIntoView({behavior:"smooth",block:"nearest"});
    };

    if(ratePicker)ratePicker.querySelectorAll("[data-pick-rating]").forEach(function(btn){
        btn.onclick=async function(){
            const n=Number(btn.getAttribute("data-pick-rating")||0);
            if(n<1||n>5)return;

            const user=window.currentUser;
            if(!user||!user.uid){
                showToast("سجل دخولك أولًا عشان تقدر تقيّم المانجا ⭐");
                return;
            }

            const mangaId=String(manga.id||"");
            const ratingDocId=mangaId+"_"+String(user.uid);
            const oldLocal=Number(localStorage.getItem("mangaZERO_user_rating_"+mangaId)||0);

            // حفظ الاختيار محليًا فورًا حتى الواجهة تستجيب بدون تأخير.
            localStorage.setItem("mangaZERO_user_rating_"+mangaId,String(n));
            refreshUserRatingStars(n);
            renderMangaRatingUI(n,Math.max(1,Number(manga.ratingCount||0)));

            try{
                if(!window.mzFirestore)throw new Error("Firebase Firestore غير مهيأ");

                await window.mzFirestore.collection("mangaZERO_ratings").doc(ratingDocId).set({
                    mangaId:mangaId,
                    mangaName:manga.name||"",
                    uid:String(user.uid),
                    rating:n,
                    updatedAt:firebase.firestore.FieldValue.serverTimestamp()
                },{merge:true});

                // بعد الحفظ نعيد حساب المتوسط الحقيقي من كل التقييمات.
                await refreshMangaRatingFromCloud();
                showToast("تم حفظ تقييمك: "+n+"/5 ⭐");
            }catch(e){
                console.error("تعذر حفظ تقييم المانجا على Firebase:",e);

                // لو حصل خطأ في الحفظ نرجع تقييم المستخدم المحلي القديم.
                if(oldLocal>=1&&oldLocal<=5){
                    localStorage.setItem("mangaZERO_user_rating_"+mangaId,String(oldLocal));
                }else{
                    localStorage.removeItem("mangaZERO_user_rating_"+mangaId);
                }

                await refreshMangaRatingFromCloud();
                showToast(e&&e.code==="permission-denied"
                    ?"Firebase رفض حفظ التقييم — راجع قواعد Firestore"
                    :"تعذر حفظ التقييم، حاول مرة أخرى");
            }
        };
    });
    if(displayStars)displayStars.onclick=function(){
        if(ratePicker){ratePicker.classList.add("open");ratePicker.scrollIntoView({behavior:"smooth",block:"nearest"});}
    };
    if(adminMode){
        const head=document.getElementById("chapterAddHeader"),form=document.getElementById("chapterAddForm"),plus=document.getElementById("chapterAddPlus");
        head.onclick=function(){form.classList.toggle("open");plus.textContent=form.classList.contains("open")?"−":"＋"};
        document.getElementById("saveChapter").onclick=function(){addChapter(manga.id)};
    }
    renderChapterList(manga, adminMode);
    loadMangaComments(manga);
}

function renderChapterList(manga, forceAdmin){
    publicChapterList.innerHTML="";
    const list=Array.isArray(manga.chapters)?manga.chapters:[];
    if(!list.length){publicChapterList.innerHTML='<div class="manga-section-card"><div class="page-empty">لا توجد فصول حتى الآن.</div></div>';return;}
    const box=document.createElement("div");box.className="manga-section-card";
    box.innerHTML='<div class="manga-section-head"><strong>📚 فصول المانجا</strong><span>'+list.length+' فصل</span></div><div class="chapter-list"></div>';
    const listBox=box.querySelector(".chapter-list");
    list.slice().reverse().forEach(function(ch,index){
        const item=document.createElement("div");item.className="chapter-item";
        const pages=Array.isArray(ch.pages)?ch.pages.length:0;
        const date=ch.createdAt?new Date(Number(ch.createdAt)).toLocaleDateString("ar-EG"):"";
        // Delete controls are intentionally shown only inside the explicit Admin
        // "إدارة الفصول" view, never in the normal manga/library view.
        const adminCanDelete = forceAdmin === true &&
            mzAdminChapterManagementMode === true &&
            typeof window.mzIsAdmin === "function" && window.mzIsAdmin();

        const main=document.createElement("button");
        main.type="button";
        main.className="chapter-main-click";
        main.innerHTML='<div class="chapter-main-text"><div class="chapter-name"></div><div class="chapter-meta"></div></div><span class="chapter-read">قراءة ←</span>';
        main.querySelector(".chapter-name").textContent=ch.title||("الفصل "+(list.length-index));
        main.querySelector(".chapter-meta").textContent="📄 "+pages+" صفحة"+(date?" • "+date:"");
        main.onclick=function(e){
            e.preventDefault();
            e.stopPropagation();
            openChapterReader(manga,ch);
        };
        main.onkeydown=function(e){
            if(e.key==="Enter"||e.key===" "){
                e.preventDefault();
                e.stopPropagation();
                openChapterReader(manga,ch);
            }
        };

        item.appendChild(main);

        if(adminCanDelete){
            const actions=document.createElement("div");
            actions.className="chapter-item-actions chapter-delete-outside";
            const del=document.createElement("button");
            del.type="button";
            del.className="chapter-delete-btn";
            del.textContent="🗑️ حذف الفصل";
            del.title="حذف الفصل للأدمن فقط";
            del.onclick=function(e){
                e.preventDefault();
                e.stopPropagation();
                deleteChapter(manga,ch);
            };
            actions.appendChild(del);
            item.appendChild(actions);
        }

        listBox.appendChild(item);
    });
    publicChapterList.appendChild(box);
}

async function deleteChapter(manga,ch){
    if(!(typeof window.mzIsAdmin === "function" && window.mzIsAdmin())){
        showToast("حذف الفصول متاح للأدمن فقط");
        return;
    }
    if(!manga || !ch)return;

    const title=ch.title||"هذا الفصل";
    const confirmed=window.confirm("هل تريد حذف «"+title+"» نهائيًا من الموقع؟\n\nسيتم حذف الفصل من قاعدة البيانات، لكن صور Cloudinary القديمة لن تُحذف تلقائيًا من المتصفح.");
    if(!confirmed)return;

    const oldChapters=Array.isArray(manga.chapters)?manga.chapters.slice():[];
    const oldLocal=JSON.stringify(mangaList);
    const chapterId=String(ch.id||"");

    manga.chapters=oldChapters.filter(function(item){
        return String(item&&item.id||"")!==chapterId;
    });

    try{
        if(window.mzSaveMangaToCloud){
            await window.mzSaveMangaToCloud(manga);
        }else{
            throw new Error("Firebase غير مهيأ");
        }

        localStorage.setItem("mangaZERO_manga",JSON.stringify(mangaList));
        renderManga();

        if(String(currentChapterReaderId||"")===chapterId){
            if(typeof closeChapterReader==="function")closeChapterReader();
            else{
                const reader=document.getElementById("chapterReader");
                if(reader)reader.style.display="none";
                document.body.removeAttribute("data-chapter-reader");
            }
        }

        renderChapterList(manga, true);
        showToast("تم حذف الفصل «"+title+"» بنجاح 🗑️");
    }catch(e){
        console.error("delete chapter failed:",e);
        try{
            const restored=JSON.parse(oldLocal);
            mangaList=Array.isArray(restored)?restored:mangaList;
        }catch(_e){}
        const restoredManga=mangaList.find(function(x){return String(x.id)===String(manga.id)});
        if(restoredManga && Array.isArray(restoredManga.chapters))manga.chapters=restoredManga.chapters;
        localStorage.setItem("mangaZERO_manga",JSON.stringify(mangaList));
        renderManga();
        renderChapterList(restoredManga||manga);
        showToast(e&&e.code==="permission-denied"?"Firebase رفض حذف الفصل — تأكد أن الحساب أدمن":"تعذر حذف الفصل، حاول مرة أخرى");
    }
}

// احتياطي إضافي: فتح الفصل حتى لو حصل تعارض مع أي مستمع click آخر.
document.addEventListener("click",function(e){
    const item=e.target&&e.target.closest?e.target.closest("#publicChapterList .chapter-item"):null;
    if(!item)return;
    if(e.target && e.target.closest && e.target.closest('.chapter-delete-btn'))return;
    if(e.defaultPrevented)return;
    const manga=window.currentMangaPage || mangaList.find(function(x){return String(x.id)===String(currentMangaId);});
    if(!manga)return;
    const chapterId=item.getAttribute("data-chapter-id")||"";
    const ch=(Array.isArray(manga.chapters)?manga.chapters:[]).find(function(x){return String(x&&x.id||"")===chapterId;});
    if(!ch)return;
    e.preventDefault();
    e.stopPropagation();
    openChapterReader(manga,ch);
},true);

async function compressChapterImage(file,maxW=10000,maxH=10000,quality=1){
    // صفحات المانجا: لا نعيد ترميز أو ضغط الصورة الأصلية.
    // هذا يمنع فقدان النص والتفاصيل الدقيقة قبل الرفع إلى Cloudinary.
    if(!file || !file.type || file.type.indexOf("image/")!==0) return file;
    return file;
}

function uploadChapterImage(file,folder,onProgress){
    return new Promise(function(resolve,reject){
        const xhr = new XMLHttpRequest();
        const formData = new FormData();

        formData.append("file", file);
        formData.append("upload_preset", MZ_CLOUDINARY_UPLOAD_PRESET);
        formData.append("folder", folder);
        formData.append("tags", "mangazero,chapter");

        xhr.open("POST", MZ_CLOUDINARY_UPLOAD_URL, true);
        xhr.timeout = 120000;

        xhr.upload.onprogress = function(event){
            if(onProgress){
                onProgress(event.loaded || 0, event.total || 0);
            }
        };

        xhr.onload = function(){
            let data = null;
            try{
                data = JSON.parse(xhr.responseText || "{}");
            }catch(e){}

            if(xhr.status >= 200 && xhr.status < 300 && data && data.secure_url){
                resolve(data.secure_url);
                return;
            }

            const message =
                (data && (data.error && data.error.message || data.message)) ||
                ("Cloudinary upload failed (" + xhr.status + ")");

            const err = new Error(message);
            err.code = "cloudinary/upload-failed";
            reject(err);
        };

        xhr.onerror = function(){
            const err = new Error("تعذر الاتصال بـ Cloudinary");
            err.code = "cloudinary/network-error";
            reject(err);
        };

        xhr.ontimeout = function(){
            const err = new Error("انتهت مهلة رفع الصفحة");
            err.code = "cloudinary/timeout";
            reject(err);
        };

        xhr.send(formData);
    });
}

async function addChapter(id){
    if(!window.mzCanManageManga||!window.mzCanManageManga()){showToast("إضافة الفصول للأدمن أو المساعدين فقط");return;}
    const user=window.currentUser;if(!user){showToast("سجل دخولك أولًا");return;}
    const manga=mangaList.find(function(x){return String(x.id)===String(id)});if(!manga)return;
    const t=document.getElementById("chapterTitleInput"),f=document.getElementById("chapterPagesInput"),title=t.value.trim(),files=Array.from(f.files||[]);
    if(!title){showToast("اكتب اسم الفصل الأول");return;}
    if(!files.length){showToast("اختار صور صفحات الفصل");return;}
    const btn=document.getElementById("saveChapter");btn.disabled=true;btn.textContent="جاري رفع الفصل 0%...";
    try{
        try{await user.getIdToken(true)}catch(e){console.warn("Token refresh failed:",e)}
        const chapterId=String(Date.now());
        const cloudFolder="MangaZERO/chapters/"+String(manga.id)+"/"+chapterId;
        const pages=[];

        for(let i=0;i<files.length;i++){
            btn.textContent="جاري تجهيز الصفحة "+(i+1)+" من "+files.length+"...";
            const source=await compressChapterImage(files[i]);

            btn.textContent="جاري رفع الصفحة "+(i+1)+" من "+files.length+"...";

            const url=await uploadChapterImage(
                source,
                cloudFolder,
                function(done,total){
                    const local=total?Math.round(done/total*100):0;
                    const overall=Math.round((i+local/100)/files.length*100);
                    btn.textContent="جاري رفع الفصل "+overall+"%...";
                }
            );

            pages.push(url);
        }

        if(!pages.length)throw new Error("لم يتم رفع أي صفحة");

        if(!Array.isArray(manga.chapters))manga.chapters=[];
        const chapter={
            id:chapterId,
            title:title,
            pages:pages,
            createdAt:Date.now()
        };

        manga.chapters.push(chapter);

        if(window.mzSaveMangaToCloud)await window.mzSaveMangaToCloud(manga);

        localStorage.setItem("mangaZERO_manga",JSON.stringify(mangaList));
        renderManga();
        openMangaPage(manga,true);
        startMangaCloudListener();
        showToast("تم رفع الفصل على Cloudinary وحفظه، وسيظهر لكل الناس تلقائيًا ✅");
    }catch(e){
        console.error("Chapter upload failed:",e);
        showToast("فشل رفع الفصل: "+(e&&e.message?e.message:"خطأ غير معروف"));
    }finally{btn.disabled=false;btn.textContent="➕ نشر الفصل"}
}
let mzAdminChapterManagementMode=false;
let chapterCommentsUnsub=null;
let currentChapterReaderMangaId=null;
let currentChapterReaderId=null;

function chapterCommentSafe(v){
    return String(v==null?'':v).replace(/[&<>'"]/g,function(c){
        return ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]);
    });
}

function getChapterCommentsBox(){
    return document.getElementById("chapterCommentsBox");
}

function renderChapterComments(manga,ch,comments){
    const box=getChapterCommentsBox();
    if(!box)return;
    const arr=Array.isArray(comments)?comments:[];
    const uid=window.currentUser&&window.currentUser.uid?String(window.currentUser.uid):"";
    const admin=typeof window.mzIsAdmin==="function"?window.mzIsAdmin():false;

    const canWrite=!!window.currentUser;

    // مربع الكتابة وزر النشر بيتبنوا مرة واحدة بس. إعادة بناءهم مع كل تحديث من
    // Firebase كانت بتمسح اللي المستخدم بيكتبه وتقفل الكيبورد، فالمكان يبان متجمد.
    let input=box.querySelector("#chapterCommentInput");
    let btn=box.querySelector("#addChapterCommentBtn");
    if(!input||!btn||!box.querySelector("#chapterCommentsList")){
        box.innerHTML='<div class="chapter-comments-box"><div class="comment-form"><input id="chapterCommentInput" autocomplete="off" type="text" maxlength="300"><button id="addChapterCommentBtn" type="button">➕ نشر التعليق</button></div><div id="chapterCommentsList"></div></div>';
        input=box.querySelector("#chapterCommentInput");
        btn=box.querySelector("#addChapterCommentBtn");
        if(input)input.addEventListener("keydown",function(e){
            if(e.key==="Enter"&&!e.shiftKey){
                e.preventDefault();
                const b=document.getElementById("addChapterCommentBtn");
                if(b&&!b.disabled)b.click();
            }
        });
    }
    if(input){
        input.disabled=!canWrite;
        input.placeholder=canWrite?("اكتب تعليقك عن "+String(ch.title||"الفصل")+"..."):"سجل دخولك أولًا لكتابة تعليق";
    }
    if(btn){
        const busy=btn.dataset&&btn.dataset.mzBusy==="1";
        if(!busy){btn.disabled=!canWrite;btn.textContent="➕ نشر التعليق";}
    }

    let h='';

    if(!arr.length){
        h+='<div class="page-empty" style="padding:20px 5px;">لسه مفيش تعليقات على الفصل ده. كن أول واحد يكتب تعليق ✨</div>';
    }else{
        arr.forEach(function(c){
            c=c||{};
            const isAdminComment=String(c.email||"").toLowerCase()==="maxking1789@gmail.com";
            const name=isAdminComment?"𝑴𝒂𝒙𝑲𝒊𝒏𝒈":(c.user||"مستخدم");
            const titleInfo={
                admin:["👑","ADMIN","admin"],
                moderator:["🛡️","مشرف","mod"],
                supporter:["💎","داعم","support"],
                member:["👤","عضو","member"],veteran:["⚡","مخضرم","veteran"]
            };
            const titleArr=window.mzGetUserTitles?window.mzGetUserTitles(c):[mzCommentNormalizeTitle(c.title)];
            const st=titleArr[0];
            const ti=titleInfo[st]||titleInfo.member;
            const verified=(st==="admin"||c.verified===true)?' <span class="mz-verified-badge" title="حساب موثّق">✓</span>':"";
            const badge=isAdminComment
                ? '<span class="admin-name-wrap">'+chapterCommentSafe(name)+'</span> <span class="admin-badge"><span class="admin-badge-crown">👑</span>ADMIN <span class="mz-verified-badge" title="حساب موثّق">✓</span></span>'
                : '<span class="mz-comment-name mz-title-name-'+ti[2]+'">'+chapterCommentSafe(name)+'</span> '+titleArr.map(function(k){var z=titleInfo[k]||titleInfo.member;var vv=(k==="admin"||c.verified===true)?' <span class="mz-verified-badge" title="حساب موثّق">✓</span>':"";return '<span class="mz-title-badge mz-title-'+z[2]+'">'+z[0]+" "+z[1]+vv+'</span>';}).join(" " );
            const mine=!!uid&&String(c.uid||"")===uid;
            const cid=chapterCommentSafe(String(c.id||""));
            h+='<div class="chapter-comment-item">';
            h+='<div class="chapter-comment-user mz-profile-click-target" '+(c.uid?'data-chapter-open-profile="'+chapterCommentSafe(String(c.uid||''))+'" role="button" tabindex="0"':'')+'>';
            h+=(c.photoURL?'<img class="chapter-comment-avatar" src="'+chapterCommentSafe(c.photoURL)+'" alt="صورة المستخدم">':'<span class="chapter-comment-avatar"><span class="chapter-comment-avatar-fallback">👤</span></span>');
            h+='<div class="chapter-comment-user-main">'+badge+'</div></div>';
            h+='<div class="chapter-comment-text">'+chapterCommentSafe(c.text||"")+'</div>';
            h+='<div class="chapter-comment-actions">';
            if(mine&&!isAdminComment)h+='<button class="chapter-comment-action" data-chapter-edit-comment="'+cid+'">✏️ تعديل</button><button class="chapter-comment-action" data-chapter-delete-comment="'+cid+'">🗑️ حذف</button>';
            if(!mine)h+='<button class="chapter-comment-action" data-chapter-report-comment="'+cid+'">🚩 إبلاغ</button>';
            if(admin)h+='<button class="chapter-comment-action" data-chapter-admin-delete-comment="'+cid+'">🗑️ حذف التعليق</button>';
            h+='</div></div>';
        });
    }
    const listEl=box.querySelector("#chapterCommentsList");
    if(listEl)listEl.innerHTML=h;

    if(btn)btn.onclick=function(){
        publishChapterComment(manga,ch,input,btn);
    };

    box.querySelectorAll("[data-chapter-edit-comment]").forEach(function(b){
        b.onclick=async function(){
            const id=String(b.dataset.chapterEditComment||"");
            const c=arr.find(function(x){return String(x&&x.id)===id;});
            if(!c)return;
            const t=prompt("عدّل تعليقك:",c.text||"");
            if(t===null||!t.trim())return;
            try{
                if(window.mzFirestore){
                    await window.mzFirestore.collection("mangaZERO_chapter_comments").doc(id).update({text:t.trim(),updatedAt:Date.now()});
                }
                showToast("تم تعديل تعليق الفصل ✏️");
            }catch(e){
                console.error(e);
                showToast("تعذر تعديل التعليق");
            }
        };
    });

    box.querySelectorAll("[data-chapter-delete-comment]").forEach(function(b){
        b.onclick=async function(){
            const id=String(b.dataset.chapterDeleteComment||"");
            if(!confirm("حذف تعليقك؟"))return;
            try{
                if(window.mzFirestore){
                    await window.mzFirestore.collection("mangaZERO_chapter_comments").doc(id).delete();
                }
                showToast("تم حذف تعليق الفصل 🗑️");
            }catch(e){
                console.error(e);
                showToast("تعذر حذف التعليق");
            }
        };
    });

    box.querySelectorAll("[data-chapter-admin-delete-comment]").forEach(function(b){
        b.onclick=async function(){
            const id=String(b.dataset.chapterAdminDeleteComment||"");
            if(!confirm("هل تريد حذف هذا التعليق نهائيًا؟"))return;
            try{
                if(window.mzFirestore){
                    await window.mzFirestore.collection("mangaZERO_chapter_comments").doc(id).delete();
                }
                showToast("تم حذف التعليق 🗑️");
            }catch(e){
                console.error(e);
                showToast("تعذر حذف التعليق");
            }
        };
    });

    box.querySelectorAll("[data-chapter-open-profile]").forEach(function(b){
        const open=function(e){if(e){e.preventDefault();e.stopPropagation();}if(typeof window.mzOpenPublicProfile==='function')window.mzOpenPublicProfile(b.getAttribute('data-chapter-open-profile'));};
        b.onclick=open;
        b.onkeydown=function(e){if(e.key==='Enter'||e.key===' '){open(e);}};
    });

    box.querySelectorAll("[data-chapter-report-comment]").forEach(function(b){
        b.onclick=function(){
            reportChapterComment(manga,ch,String(b.dataset.chapterReportComment||""));
        };
    });
}

async function hydrateChapterCommentProfiles(arr,manga,ch){
    if(!window.mzFirestore||!Array.isArray(arr)||!arr.length)return;
    const ids=[...new Set(arr.map(function(c){return String(c.uid||'');}).filter(Boolean))];
    let changed=false;
    await Promise.all(ids.map(async function(uid){
        const d=window.mzGetPublicProfile?await window.mzGetPublicProfile(uid):null;
        if(!d)return;
        arr.filter(function(c){return String(c.uid||'')===uid;}).forEach(function(c){
            const name=String(d.username||d.name||c.user||'مستخدم');
            const title=mzCommentNormalizeTitle(d.title);
            const titles=window.mzGetUserTitles?window.mzGetUserTitles(d):[title];
            const verified=String(d.email||'').toLowerCase()===ADMIN_EMAIL.toLowerCase()||d.verified===true;
            const photo=String(d.photoURL||'');
            if(c.user!==name){c.user=name;changed=true;}
            if(JSON.stringify(window.mzGetUserTitles?window.mzGetUserTitles(c):[mzCommentNormalizeTitle(c.title)])!==JSON.stringify(titles)){c.titles=titles.slice();c.title=title;changed=true;}
            if(!!c.verified!==verified){c.verified=verified;changed=true;}
            if(String(c.photoURL||'')!==photo){c.photoURL=photo;changed=true;}
        });
    }));
    if(changed)renderChapterComments(manga,ch,arr);
}

async function publishChapterComment(manga,ch,input,btn){
    if(!window.currentUser){
        showToast("سجل دخولك الأول عشان تقدر تعلق");
        return;
    }
    const text=String(input&&input.value||"").trim();
    if(!text){
        showToast("اكتب التعليق الأول");
        if(input)input.focus();
        return;
    }
    if(text.length>300){
        showToast("التعليق لا يمكن أن يتجاوز 300 حرف");
        return;
    }
    if(typeof mzHasBadWord==="function" && mzHasBadWord(text)){
        showToast("التعليق فيه كلام مش مناسب. عدّله وجرب تاني 🙏");
        if(input)input.focus();
        return;
    }
    if(!window.mzFirestore){
        showToast("Firebase غير متصل، لا يمكن نشر التعليق");
        return;
    }
    if(btn){btn.dataset.mzBusy="1";btn.disabled=true;btn.textContent="جاري النشر...";}
    try{
        const u=window.currentUser;
        const freshTitle=await getFreshCurrentUserTitle(u);
        const freshVerified=await getFreshCurrentUserVerified(u);
        const profile=window.mzProfileUserData||{};
        const c={
            mangaId:String(manga.id||""),
            mangaName:String(manga.name||""),
            chapterId:String(ch.id||""),
            chapterTitle:String(ch.title||"الفصل"),
            user:profile.username||u.displayName||u.email||"مستخدم",
            title:freshTitle,
            titles:(window.mzGetUserTitles?window.mzGetUserTitles(window.mzProfileUserData||{title:freshTitle}):[freshTitle]),
            verified:freshVerified,
            email:u.email||"",
            uid:u.uid||"",
            text:text,
            photoURL:profile.photoURL||u.photoURL||"",
            createdAt:Date.now()
        };
        await window.mzFirestore.collection("mangaZERO_chapter_comments").add(c);
        // تسجيل التعليق في المهمة اليومية بعد نجاح حفظه فعليًا.
        try{
            if(typeof window.mzTaskEvent==="function")window.mzTaskEvent("comment",String(c.chapterId||Date.now())+"_"+String(c.createdAt||Date.now()));
        }catch(taskErr){console.warn("daily chapter-comment task event failed",taskErr);}
        if(input)input.value="";
        showToast("تم نشر تعليق الفصل ✅");
    }catch(e){
        console.error("chapter comment publish failed",e);
        showToast("تعذر نشر تعليق الفصل: "+(e&&e.message?e.message:"تحقق من Firebase Rules"));
    }finally{
        if(btn){delete btn.dataset.mzBusy;btn.disabled=false;btn.textContent="➕ نشر التعليق";}
    }
}

async function reportChapterComment(manga,ch,commentId){
    try{
        if(typeof guardRestricted==='function'&&!guardRestricted('report'))return;
        const u=window.currentUser;if(!u){showToast("سجل دخولك الأول عشان تبلغ 🚩");return;}
        if(!window.mzFirestore){showToast("الإبلاغ غير متاح حاليًا");return;}
        let comment=null;
        const snap=await window.mzFirestore.collection("mangaZERO_chapter_comments").doc(String(commentId)).get();
        if(snap.exists)comment=Object.assign({id:snap.id},snap.data()||{});
        if(!comment){showToast("لم يتم العثور على التعليق المطلوب");return;}
        const reason=await new Promise(function(resolve){
            const overlay=document.createElement('div');overlay.className='mz-report-overlay';
            overlay.innerHTML='<div class="mz-report-modal" role="dialog" aria-modal="true"><div class="mz-report-title">🚩 الإبلاغ عن تعليق الفصل</div><div class="mz-report-subtitle">اكتب سبب البلاغ عشان الإدارة تقدر تراجع التعليق.</div><textarea class="mz-report-textarea" maxlength="500" placeholder="اكتب سبب البلاغ هنا..."></textarea><div class="mz-report-actions"><button type="button" class="mz-report-cancel">إلغاء</button><button type="button" class="mz-report-send">إرسال البلاغ 🚩</button></div></div>';
            const ta=overlay.querySelector('.mz-report-textarea'),cancel=overlay.querySelector('.mz-report-cancel'),send=overlay.querySelector('.mz-report-send');
            function close(v){overlay.remove();document.body.style.overflow='';resolve(v);}cancel.onclick=function(){close(null);};overlay.addEventListener('click',function(ev){if(ev.target===overlay)close(null);});send.onclick=function(){const v=ta.value.trim();if(!v){ta.focus();showToast('اكتب سبب البلاغ الأول');return;}send.disabled=true;close(v);};document.body.appendChild(overlay);document.body.style.overflow='hidden';setTimeout(function(){ta.focus();},30);
        });
        if(reason===null)return;
        await window.mzFirestore.collection('mangaZERO_reports').add({
            type:'chapter_comment',mangaId:String(manga.id||''),mangaName:String(manga.name||''),chapterId:String(ch.id||''),chapterTitle:String(ch.title||'الفصل'),commentId:String(commentId),commentText:String(comment.text||''),commentUser:String(comment.user||'مستخدم'),commentUid:String(comment.uid||''),commentEmail:String(comment.email||''),reportedByUid:String(u.uid||''),reportedByEmail:String(u.email||''),reason:String(reason).slice(0,500),status:'open',createdAt:firebase.firestore.FieldValue.serverTimestamp()
        });
        showToast('تم إرسال البلاغ للإدارة 🚩');
    }catch(e){console.error('reportChapterComment failed:',e);showToast(e&&e.code==='permission-denied'?'ليس لديك صلاحية إرسال البلاغ':'تعذر إرسال البلاغ، حاول مرة أخرى');}
}



function renderNextChapterButton(manga,ch){
    const wrap=document.getElementById("nextChapterWrap");
    if(!wrap)return;

    wrap.innerHTML="";
    const list=Array.isArray(manga.chapters)?manga.chapters:[];
    const currentIndex=list.findIndex(function(x){
        return String(x&&x.id||"")===String(ch&&ch.id||"");
    });

    // chapters are stored in upload order, so the next chapter is the
    // following item in that same order.
    const next=(currentIndex>=0&&currentIndex<list.length-1)?list[currentIndex+1]:null;

    if(!next)return;

    const btn=document.createElement("button");
    btn.type="button";
    btn.className="next-chapter-btn";
    btn.innerHTML='<span class="next-chapter-label">الفصل التالي</span><span class="next-chapter-name"></span>';
    btn.querySelector(".next-chapter-name").textContent=next.title||"الفصل التالي";

    btn.onclick=function(){
        openChapterReader(manga,next);
        window.scrollTo({top:0,behavior:"smooth"});
    };

    wrap.appendChild(btn);
}

function getChapterNumber(manga,ch){
    const list=Array.isArray(manga&&manga.chapters)?manga.chapters:[];
    const index=list.findIndex(function(x){
        return String(x&&x.id||"")===String(ch&&ch.id||"");
    });
    return index>=0 ? index+1 : null;
}

function openChapterReader(manga,ch){
    try{
        if(typeof window.mzRecordChapterRead === "function"){
            window.mzRecordChapterRead(manga,ch).catch(function(e){console.warn("reading history error",e)});
        }
    }catch(e){
        console.warn("reading history error",e);
    }
    if(chapterCommentsUnsub){
        try{chapterCommentsUnsub();}catch(e){}
        chapterCommentsUnsub=null;
    }
    currentChapterReaderMangaId=String(manga.id||"");
    currentChapterReaderId=String(ch.id||"");

    // تسجيل قراءة الفصل مباشرة عند فتحه؛ الاعتماد على زر الفصل أو متغير window
    // كان يجعل مهمة القراءة لا تُحدّث في بعض طرق فتح الفصل.
    try{
        const mzChapterEventId=String(ch.id||currentChapterReaderId||Date.now());
        if(typeof window.mzTaskEvent==="function")window.mzTaskEvent("read",mzChapterEventId);
    }catch(taskErr){console.warn("daily read task event failed",taskErr);}

    chapterListView.style.display="none";
    mangaCommentsView.style.display="none";
    mangaPageActions.style.display="none";
    document.body.setAttribute("data-chapter-reader","1");
    chapterReader.style.display="block";

    readerTitle.textContent=ch.title||"الفصل";
    readerPages.innerHTML="";
    const pages=Array.isArray(ch.pages)?ch.pages:[];
    pages.forEach(function(src,index){
        const img=document.createElement("img");
        img.src=src;
        img.alt=(ch.title||"الفصل")+" - صفحة "+(index+1);
        img.loading=index<2?"eager":"lazy";
        img.decoding="async";
        readerPages.appendChild(img);
    });

    // Request the ad only after the chapter reader is visible and has a real width.
    // Recreate the <ins> for each chapter opening so AdSense never receives a second
    // push for the same already-processed element.
    try{
        const adWrap=document.getElementById("mzChapterAd");
        if(adWrap){
            const oldAd=adWrap.querySelector(".adsbygoogle");
            if(oldAd){
                const freshAd=oldAd.cloneNode(false);
                freshAd.removeAttribute("data-adsbygoogle-status");
                freshAd.removeAttribute("data-ad-status");
                freshAd.style.display="block";
                adWrap.replaceChild(freshAd,oldAd);
            }
            requestAnimationFrame(function(){
                requestAnimationFrame(function(){
                    const ad=adWrap.querySelector(".adsbygoogle");
                    if(!ad || !document.body.hasAttribute("data-chapter-reader"))return;
                    if(ad.getBoundingClientRect().width < 250){
                        console.warn("AdSense chapter ad skipped: container is too narrow");
                        return;
                    }
                    try{
                        window.adsbygoogle=window.adsbygoogle||[];
                        window.adsbygoogle.push({});
                    }catch(adErr){
                        console.warn("AdSense chapter ad request failed",adErr);
                    }
                });
            });
        }
    }catch(e){
        console.warn("AdSense init failed",e);
    }

    const ccTitle=document.getElementById("chapterCommentsChapterName");
    if(ccTitle)ccTitle.textContent="بعد آخر صفحة • "+String(ch.title||"الفصل");

    renderChapterComments(manga,ch,[]);
    renderNextChapterButton(manga,ch);

    if(window.mzFirestore){
        try{
            const q=window.mzFirestore.collection("mangaZERO_chapter_comments")
                .where("mangaId","==",String(manga.id||""))
                .where("chapterId","==",String(ch.id||""));
            chapterCommentsUnsub=q.onSnapshot(function(snap){
                const arr=[];
                snap.forEach(function(d){
                    arr.push(Object.assign({id:d.id},d.data()||{}));
                });
                arr.sort(function(a,b){return Number(b.createdAt||0)-Number(a.createdAt||0);});
                renderChapterComments(manga,ch,arr);
                hydrateChapterCommentProfiles(arr,manga,ch);
            },function(e){
                console.warn("تعذر تحميل تعليقات الفصل",e);
            });
        }catch(e){
            console.warn("chapter comments listener failed",e);
        }
    }

    window.scrollTo(0,0);
}
function openMangaCommentsNow(e){
    if(e){e.preventDefault();e.stopPropagation();}
    const activeManga=window.currentMangaPage || mangaList.find(function(x){return String(x.id)===String(currentMangaId);});
    if(!activeManga){showToast("افتح صفحة المانجا أولًا");return false;}
    if(mangaPageActions)mangaPageActions.style.setProperty("display","grid","important");
    if(mangaPageActions)mangaPageActions.style.setProperty("visibility","visible","important");
    if(mangaCommentsView)mangaCommentsView.style.setProperty("display","block","important");
    setActiveMangaTab("comments");
    try{renderComments(activeManga);}catch(err){console.error("open comments:",err);}
    setTimeout(function(){
        const ci=document.getElementById("commentInput");
        if(ci&&!ci.disabled){ci.focus();ci.scrollIntoView({behavior:"smooth",block:"center"});}
        else if(mangaCommentsView)mangaCommentsView.scrollIntoView({block:"nearest",behavior:"smooth"});
    },120);
    return false;
}
window.openMangaCommentsNow=openMangaCommentsNow;

// نشر التعليق من أي مكان حتى لو زر النشر اتولد ديناميكيًا.
// يستخدم نفس Firebase collection ويمنع مشكلة الزر الذي يبدو وكأنه لا يعمل.
let mzCommentPublishBusy=false;
async function mzPublishCommentFromUI(btn){
    if(mzCommentPublishBusy)return;

    // منع إرسال أكثر من تعليق خلال 20 ثانية لكل حساب.
    const currentUserForCooldown=window.currentUser;
    if(currentUserForCooldown&&currentUserForCooldown.uid){
        const key="mangaZERO_comment_cooldown_"+String(currentUserForCooldown.uid);
        const last=Number(localStorage.getItem(key)||0);
        const remaining=20000-(Date.now()-last);
        if(remaining>0){
            const seconds=Math.ceil(remaining/1000);
            if(btn){btn.disabled=true;btn.textContent="⏳ انتظر "+seconds+" ث";}
            showToast("⏳ لازم تستنى "+seconds+" ثانية قبل التعليق مرة تانية");
            return;
        }
    }
    const manga=window.currentMangaPage || mangaList.find(function(x){return String(x.id)===String(currentMangaId);});
    if(!manga){showToast("افتح صفحة المانجا أولًا");return;}
    const u=window.currentUser;
    if(!u){showToast("سجل دخولك الأول عشان تقدر تعلق");return;}
    const isAdminUser=String(u.email||'').toLowerCase()==='maxking1789@gmail.com';
    // التعليقات متاحة لكل حساب مسجل الدخول.
    if(!u){showToast('سجل دخولك الأول عشان تقدر تعلق');return;}
    const input=document.getElementById('commentInput');
    let text=input ? String(input.value||'').trim() : '';
    // لو واجهة الإدخال لم تكن موجودة أو الزر تم الضغط عليه من نسخة قديمة، اطلب النص مباشرة.
    if(!text){
        text=String(window.prompt('اكتب تعليقك:','')||'').trim();
    }
    if(!text){showToast('اكتب التعليق الأول');return;}
    if(text.length>300){showToast('التعليق لا يمكن أن يتجاوز 300 حرف');return;}
    if(typeof mzHasBadWord==='function' && mzHasBadWord(text)){
        showToast('التعليق فيه كلام مش مناسب. عدّله وجرب تاني 🙏');
        if(input)input.focus();
        return;
    }
    if(!window.mzFirestore){showToast('Firebase غير متصل، لا يمكن نشر التعليق');return;}
    mzCommentPublishBusy=true;
    if(btn){btn.dataset.mzBusy='1';btn.disabled=true;btn.textContent='جاري النشر...';}
    try{
        const freshTitle=await getFreshCurrentUserTitle(u);
        const freshVerified=await getFreshCurrentUserVerified(u);
        const c={
            mangaId:String(manga.id||''),
            mangaName:String(manga.name||''),
            user:(window.mzProfileUserData&&window.mzProfileUserData.username)||u.displayName||u.email||'مستخدم',
            title:freshTitle,
            titles:(window.mzGetUserTitles?window.mzGetUserTitles(window.mzProfileUserData||{title:freshTitle}):[freshTitle]),
            verified:freshVerified,
            email:u.email||'',
            uid:u.uid||'',
            text:text,
            createdAt:Date.now()
        };
        await window.mzFirestore.collection('mangaZERO_comments').add(c);
        // تسجيل التعليق في المهمة اليومية بعد نجاح حفظه فعليًا.
        try{
            if(typeof window.mzTaskEvent==='function')window.mzTaskEvent('comment',String(c.mangaId||'manga')+'_'+String(c.createdAt||Date.now()));
        }catch(taskErr){console.warn('daily manga-comment task event failed',taskErr);}
        if(input)input.value='';
        if(u&&u.uid){
            localStorage.setItem("mangaZERO_comment_cooldown_"+String(u.uid),String(Date.now()));
            mzStartCommentCooldown(btn,20000);
        }
        showToast('تم نشر التعليق ✅');
    }catch(e){
        console.error('MangaZERO comment publish failed:',e);
        const code=e&&e.code?String(e.code):'';
        const msg=e&&e.message?String(e.message):'';
        showToast('فشل نشر التعليق: '+(code||msg||'تحقق من Firebase Rules'));
    }finally{
        mzCommentPublishBusy=false;
        if(btn){delete btn.dataset.mzBusy;btn.disabled=false;btn.textContent='➕ نشر التعليق';}
    }
}


function mzStartCommentCooldown(btn,duration){
    if(!btn)return;
    const end=Date.now()+Number(duration||20000);
    btn.disabled=true;
    clearInterval(btn.__mzCommentCooldownTimer);
    const tick=function(){
        const left=Math.max(0,end-Date.now());
        if(left<=0){
            clearInterval(btn.__mzCommentCooldownTimer);
            btn.__mzCommentCooldownTimer=null;
            btn.disabled=false;
            btn.textContent='➕ نشر التعليق';
            return;
        }
        btn.disabled=true;
        btn.textContent='⏳ انتظر '+Math.ceil(left/1000)+' ث';
    };
    tick();
    btn.__mzCommentCooldownTimer=setInterval(tick,250);
}

function mzRestoreCommentCooldown(){
    const u=window.currentUser;
    const btn=document.getElementById('addCommentBtn');
    if(!u||!u.uid||!btn)return;
    const last=Number(localStorage.getItem('mangaZERO_comment_cooldown_'+String(u.uid))||0);
    const left=20000-(Date.now()-last);
    if(left>0)mzStartCommentCooldown(btn,left);
}

// Event delegation: يعمل حتى لو زر النشر اتولد بعد إعادة رسم واجهة التعليقات.
// Capture=true يجعل الضغط يصل إلى هذا المعالج حتى لو عنصر آخر حاول اعتراض الـ click.
document.addEventListener('click',function(e){
    const target=e.target&&e.target.closest?e.target.closest('#addCommentBtn'):null;
    if(!target)return;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    mzPublishCommentFromUI(target);
},true);

// Event delegation: يعمل حتى لو زر أضف تعليق اتولد ديناميكيًا أو اتعاد رسمه.
document.addEventListener("click",function(e){
    const target=e.target&&e.target.closest?e.target.closest("#mangaCommentQuick"):null;
    if(target){openMangaCommentsNow(e);}
},true);

if(showCommentsBtn)showCommentsBtn.onclick=function(e){
    openMangaCommentsNow(e);
};
if(showChaptersBtn)showChaptersBtn.onclick=function(e){
    if(e)e.preventDefault();
    if(mangaPageActions)mangaPageActions.style.setProperty("display","grid","important");
    setActiveMangaTab("chapters");
};
if(mangaPageBack)mangaPageBack.onclick=function(){
    // Ensure the chapter-only fixed ad disappears whenever leaving the manga page.
    document.body.removeAttribute("data-chapter-reader");
    if(mangaCommentsUnsub){try{mangaCommentsUnsub();}catch(e){} mangaCommentsUnsub=null;}
    if(chapterCommentsUnsub){try{chapterCommentsUnsub();}catch(e){} chapterCommentsUnsub=null;}
    currentChapterReaderMangaId=null;
    currentChapterReaderId=null;
    document.body.removeAttribute("data-manga-open");
    mangaPage.style.display="none";
    sitePage.style.display="block";
    currentMangaId=null;
    chapterReader.style.display="none";
    mangaPageActions.style.display="grid";
    window.scrollTo(0,0);
};
if(readerBack)readerBack.onclick=function(){
    if(chapterCommentsUnsub){try{chapterCommentsUnsub();}catch(e){} chapterCommentsUnsub=null;}
    currentChapterReaderMangaId=null;
    currentChapterReaderId=null;
    document.body.removeAttribute("data-chapter-reader");
    document.body.removeAttribute("data-admin-chapter-mode");
    mzAdminChapterManagementMode=false;
    const nextWrap=document.getElementById("nextChapterWrap");
    if(nextWrap)nextWrap.innerHTML="";
    const m=mangaList.find(function(x){return String(x.id)===String(currentMangaId)});
    if(m){
        chapterReader.style.display="none";
        mangaPageActions.style.display="grid";
        setActiveMangaTab("chapters");
        renderChapterList(m);
        window.scrollTo(0,0);
    }
};

/* =========================================
   SEARCH
========================================= */

if(searchInput){

    searchInput.addEventListener(
        "input",
        function(){

            const search =
                searchInput.value
                .trim()
                .toLowerCase();


            if(!search){
                renderManga(currentBrowseMode);
                return;
            }


            homeMangaGrid.innerHTML = "";


            const results =
                mangaList.filter(
                    function(manga){

                        const name =
                            String(
                                manga.name || ""
                            ).toLowerCase();


                        const author =
                            String(
                                manga.author || ""
                            ).toLowerCase();


                        return (
                            name.includes(search) ||
                            author.includes(search)
                        );

                    }
                );


            if(results.length === 0){

                emptyLibrary.classList.remove("hide");

                return;

            }


            emptyLibrary.classList.add("hide");


            results.forEach(
                function(manga){

                    homeMangaGrid.appendChild(
                        createMangaCard(
                            manga,
                            false
                        )
                    );

                }
            );

        }
    );

}


/* =========================================
   LOGO -> HOME
========================================= */

const homeLogo = document.getElementById("homeLogo");

function goToHome(){
    if(adminPage) adminPage.style.display = "none";
    if(sitePage) sitePage.style.display = "block";
    document.querySelectorAll("[data-site]").forEach(function(btn){ btn.classList.remove("active"); });
    const homeButton = document.querySelector('[data-site="home"]');
    if(homeButton) homeButton.classList.add("active");
    if(window.location.hash === "#admin") history.replaceState(null,"",window.location.pathname+window.location.search);
    window.scrollTo(0,0);
}
if(homeLogo) homeLogo.addEventListener("click", goToHome);


function showNotificationsPage(){
    // لا نقرأ mangaZERO_manga ولا localStorage الخاص بالمانجا هنا.
    // لذلك لن تظهر المانجا داخل الإشعارات حتى لو تمت إضافتها حديثًا.
    const grid=document.getElementById("homeMangaGrid");
    if(grid) grid.innerHTML="";
    if(emptyLibrary){
        emptyLibrary.classList.remove("hide");
        emptyLibrary.innerHTML='<div style="font-size:38px;margin-bottom:10px">🔔</div><strong>لا توجد إشعارات جديدة</strong><p style="color:#77717e;margin-top:8px">ستظهر هنا الإشعارات الحقيقية فقط عند إضافتها.</p>';
    }
    showToast("الإشعارات 🔔");
}

/* =========================================
   NORMAL NAVIGATION
========================================= */

document
    .querySelectorAll("[data-site]")
    .forEach(
        function(button){

            button.addEventListener(
                "click",
                function(){

                    // أزرار الموقع تغلق صفحة الأدمن وتفتح القسم المطلوب
                    if(adminPage) adminPage.style.display = "none";
                    if(sitePage) sitePage.style.display = "block";
                    if(window.location.hash === "#admin") history.replaceState(null,"",window.location.pathname+window.location.search);

                    document
                        .querySelectorAll("[data-site]")
                        .forEach(
                            function(btn){

                                btn.classList.remove("active");

                            }
                        );


                    button.classList.add("active");


                    const page =
                        button.dataset.site;


                    if(page === "home"){
                        renderManga("home");
                        showToast("الرئيسية 🏠");
                    }
                    else if(page === "latest"){
                        renderManga("latest");
                        showToast("الأحدث 🕒");
                    }
                    else if(page === "best"){
                        renderManga("best");
                        showToast("الأفضل 🔥");
                    }
                    else if(page === "notifications"){
                        // الإشعارات مستقلة تمامًا عن المانجا.
                        // إضافة/تحميل مانجا لا ينشئ إشعارًا تلقائيًا.
                        showNotificationsPage();
                    }

                }
            );

        }
    );


/* =========================================
   START APP
========================================= */

renderManga();


/* =========================================
   OPEN ADMIN FROM HASH
========================================= */

if(window.location.hash === "#admin"){
    // Firebase Auth finishes asynchronously; the auth listener below will open
    // the admin page after the signed-in Google user is restored.
}


/* =========================================
   JAVASCRIPT TEST
========================================= */

console.log(
    "MangaZERO JavaScript يعمل بنجاح ✅"
);

/* ===== inline script 2 of 6 | original line 5271 | <script > ===== */
(function(){ /* sloppy-mode wrapper: see note above */
  const firebaseConfig = {
    apiKey: "AIzaSyBNWhapiiWphhTvZS_qnl3i6RYFU1gdtFc",
    authDomain: "mangazero-494cc.firebaseapp.com",
    projectId: "mangazero-494cc",
    storageBucket: "mangazero-494cc.firebasestorage.app",
    messagingSenderId: "973221819373",
    appId: "1:973221819373:web:5f40efa97daba9d9892de4",
    measurementId: "G-4SEJR19KVT"
  };
  if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
  window.mzFirebaseAuth = firebase.auth();
  window.mzGoogleProvider = new firebase.auth.GoogleAuthProvider();
  window.mzFirestore = firebase.firestore();
})();

/* ===== inline script 3 of 6 | original line 5287 | <script > ===== */
(function(){ /* sloppy-mode wrapper: see note above */
(function(){
  const menu=document.getElementById('mzMenuToggle'),sidebar=document.getElementById('mzSidebar'),overlay=document.getElementById('mzSideOverlay'),sideClose=document.getElementById('mzSideClose');
  const adminTitleBlock=document.getElementById('mzAdminTitleBlock'),adminTitleSelect=document.getElementById('mzAdminTitleSelect'),adminTitleSelect2=document.getElementById('mzAdminTitleSelect2'),adminTitleSave=document.getElementById('mzAdminTitleSave');
  const loginOpen=document.getElementById('mzLoginOpen'),account=document.getElementById('mzAccountPage'),accountClose=document.getElementById('mzAccountClose'),loginMsg=document.getElementById('mzLoginMsg'),sideUser=document.getElementById('mzSideUser'),logout=document.getElementById('mzLogout'),googleLogin=document.getElementById('mzGoogleLogin');
  const profileOpen=document.getElementById('mzProfileOpen'),profilePage=document.getElementById('mzProfilePage'),profileClose=document.getElementById('mzProfileClose'),profileCommentCount=document.getElementById('mzProfileCommentCount'),profileChapterCount=document.getElementById('mzProfileChapterCount'),profileMangaCount=document.getElementById('mzProfileMangaCount'),profileAvatar=document.getElementById('mzProfileAvatar'),profileAvatarInput=document.getElementById('mzProfileAvatarInput'),profileAvatarRemove=document.getElementById('mzProfileAvatarRemove'),profileAvatarHint=document.getElementById('mzProfileAvatarHint'),usernameInput=document.getElementById('mzUsernameInput'),usernameSave=document.getElementById('mzUsernameSave'),usernameHint=document.getElementById('mzUsernameHint'),bioInput=document.getElementById('mzBioInput'),bioSave=document.getElementById('mzBioSave'),bioHint=document.getElementById('mzBioHint'),profileThemeToggle=document.getElementById('mzProfileThemeToggle'),sideThemeToggle=document.getElementById('mzThemeToggle'),themeHint=document.getElementById('mzThemeHint'),publicProfilePage=document.getElementById('mzPublicProfilePage'),publicProfileClose=document.getElementById('mzPublicProfileClose'),publicProfileAvatar=document.getElementById('mzPublicProfileAvatar'),publicProfileName=document.getElementById('mzPublicProfileName'),publicProfileTitle=document.getElementById('mzPublicProfileTitle'),publicProfileBio=document.getElementById('mzPublicProfileBio'),publicProfileCommentCount=document.getElementById('mzPublicProfileCommentCount'),publicProfileChapterCount=document.getElementById('mzPublicProfileChapterCount'),publicProfileMangaCount=document.getElementById('mzPublicProfileMangaCount'),publicProfileFavorites=document.getElementById('mzPublicProfileFavorites');
  const mzOwnProfileBgLayer=document.getElementById('mzOwnProfileBgLayer'),mzPublicProfileBgLayer=document.getElementById('mzPublicProfileBgLayer'),mzProfileBackgroundSelect=document.getElementById('mzProfileBackgroundSelect'),mzProfileBackgroundSave=document.getElementById('mzProfileBackgroundSave'),mzProfileBackgroundCurrent=document.getElementById('mzProfileBackgroundCurrent');
  const supportOpen=document.getElementById('mzSupportOpen'),supportPage=document.getElementById('mzSupportPage'),supportClose=document.getElementById('mzSupportClose'),supportMessages=document.getElementById('mzSupportMessages'),supportInput=document.getElementById('mzSupportInput'),supportSend=document.getElementById('mzSupportSend');
  let supportUnsub=null,adminSupportUnsub=null,adminSupportUserId=null,adminSupportUserName='';
  let mzProfileUserData=null;
  window.mzProfileUserData=mzProfileUserData;
  let mzProfileManualClose=false;
  function applyTheme(theme){const t=theme==='light'?'light':'dark';document.documentElement.classList.toggle('mz-day-mode',t==='light');const label=t==='light'?'🌙 الوضع الليلي':'☀️ الوضع النهاري';if(sideThemeToggle){sideThemeToggle.textContent=label;sideThemeToggle.classList.toggle('active',t==='light');}if(profileThemeToggle){profileThemeToggle.textContent=label;profileThemeToggle.classList.toggle('active',t==='light');}localStorage.setItem('mangaZERO_theme',t);return t;}
  async function saveTheme(theme){const t=applyTheme(theme);const u=window.currentUser;if(!u||!db)return;try{await db.collection('mangaZERO_users').doc(u.uid).set({theme:t,updatedAt:firebase.firestore.FieldValue.serverTimestamp()},{merge:true});mzProfileUserData=Object.assign({},mzProfileUserData||{}, {theme:t});window.mzProfileUserData=mzProfileUserData;}catch(e){console.error(e);if(themeHint)themeHint.textContent='تم تطبيق المظهر على الجهاز، لكن تعذر حفظه للحساب.';}}
  function openProfile(){mzProfileManualClose=false;if(!window.currentUser){showToast('سجل دخولك الأول');openAccount();return;}closeSide();if(profilePage){profilePage.classList.remove('is-closed');profilePage.classList.add('is-open','mz-motion-open');profilePage.style.setProperty('display','block','important');profilePage.style.setProperty('opacity','1','important');profilePage.style.setProperty('visibility','visible','important');profilePage.style.setProperty('pointer-events','auto','important');profilePage.style.transform='none';}document.body.style.overflow='hidden';loadProfileData();mzLoadOwnedProfileBackgrounds();}
  function closeProfile(){mzProfileManualClose=true;if(profilePage){profilePage.classList.remove('mz-motion-open','is-open');profilePage.classList.add('is-closed');profilePage.style.setProperty('display','none','important');profilePage.style.removeProperty('opacity');profilePage.style.removeProperty('transform');profilePage.style.removeProperty('visibility');profilePage.style.removeProperty('pointer-events');}document.body.style.overflow='';}
  /* Tap outside the profile card to close */
  if(profilePage){profilePage.addEventListener('click',function(e){if(e.target===profilePage)closeProfile();});const profileCard=profilePage.querySelector('.mz-profile-card');if(profileCard)profileCard.addEventListener('click',function(e){e.stopPropagation();});}
  window.mzCloseProfile=closeProfile;
  function getLocalFavoriteIds(){const ids=[];try{Object.keys(localStorage).forEach(function(k){if(k.indexOf('mangaZERO_favorite_')===0&&localStorage.getItem(k)==='1')ids.push(k.slice('mangaZERO_favorite_'.length));});}catch(e){}return ids;}
  function setProfileStatsUI(c,chapters,mangas){
    if(c!=null){if(profileCommentCount)profileCommentCount.textContent=String(c);if(publicProfileCommentCount)publicProfileCommentCount.textContent=String(c);}
    if(chapters!=null){if(profileChapterCount)profileChapterCount.textContent=String(chapters);if(publicProfileChapterCount)publicProfileChapterCount.textContent=String(chapters);}
    if(mangas!=null){if(profileMangaCount)profileMangaCount.textContent=String(mangas);if(publicProfileMangaCount)publicProfileMangaCount.textContent=String(mangas);}
  }
  async function calculateOwnProfileStats(uid){
    if(!db||!uid)return {comments:0,chapters:0,mangas:0};
    let comments=0,chapters=0,mangas=0;
    try{const cs=await db.collection('mangaZERO_comments').where('uid','==',String(uid)).get();comments=cs.size||0;}catch(e){console.warn('profile comment stats:',e);}
    try{const hs=await db.collection('mangaZERO_reading_history').doc(String(uid)).collection('mangas').get();const ids=new Set();hs.forEach(function(doc){const d=doc.data()||{};if(d.mangaId)ids.add(String(d.mangaId));});mangas=ids.size;}catch(e){console.warn('profile manga stats:',e);}
    try{const rs=await db.collection('mangaZERO_reading_stats').doc(String(uid)).get();if(rs.exists)chapters=Number((rs.data()||{}).uniqueChapterCount||0);else{const cs=await db.collection('mangaZERO_reading_history').doc(String(uid)).collection('chapters').get();chapters=cs.size||0;}}catch(e){try{const cs=await db.collection('mangaZERO_reading_history').doc(String(uid)).collection('chapters').get();chapters=cs.size||0;}catch(e2){console.warn('profile chapter stats:',e2);}}
    return {comments:comments,chapters:chapters,mangas:mangas};
  }
  async function syncPublicProfileStats(uid,stats){
    if(!db||!uid||!stats)return;
    try{await db.collection('mangaZERO_public_profiles').doc(String(uid)).set({commentCount:Number(stats.comments||0),chapterCount:Number(stats.chapters||0),mangaCount:Number(stats.mangas||0),statsUpdatedAt:firebase.firestore.FieldValue.serverTimestamp()},{merge:true});}catch(e){console.warn('sync public profile stats:',e);}
  }
  const MZ_PROFILE_BG_CLASSES={
    'bg_aurora':'mz-bg-aurora','bg_neon':'mz-bg-neon','bg_sakura':'mz-bg-sakura','bg_cosmic':'mz-bg-cosmic','bg_void':'mz-bg-void','bg_admin':'mz-bg-admin','bg_admin_gold':'mz-bg-admin-gold','bg_admin_void':'mz-bg-admin-void'
  };
  function mzApplyProfileBackground(layer,bg){
    if(!layer)return;
    const cls=MZ_PROFILE_BG_CLASSES[String(bg&&bg.bgClass||'')]||'';
    layer.className='mz-profile-bg-layer'+(cls?' '+cls:'');
    layer.setAttribute('data-bg-id',String(bg&&bg.id||''));
  }
  async function mzLoadOwnedProfileBackgrounds(){
    const u=window.currentUser;if(!u||!db||!mzProfileBackgroundSelect)return;
    if(mzProfileBackgroundCurrent)mzProfileBackgroundCurrent.textContent='جاري تحميل الخلفية...';
    try{
      mzProfileBackgroundSelect.innerHTML='<option value="">بدون خلفية مخصصة</option>';
      const isUserAdmin=admin();
      if(isUserAdmin){
        MZ_ADMIN_PROFILE_BACKGROUNDS.forEach(function(bg){const o=document.createElement('option');o.value=String(bg.id);o.textContent='👑 '+(bg.animated?'✨ ':'')+(bg.name||'خلفية أدمن');mzProfileBackgroundSelect.appendChild(o);});
      }
      let userData={};
      try{const userSnap=await db.collection('mangaZERO_users').doc(String(u.uid)).get();userData=userSnap.exists?(userSnap.data()||{}):{};}catch(userErr){console.warn('profile background user data:',userErr);}
      const active=String(userData.activeProfileBackgroundId||'');
      const localAdminBg=isUserAdmin?MZ_ADMIN_PROFILE_BACKGROUNDS.find(function(p){return String(p.id)===active;}):null;
      let products=[];let owned=new Set();
      try{
        const storeSnap=await db.collection('mangaZERO_store').where('active','==',true).get();
        storeSnap.forEach(function(d){const x=Object.assign({id:d.id},d.data()||{});if(x.type==='profile_background'&&!x.adminOnly)products.push(x);});
        const purSnap=await db.collection('mangaZERO_purchases').where('uid','==',String(u.uid)).get();
        purSnap.forEach(function(d){const x=d.data()||{};if(x.productId)owned.add(String(x.productId));});
      }catch(storeErr){console.warn('profile background store load:',storeErr);}
      products.filter(function(p){return owned.has(String(p.id));}).forEach(function(p){const o=document.createElement('option');o.value=String(p.id);o.textContent=(p.animated?'✨ ':'🖼️ ')+(p.name||'خلفية');mzProfileBackgroundSelect.appendChild(o);});
      const activeProduct=localAdminBg||products.find(function(p){return String(p.id)===active;});
      const activeAllowed=!!activeProduct&&(localAdminBg?isUserAdmin:owned.has(active));
      mzProfileBackgroundSelect.value=active&&activeAllowed?active:'';
      if(mzProfileBackgroundCurrent)mzProfileBackgroundCurrent.textContent=activeProduct&&activeAllowed?'الخلفية الحالية: '+(activeProduct.name||'خلفية'):'لا توجد خلفية مفعلة حاليًا.';
      mzApplyProfileBackground(mzOwnProfileBgLayer,activeProduct&&activeAllowed?activeProduct:null);
    }catch(e){console.error('profile backgrounds load:',e);if(mzProfileBackgroundCurrent)mzProfileBackgroundCurrent.textContent='لا توجد خلفية مفعلة حاليًا.';mzApplyProfileBackground(mzOwnProfileBgLayer,null);}
  }
  
async function mzActivateProfileBackground(){
    const u=window.currentUser;if(!u||!db||!mzProfileBackgroundSelect)return;
    const id=String(mzProfileBackgroundSelect.value||'');mzProfileBackgroundSave.disabled=true;
    try{
      let bg=null;
      if(id){
        const localAdminBg=admin()&&MZ_ADMIN_PROFILE_BACKGROUNDS.find(function(p){return String(p.id)===id;});
        if(localAdminBg){bg=Object.assign({},localAdminBg,{id:id});}
        else{
          const ps=await db.collection('mangaZERO_store').doc(id).get();
          if(!ps.exists||ps.data().active!==true||ps.data().type!=='profile_background'||ps.data().adminOnly)throw new Error('BACKGROUND_NOT_AVAILABLE');
          bg=Object.assign({id:id},ps.data()||{});
          const pur=await db.collection('mangaZERO_purchases').where('uid','==',String(u.uid)).where('productId','==',id).limit(1).get();
          if(pur.empty)throw new Error('NOT_OWNED');
        }
      }
      const data={activeProfileBackgroundId:id||'',updatedAt:firebase.firestore.FieldValue.serverTimestamp()};
      await db.collection('mangaZERO_users').doc(String(u.uid)).set(data,{merge:true});
      await db.collection('mangaZERO_public_profiles').doc(String(u.uid)).set(data,{merge:true});
      mzApplyProfileBackground(mzOwnProfileBgLayer,bg);if(mzProfileBackgroundCurrent)mzProfileBackgroundCurrent.textContent=bg?'الخلفية الحالية: '+(bg.name||'خلفية'):'لا توجد خلفية مفعلة حاليًا.';
      showToast(bg?'✨ تم تفعيل خلفية ملفك — وكل الناس هيشوفوها.':'تم إلغاء خلفية الملف الشخصي');
    }catch(e){console.error('activate profile background',e);showToast(e.message==='NOT_OWNED'?'لازم تشتري الخلفية الأول':e.message==='BACKGROUND_NOT_AVAILABLE'?'الخلفية غير متاحة حاليًا':'تعذر تفعيل الخلفية');}
    finally{mzProfileBackgroundSave.disabled=false;}
  }
  if(mzProfileBackgroundSave)mzProfileBackgroundSave.addEventListener('click',mzActivateProfileBackground);

  async function getPublicProfile(uid){if(!db||!uid)return null;try{const s=await db.collection('mangaZERO_public_profiles').doc(String(uid)).get();return s.exists?(s.data()||{}):null;}catch(e){console.warn('getPublicProfile:',e);return null;}}
  window.mzGetPublicProfile=getPublicProfile;
  async function syncPublicProfileFromUserData(userData,seedLocalFavorites){if(!db||!userData||!userData.uid)return;try{const ref=db.collection('mangaZERO_public_profiles').doc(String(userData.uid)),old=await ref.get(),oldData=old.exists?(old.data()||{}):{};const favorites=Array.isArray(oldData.favorites)?oldData.favorites:(seedLocalFavorites?getLocalFavoriteIds():[]);const titles=getTitleArray(userData);const title=titles[0]||'member';await ref.set({uid:String(userData.uid),username:String(userData.username||userData.name||userData.email||'مستخدم'),name:String(userData.name||userData.username||userData.email||'مستخدم'),photoURL:String(userData.photoURL||''),title:title,titles:titles,verified:(String(userData.email||'').toLowerCase()===ADMIN_EMAIL.toLowerCase()||userData.verified===true),bio:String(userData.bio||oldData.bio||''),favorites:favorites,updatedAt:firebase.firestore.FieldValue.serverTimestamp()},{merge:true});}catch(e){console.warn('syncPublicProfileFromUserData:',e);}}
  async function syncPublicProfileForCurrentUser(){const u=window.currentUser;if(!u||!db)return;try{const s=await db.collection('mangaZERO_users').doc(u.uid).get(),d=s.exists?(s.data()||{}):{};await syncPublicProfileFromUserData(Object.assign({uid:u.uid,email:u.email||'',name:u.displayName||u.email||'مستخدم',photoURL:u.photoURL||''},d),true);const ps=await db.collection('mangaZERO_public_profiles').doc(u.uid).get();const pd=ps.exists?(ps.data()||{}):{};if(Array.isArray(pd.favorites)){try{Object.keys(localStorage).forEach(function(k){if(k.indexOf('mangaZERO_favorite_')===0)localStorage.removeItem(k);});pd.favorites.forEach(function(id){localStorage.setItem('mangaZERO_favorite_'+String(id),'1');});}catch(e){}}}catch(e){console.warn('syncPublicProfileForCurrentUser:',e);}}
  function renderPublicFavorites(ids){if(!publicProfileFavorites)return;const wanted=Array.isArray(ids)?ids.map(String):[];const list=wanted.map(function(id){return mangaList.find(function(m){return String(m.id)===id;});}).filter(Boolean);publicProfileFavorites.innerHTML='';if(!list.length){publicProfileFavorites.innerHTML='<div class="mz-public-empty" style="grid-column:1/-1">لسه مفيش مانجا مضافة للمفضلات.</div>';return;}list.forEach(function(m){const b=document.createElement('button');b.type='button';b.className='mz-public-fav';const cover=m.cover?'<img loading="lazy" decoding="async" src="'+String(m.cover).replace(/"/g,'&quot;')+'" alt="">':'📖';b.innerHTML='<div class="mz-public-fav-cover">'+cover+'</div><div class="mz-public-fav-name">'+esc2(m.name||'مانجا')+'</div>';b.onclick=function(){closePublicProfile();openMangaPage(m,false);};publicProfileFavorites.appendChild(b);});}
  async function openPublicProfile(uid){
    const id=String(uid||'');
    if(!id||!publicProfilePage)return;
    if(window.currentUser&&id===String(window.currentUser.uid)){openProfile();return;}
    publicProfilePage.style.display='block';
    publicProfilePage.style.visibility='visible';
    publicProfilePage.style.pointerEvents='auto';
    document.body.style.overflow='hidden';
    if(publicProfileName)publicProfileName.textContent='جاري التحميل...';
    if(publicProfileTitle)publicProfileTitle.innerHTML='';
    if(publicProfileBio)publicProfileBio.textContent='جاري تحميل الملف الشخصي...';
    if(publicProfileFavorites)publicProfileFavorites.innerHTML='<div class="mz-public-empty" style="grid-column:1/-1">جاري تحميل المفضلات...</div>';setProfileStatsUI(0,0,0);
    try{
      let d=await getPublicProfile(id);
      /* لو الملف العام غير موجود، اقرأ بيانات المستخدم مباشرة حتى يظهر اللقب. */
      if(!d&&db){
        try{
          const us=await db.collection('mangaZERO_users').doc(id).get();
          if(us.exists)d=Object.assign({uid:id},us.data()||{});
        }catch(userErr){console.warn('public profile user fallback:',userErr);}
      }
      if(!d){
        if(publicProfileName)publicProfileName.textContent='مستخدم';
        if(publicProfileTitle)publicProfileTitle.innerHTML='';
        if(publicProfileBio)publicProfileBio.textContent='الملف الشخصي غير متاح.';
        renderPublicFavorites([]);
        return;
      }
      if(mzPublicProfileBgLayer){
        mzApplyProfileBackground(mzPublicProfileBgLayer,null);
        const publicBgId=d.activeProfileBackgroundId||(String(d.email||'').toLowerCase()===ADMIN_EMAIL.toLowerCase()?'profile_bg_admin':'');
        if(publicBgId && db){
          try{const bs=await db.collection('mangaZERO_store').doc(String(publicBgId)).get();if(bs.exists&&bs.data().active===true&&bs.data().type==='profile_background')mzApplyProfileBackground(mzPublicProfileBgLayer,Object.assign({id:bs.id},bs.data()||{}));}catch(bgErr){console.warn('public profile background:',bgErr);}
        }
      }
      const titles=getTitleArray(d);
      if(publicProfileName)publicProfileName.innerHTML=titleNameHTML(d.username||d.name||d.email||'مستخدم',titles);
      if(publicProfileTitle)publicProfileTitle.innerHTML=titleBadgeHTML(titles,String(d.email||'').toLowerCase()===ADMIN_EMAIL.toLowerCase()||d.verified===true);
      if(publicProfileBio)publicProfileBio.textContent=String(d.bio||'').trim()||'لا توجد نبذة عن هذا المستخدم حتى الآن.';
      setProfileStatsUI(Number(d.commentCount||0),Number(d.chapterCount||0),Number(d.mangaCount||0));
      if(publicProfileAvatar){
        publicProfileAvatar.innerHTML=d.photoURL?'<img src="'+esc2(d.photoURL)+'" alt="صورة المستخدم" style="width:100%;height:100%;object-fit:cover">':'👤';
        publicProfileAvatar.className=d.photoURL?'mz-public-profile-avatar':'mz-public-profile-avatar-fallback';
      }
      renderPublicFavorites(d.favorites||[]);
    }catch(e){
      console.error(e);
      if(publicProfileName)publicProfileName.textContent='مستخدم';
      if(publicProfileTitle)publicProfileTitle.innerHTML='';
      if(publicProfileBio)publicProfileBio.textContent='تعذر تحميل الملف الشخصي.';
      renderPublicFavorites([]);
    }
  }
  function closePublicProfile(){
    if(publicProfilePage){
      publicProfilePage.style.setProperty('display','none','important');
      publicProfilePage.style.removeProperty('visibility');
      publicProfilePage.style.removeProperty('pointer-events');
    }
    document.body.style.overflow='';
  }
  if(publicProfileClose&&!publicProfileClose.__mzCloseBound){
    publicProfileClose.__mzCloseBound=true;
    publicProfileClose.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();closePublicProfile();},true);
  }
  if(publicProfilePage&&!publicProfilePage.__mzOutsideBound){
    publicProfilePage.__mzOutsideBound=true;
    publicProfilePage.addEventListener('click',function(e){if(e.target===publicProfilePage)closePublicProfile();});
    const card=publicProfilePage.querySelector('.mz-public-profile-card');
    if(card)card.addEventListener('click',function(e){e.stopPropagation();});
  }

  window.mzOpenPublicProfile=openPublicProfile;window.mzGetPublicProfile=getPublicProfile;
  async function saveAdminTitle(){
    const u=window.currentUser;if(!isAdmin()||!u||!db||!adminTitleSelect)return;
    let next=[adminTitleSelect.value,adminTitleSelect2&&adminTitleSelect2.value].filter(Boolean);next=[...new Set(next)];if(!next.length)next=['member'];if(next.length>2)next=next.slice(0,2);
    if(adminTitleSave)adminTitleSave.disabled=true;
    try{
      await db.collection('mangaZERO_users').doc(u.uid).set({titles:next,title:next[0],titleUpdatedAt:firebase.firestore.FieldValue.serverTimestamp(),titleUpdatedByUid:u.uid},{merge:true});
      mzProfileUserData=Object.assign({},mzProfileUserData||{},{titles:next,title:next[0]});window.mzProfileUserData=mzProfileUserData;
      await syncPublicProfileForCurrentUser();
      try{const cs=await db.collection('mangaZERO_comments').where('uid','==',u.uid).get();if(!cs.empty){let batch=db.batch(),count=0;cs.forEach(function(doc){batch.update(doc.ref,{titles:next,title:next[0],titleUpdatedAt:firebase.firestore.FieldValue.serverTimestamp()});count++;if(count===400){batch.commit();batch=db.batch();count=0;}});if(count>0)await batch.commit();}}catch(e){console.warn('admin comment title sync:',e);}
      try{if(typeof mangaList!=='undefined'&&Array.isArray(mangaList))mangaList.forEach(function(m){if(Array.isArray(m.comments))m.comments.forEach(function(c){if(String(c.uid||'')===String(u.uid)){c.titles=next.slice();c.title=next[0];}});});if(typeof window.currentMangaPage!=='undefined'&&window.currentMangaPage&&Array.isArray(window.currentMangaPage.comments))window.currentMangaPage.comments.forEach(function(c){if(String(c.uid||'')===String(u.uid)){c.titles=next.slice();c.title=next[0];}});}catch(e){}
      showToast('تم حفظ ألقاب الأدمن ✅');if(window.mzRole==='admin')updateAdminVisibility();
    }catch(e){console.error('saveAdminTitle:',e);showToast('تعذر حفظ الألقاب');}finally{if(adminTitleSave)adminTitleSave.disabled=false;}
  }
  async function saveBio(){const u=window.currentUser;if(!u||!db||!bioInput)return;const bio=String(bioInput.value||'').trim();bioSave.disabled=true;try{await db.collection('mangaZERO_users').doc(u.uid).set({bio:bio,updatedAt:firebase.firestore.FieldValue.serverTimestamp()},{merge:true});mzProfileUserData=Object.assign({},mzProfileUserData||{},{bio:bio});window.mzProfileUserData=mzProfileUserData;await syncPublicProfileForCurrentUser();if(bioHint)bioHint.textContent='تم حفظ النبذة، وهتظهر في ملفك الشخصي العام.';showToast('تم حفظ النبذة ✅');}catch(e){console.error(e);if(bioHint)bioHint.textContent='تعذر حفظ النبذة.';}finally{bioSave.disabled=false;}}
  function openProfile(){mzProfileManualClose=false;if(!window.currentUser){showToast('سجل دخولك الأول');openAccount();return;}closeSide();if(profilePage){profilePage.classList.remove('is-closed');profilePage.classList.add('is-open','mz-motion-open');profilePage.style.setProperty('display','block','important');profilePage.style.setProperty('opacity','1','important');profilePage.style.setProperty('visibility','visible','important');profilePage.style.setProperty('pointer-events','auto','important');profilePage.style.transform='none';}document.body.style.overflow='hidden';loadProfileData();}
  function closeProfile(){mzProfileManualClose=true;if(profilePage){profilePage.classList.remove('mz-motion-open','is-open');profilePage.classList.add('is-closed');profilePage.style.setProperty('display','none','important');profilePage.style.removeProperty('opacity');profilePage.style.removeProperty('transform');profilePage.style.removeProperty('visibility');profilePage.style.removeProperty('pointer-events');}document.body.style.overflow='';}
  async function compressProfileImage(file){
    return new Promise(function(resolve,reject){
      if(!file||!file.type||file.type.indexOf('image/')!==0){reject(new Error('اختار صورة صحيحة'));return;}
      const img=new Image(),url=URL.createObjectURL(file);
      img.onload=function(){try{const max=700,scale=Math.min(1,max/Math.max(img.width,img.height)),canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(img.width*scale));canvas.height=Math.max(1,Math.round(img.height*scale));const ctx=canvas.getContext('2d');ctx.drawImage(img,0,0,canvas.width,canvas.height);canvas.toBlob(function(blob){URL.revokeObjectURL(url);if(!blob){reject(new Error('تعذر تجهيز الصورة'));return;}resolve(new File([blob],'profile.jpg',{type:'image/jpeg'}));},'image/jpeg',0.86);}catch(e){URL.revokeObjectURL(url);reject(e);}};
      img.onerror=function(){URL.revokeObjectURL(url);reject(new Error('تعذر قراءة الصورة'));};img.src=url;
    });
  }
  async function uploadProfileAvatar(file){
    const u=window.currentUser;if(!u)throw new Error('سجل دخولك الأول');
    const source=await compressProfileImage(file);
    return new Promise(function(resolve,reject){
      const xhr=new XMLHttpRequest(),fd=new FormData();fd.append('file',source);fd.append('upload_preset',MZ_CLOUDINARY_UPLOAD_PRESET);fd.append('folder','MangaZERO/profiles/'+String(u.uid));fd.append('tags','mangazero,profile');
      xhr.open('POST',MZ_CLOUDINARY_UPLOAD_URL,true);xhr.timeout=120000;
      xhr.onload=function(){let d=null;try{d=JSON.parse(xhr.responseText||'{}')}catch(e){} if(xhr.status>=200&&xhr.status<300&&d&&d.secure_url){resolve(d.secure_url);return;}reject(new Error((d&&d.error&&d.error.message)||'فشل رفع صورة الملف الشخصي'));};
      xhr.onerror=function(){reject(new Error('تعذر الاتصال بـ Cloudinary'));};xhr.ontimeout=function(){reject(new Error('انتهت مهلة رفع الصورة'));};xhr.send(fd);
    });
  }
  async function loadProfileData(){const u=window.currentUser;if(!u||!db)return;try{const s=await db.collection('mangaZERO_users').doc(u.uid).get(),d=s.exists?(s.data()||{}):{};if(adminTitleBlock){const admin=isAdmin();adminTitleBlock.classList.toggle('show',admin);adminTitleBlock.style.display=admin?'block':'none';}if(adminTitleSelect){const ats=getTitleArray(d);adminTitleSelect.value=ats[0]||'member';if(adminTitleSelect2)adminTitleSelect2.value=ats[1]||'';}mzProfileUserData=d;window.mzProfileUserData=mzProfileUserData;const savedName=String(d.username||'').trim();if(usernameInput){usernameInput.value=savedName;usernameInput.disabled=!!savedName;}if(usernameSave)usernameSave.disabled=!!savedName;if(usernameHint)usernameHint.textContent=savedName?'اسم المستخدم تم اختياره نهائيًا ومش ممكن تغييره.':'اختار اسمك مرة واحدة فقط؛ بعد الحفظ مش هتقدر تغيّره.';if(bioInput)bioInput.value=String(d.bio||'');if(profileAvatar&&d.photoURL){profileAvatar.innerHTML='<img src="'+esc2(d.photoURL)+'" alt="صورة الملف الشخصي" style="width:100%;height:100%;object-fit:cover">';}else if(profileAvatar){profileAvatar.innerHTML='<span class="mz-profile-avatar-fallback">👤</span>';}if(bioHint)bioHint.textContent='النبذة دي هتظهر للناس لما يفتحوا ملفك الشخصي.';applyTheme(d.theme||localStorage.getItem('mangaZERO_theme')||'dark');await syncPublicProfileFromUserData(Object.assign({uid:u.uid,email:u.email||'',name:u.displayName||u.email||'مستخدم',photoURL:u.photoURL||''},d),true);const stats=await calculateOwnProfileStats(u.uid);setProfileStatsUI(stats.comments,stats.chapters,stats.mangas);await syncPublicProfileStats(u.uid,stats);const heroName=document.getElementById('mzProfileHeroName'),heroBadge=document.getElementById('mzProfileHeroBadge'),avatarPreview=document.getElementById('mzProfileAvatarPreview'),pointsEl=document.getElementById('mzProfilePoints');if(heroName)heroName.textContent=String(d.username||d.name||u.displayName||u.email||'مستخدم');if(heroBadge){const tt=getTitleArray(d);const meta=(typeof TITLE_META!=='undefined'&&TITLE_META[tt[0]])?TITLE_META[tt[0]]:null;heroBadge.textContent=meta?(meta.icon+' '+meta.label):'👤 عضو';}if(avatarPreview){avatarPreview.innerHTML=d.photoURL?'<img src="'+esc2(d.photoURL)+'" alt="">':'<span>👤</span>';}try{const ps=await db.collection('mangaZERO_user_points').doc(String(u.uid)).get();if(pointsEl)pointsEl.textContent=ps.exists?Number((ps.data()||{}).points||0).toLocaleString('en-US'):'0';}catch(e){if(pointsEl)pointsEl.textContent='0';}}catch(e){console.error(e);applyTheme(localStorage.getItem('mangaZERO_theme')||'dark');}}
  if(profileAvatarInput){profileAvatarInput.addEventListener('change',async function(){const file=this.files&&this.files[0];if(!file)return;const u=window.currentUser;if(!u)return;profileAvatarHint.textContent='جاري رفع الصورة...';this.disabled=true;try{const url=await uploadProfileAvatar(file);await db.collection('mangaZERO_users').doc(u.uid).set({photoURL:url,updatedAt:firebase.firestore.FieldValue.serverTimestamp()},{merge:true});mzProfileUserData=Object.assign({},mzProfileUserData||{},{photoURL:url});window.mzProfileUserData=mzProfileUserData;await syncPublicProfileForCurrentUser();if(profileAvatar){profileAvatar.innerHTML='<img src="'+esc2(url)+'" alt="صورة الملف الشخصي" style="width:100%;height:100%;object-fit:cover">';}var hp=document.getElementById('mzProfileAvatarPreview');if(hp)hp.innerHTML='<img src="'+esc2(url)+'" alt="">';profileAvatarHint.textContent='تم حفظ الصورة ✅ وهتظهر في التعليقات.';showToast('تم تحديث صورة الملف الشخصي ✅');}catch(e){console.error('profile avatar upload:',e);profileAvatarHint.textContent='تعذر رفع الصورة: '+(e.message||'حاول مرة أخرى');showToast('تعذر رفع صورة الملف الشخصي');}finally{this.disabled=false;this.value='';}});}
  if(profileAvatarRemove){profileAvatarRemove.onclick=async function(){const u=window.currentUser;if(!u)return;if(!confirm('إزالة صورة الملف الشخصي؟'))return;try{await db.collection('mangaZERO_users').doc(u.uid).set({photoURL:'',updatedAt:firebase.firestore.FieldValue.serverTimestamp()},{merge:true});mzProfileUserData=Object.assign({},mzProfileUserData||{},{photoURL:''});window.mzProfileUserData=mzProfileUserData;await syncPublicProfileForCurrentUser();if(profileAvatar)profileAvatar.innerHTML='<span class="mz-profile-avatar-fallback">👤</span>';var hp=document.getElementById('mzProfileAvatarPreview');if(hp)hp.innerHTML='<span>👤</span>';if(profileAvatarHint)profileAvatarHint.textContent='تمت إزالة الصورة.';showToast('تمت إزالة الصورة');}catch(e){console.error(e);showToast('تعذر إزالة الصورة');}};}
  if(adminTitleSave&&!adminTitleSave.__mzBound){adminTitleSave.__mzBound=true;adminTitleSave.addEventListener('click',saveAdminTitle);}

  async function saveUsername(){const u=window.currentUser;if(!u||!db)return;const name=(usernameInput&&usernameInput.value||'').trim();if(!name){showToast('اكتب اسم المستخدم الأول');return;}if(name.length<2){showToast('اسم المستخدم لازم يكون حرفين على الأقل');return;}if(usernameInput&&usernameInput.disabled){showToast('اسم المستخدم تم اختياره بالفعل');return;}usernameSave.disabled=true;try{const ref=db.collection('mangaZERO_users').doc(u.uid),s=await ref.get(),d=s.exists?(s.data()||{}):{};if(String(d.username||'').trim()){usernameInput.value=d.username;usernameInput.disabled=true;usernameHint.textContent='اسم المستخدم تم اختياره نهائيًا ومش ممكن تغيّره.';showToast('اسم المستخدم تم اختياره بالفعل');return;}await ref.set({username:name,updatedAt:firebase.firestore.FieldValue.serverTimestamp()},{merge:true});mzProfileUserData=Object.assign({},d,{username:name});window.mzProfileUserData=mzProfileUserData;await syncPublicProfileForCurrentUser();usernameInput.disabled=true;usernameSave.disabled=true;usernameHint.textContent='اسم المستخدم تم اختياره نهائيًا ومش ممكن تغيّره.';updateUser(window.currentUser);showToast('تم حفظ اسم المستخدم ✅');}catch(e){console.error(e);usernameSave.disabled=false;showToast('تعذر حفظ اسم المستخدم');}}

  function supportTime(ts){try{const d=ts&&ts.toDate?ts.toDate():new Date(ts||Date.now());return d.toLocaleString('ar-EG',{hour:'2-digit',minute:'2-digit',day:'2-digit',month:'2-digit'});}catch(e){return '';}}
  function supportEsc(x){return esc2(x||'');}
  function renderSupportMessages(list,box,currentUid){if(!box)return;box.innerHTML='';if(!list.length){box.innerHTML='<div class="admin-support-empty">لسه مفيش رسائل. اكتب مشكلتك وهتوصلي لصاحب الموقع.</div>';return;}list.forEach(function(m){const mine=String(m.senderUid||'')===String(currentUid||'');const row=document.createElement('div');row.className='mz-support-msg'+(mine?' mine':'');row.innerHTML='<div class="mz-support-bubble">'+supportEsc(m.text)+'<div class="mz-support-meta">'+supportEsc(m.senderName||'مستخدم')+' • '+supportTime(m.createdAt)+'</div></div>';box.appendChild(row);});box.scrollTop=box.scrollHeight;}
  async function loadUserSupport(){const u=window.currentUser;if(!u||!window.mzFirestore)return;if(supportUnsub){try{supportUnsub();}catch(e){}}const q=window.mzFirestore.collection('mangaZERO_support_messages').where('conversationId','==',String(u.uid));supportUnsub=q.onSnapshot(function(snap){const arr=[];snap.forEach(function(d){arr.push(Object.assign({id:d.id},d.data()||{}));});arr.sort(function(a,b){const ta=a.createdAt&&a.createdAt.toMillis?a.createdAt.toMillis():Number(a.createdAt||0),tb=b.createdAt&&b.createdAt.toMillis?b.createdAt.toMillis():Number(b.createdAt||0);return ta-tb;});renderSupportMessages(arr,supportMessages,u.uid);},function(e){console.error(e);supportMessages.innerHTML='<div class="admin-support-empty">تعذر تحميل المحادثة.</div>';});}
  function openSupport(){if(!guardRestricted('support'))return;if(!window.currentUser){showToast('سجل دخولك الأول عشان تقدر تكلم الأدمن');openAccount();return;}closeSide();supportPage.style.display='block';document.body.style.overflow='hidden';loadUserSupport();setTimeout(function(){if(supportInput)supportInput.focus();},50);}
  function closeSupport(){supportPage.style.display='none';document.body.style.overflow='';if(supportUnsub){try{supportUnsub();}catch(e){}supportUnsub=null;}}
  async function sendSupportMessage(){if(!guardRestricted('support'))return;const u=window.currentUser,text=(supportInput&&supportInput.value||'').trim();if(!u){showToast('سجل دخولك الأول');return;}if(!text||!window.mzFirestore)return;supportSend.disabled=true;try{await window.mzFirestore.collection('mangaZERO_support_messages').add({conversationId:String(u.uid),senderUid:u.uid,senderName:(mzProfileUserData&&mzProfileUserData.username)||u.displayName||u.email||'مستخدم',senderEmail:u.email||'',senderRole:'user',text:text,createdAt:firebase.firestore.FieldValue.serverTimestamp()});supportInput.value='';}catch(e){console.error(e);showToast('تعذر إرسال الرسالة');}finally{supportSend.disabled=false;}}
  async function loadAdminSupport(){const box=document.getElementById('adminSupportUsers');if(!box||!window.mzFirestore||!isAdmin())return;if(adminSupportUnsub){try{adminSupportUnsub();}catch(e){}}adminSupportUnsub=window.mzFirestore.collection('mangaZERO_support_messages').onSnapshot(function(snap){const map={};snap.forEach(function(d){const m=d.data()||{},id=String(m.conversationId||'');if(!id)return;const t=m.createdAt&&m.createdAt.toMillis?m.createdAt.toMillis():Number(m.createdAt||0);if(!map[id]||t>(map[id].time||0))map[id]={id:id,time:t,msg:m};});const arr=Object.values(map).sort(function(a,b){return b.time-a.time;});box.innerHTML='';if(!arr.length){box.innerHTML='<div class="admin-support-empty">مفيش رسائل دعم حاليًا.</div>';return;}arr.forEach(function(x){const b=document.createElement('button');b.className='admin-support-user'+(adminSupportUserId===x.id?' active':'');b.innerHTML='<strong>'+supportEsc(x.msg.senderRole==='admin'?(x.msg.recipientName||x.msg.senderName||'مستخدم'):(x.msg.senderName||x.msg.senderEmail||'مستخدم'))+'</strong><small>'+supportEsc(x.msg.text||'')+'</small>';b.onclick=function(){openAdminSupportChat(x.id,x.msg.senderName||x.msg.senderEmail||'مستخدم');};box.appendChild(b);});},function(e){console.error(e);box.innerHTML='<div class="admin-support-empty">تعذر تحميل رسائل الدعم.</div>';});}
  function openAdminSupportChat(uid,name){adminSupportUserId=String(uid);adminSupportUserName=name||'المستخدم';const title=document.getElementById('adminSupportSelected');if(title)title.textContent='💬 محادثة مع '+(name||'المستخدم');const box=document.getElementById('adminSupportMessages');if(!box||!window.mzFirestore)return;if(window.adminSupportChatUnsub){try{window.adminSupportChatUnsub();}catch(e){}}const q=window.mzFirestore.collection('mangaZERO_support_messages').where('conversationId','==',String(uid));window.adminSupportChatUnsub=q.onSnapshot(function(snap){const arr=[];snap.forEach(function(d){arr.push(Object.assign({id:d.id},d.data()||{}));});arr.sort(function(a,b){const ta=a.createdAt&&a.createdAt.toMillis?a.createdAt.toMillis():Number(a.createdAt||0),tb=b.createdAt&&b.createdAt.toMillis?b.createdAt.toMillis():Number(b.createdAt||0);return ta-tb;});renderSupportMessages(arr,box,window.currentUser&&window.currentUser.uid);},function(e){console.error(e);box.innerHTML='<div class="admin-support-empty">تعذر تحميل المحادثة.</div>';});loadAdminSupport();}
  async function sendAdminSupportMessage(){const u=window.currentUser,text=(document.getElementById('adminSupportInput').value||'').trim();if(!isAdmin()||!adminSupportUserId||!text||!window.mzFirestore)return;const btn=document.getElementById('adminSupportSend');btn.disabled=true;try{await window.mzFirestore.collection('mangaZERO_support_messages').add({conversationId:String(adminSupportUserId),senderUid:u.uid,senderName:'𝑴𝒂𝒙𝑲𝒊𝒏𝒈',senderEmail:u.email||'',senderRole:'admin',recipientUid:String(adminSupportUserId),recipientName:adminSupportUserName,text:text,createdAt:firebase.firestore.FieldValue.serverTimestamp()});document.getElementById('adminSupportInput').value='';}catch(e){console.error(e);showToast('تعذر إرسال الرد');}finally{btn.disabled=false;}}

  const historyOpen=document.getElementById('mzHistoryOpen'),historyPage=document.getElementById('mzHistoryPage'),historyList=document.getElementById('mzHistoryList'),historyBack=document.getElementById('mzHistoryBack');
  const termsOpen=document.getElementById('mzTermsOpen'),termsPage=document.getElementById('mzTermsPage'),termsClose=document.getElementById('mzTermsClose'),termsCancel=document.getElementById('mzTermsCancel'),termsConsent=document.getElementById('mzTermsConsent'),termsCheckbox=document.getElementById('mzTermsCheckbox'),termsAccept=document.getElementById('mzTermsAccept');
  const SESSION_KEY='mangaZERO_currentUser',ADMIN_EMAIL='maxking1789@gmail.com',TERMS_VERSION='v2';
  const auth=window.mzFirebaseAuth,provider=window.mzGoogleProvider,db=window.mzFirestore;
  window.mzRole='guest';
  applyTheme(localStorage.getItem('mangaZERO_theme')||'dark');
  function esc2(x){return String(x||'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
  function setMsg(el,msg,ok){if(!el)return;el.textContent=msg;el.style.color=ok?'#6ee7a8':'#ff7f9e'}
  function openSide(){
  if(!sidebar)return;
  sidebar.classList.add('open');
  overlay&&overlay.classList.add('show');
  document.documentElement.classList.add('mz-sidebar-open');
  document.body.classList.add('mz-sidebar-open');
  sidebar.scrollTop=0;
}
function closeSide(){
  if(!sidebar)return;
  sidebar.classList.remove('open');
  overlay&&overlay.classList.remove('show');
  document.documentElement.classList.remove('mz-sidebar-open');
  document.body.classList.remove('mz-sidebar-open');
}
  if(sidebar){sidebar.addEventListener('wheel',function(e){const canScroll=sidebar.scrollHeight>sidebar.clientHeight;if(canScroll){e.stopPropagation()}},{passive:true});sidebar.addEventListener('touchmove',function(e){e.stopPropagation()},{passive:true})}
  function openAccount(){closeSide();account.style.display='block';document.body.style.overflow='hidden'} function closeAccount(){account.style.display='none';if(!termsPage||termsPage.style.display==='none')document.body.style.overflow=''}
  function openTerms(forceConsent){closeSide();if(!termsPage)return;termsPage.style.display='block';document.body.style.overflow='hidden';if(termsConsent)termsConsent.style.display=forceConsent?'block':'none';if(termsCheckbox)termsCheckbox.checked=false;if(termsAccept)termsAccept.disabled=true;}
  function closeTerms(){if(termsPage)termsPage.style.display='none';document.body.style.overflow='';}
  async function hasAcceptedTerms(u){if(!u||!db)return false;try{const s=await db.collection('mangaZERO_users').doc(u.uid).get();const d=s.exists?(s.data()||{}):{};return String(d.termsAcceptedVersion||'')===TERMS_VERSION;}catch(e){console.error(e);return false;}}
  async function requireTermsConsent(u){if(!u)return true;const accepted=await hasAcceptedTerms(u);if(accepted)return true;openTerms(true);return false;}
  async function acceptTerms(){const u=window.currentUser;if(!u||!db)return;termsAccept.disabled=true;try{await db.collection('mangaZERO_users').doc(u.uid).set({termsAcceptedVersion:TERMS_VERSION,termsAcceptedAt:firebase.firestore.FieldValue.serverTimestamp(),updatedAt:firebase.firestore.FieldValue.serverTimestamp()},{merge:true});mzProfileUserData=Object.assign({},mzProfileUserData||{},{termsAcceptedVersion:TERMS_VERSION});closeTerms();if(!(mzProfileUserData&&String(mzProfileUserData.username||'').trim()))setTimeout(openProfile,150);showToast('تم حفظ موافقتك على الشروط والأحكام ✅');}catch(e){console.error(e);termsAccept.disabled=false;showToast('تعذر حفظ الموافقة، حاول مرة أخرى');}}
  function isAdmin(){const u=window.currentUser;return !!(u&&String(u.email||'').toLowerCase()===ADMIN_EMAIL.toLowerCase())}
  window.mzIsAdmin=isAdmin;window.mzCanManageManga=()=>isAdmin()||window.mzRole==='helper';window.mzCanBan=()=>isAdmin()||window.mzRole==='helper';
  async function syncUser(u){if(!db||!u)return;try{const ref=db.collection('mangaZERO_users').doc(u.uid),s=await ref.get(),old=s.exists?(s.data()||{}):{},d={uid:u.uid,name:u.displayName||u.email||'مستخدم',email:(u.email||'').toLowerCase(),photoURL:u.photoURL||'',lastLoginAt:firebase.firestore.FieldValue.serverTimestamp(),updatedAt:firebase.firestore.FieldValue.serverTimestamp()};if(!s.exists)d.createdAt=firebase.firestore.FieldValue.serverTimestamp();if(!Array.isArray(old.titles)||!old.titles.length){d.titles=[String(u.email||'').toLowerCase()===ADMIN_EMAIL.toLowerCase()?'admin':'member'];d.title=d.titles[0];}await ref.set(d,{merge:true});await syncPublicProfileFromUserData(Object.assign({},old,d,{uid:u.uid,email:(u.email||'').toLowerCase()}),!s.exists);}catch(e){console.error(e)}}
  let mzHelperRoleUnsub=null;
  async function loadRole(u){
    if(!u){window.mzRole='guest';return;}
    if(isAdmin()){window.mzRole='admin';return;}
    try{
      const s=await db.collection('mangaZERO_helpers').doc(u.uid).get();
      window.mzRole=s.exists?'helper':'user';
    }catch(e){
      console.error('helper role read:',e);
      /* لا نحذف صلاحية المساعد بسبب خطأ شبكة/قراءة مؤقت. */
      if(window.mzRole!=='helper')window.mzRole='user';
    }
    updateAdminVisibility();
  }
  function watchHelperRole(u){
    try{if(mzHelperRoleUnsub){mzHelperRoleUnsub();mzHelperRoleUnsub=null;}}catch(e){}
    if(!u){window.mzRole='guest';updateAdminVisibility();return;}
    if(isAdmin()){window.mzRole='admin';updateAdminVisibility();return;}
    try{
      mzHelperRoleUnsub=db.collection('mangaZERO_helpers').doc(u.uid).onSnapshot(function(s){
        window.mzRole=s.exists?'helper':'user';
        updateAdminVisibility();
        if(s.exists && location.hash==='#admin')openAdminFromAuth().catch(function(e){console.warn('open helper admin:',e);});
      },function(e){
        console.error('helper role listener:',e);
        loadRole(u).then(updateAdminVisibility);
      });
    }catch(e){
      console.error('helper role listener setup:',e);
      loadRole(u).then(updateAdminVisibility);
    }
  }
  function updateAdminVisibility(){
    const allowed=isAdmin()||window.mzRole==='helper';
    if(typeof adminButton!=='undefined'&&adminButton)adminButton.style.display=allowed?'block':'none';
    document.querySelectorAll('[data-admin-nav],[data-admin-tab]').forEach(b=>{const k=b.dataset.adminNav||b.dataset.adminTab;b.style.display=(window.mzRole==='helper'?(k==='manga'||k==='users'||k==='bans'||k==='reports'?'':'none'):(isAdmin()?'':'none'))});
    if(typeof adminPage!=='undefined'&&adminPage&&!allowed&&location.hash==='#admin'){adminPage.style.display='none';if(sitePage)sitePage.style.display='block';history.replaceState(null,'',location.pathname+location.search)}
  }
  function fmtDate(ts){if(!ts)return'غير محدد';const d=ts.toDate?ts.toDate():new Date(ts);return d.toLocaleString('ar-EG')}
  let mzReportsCountUnsubscribe=null;
  function startReportsCountListener(){
    if(!db || !(isAdmin() || window.mzRole==='helper')) return;
    try{
      if(mzReportsCountUnsubscribe) mzReportsCountUnsubscribe();
      mzReportsCountUnsubscribe=db.collection('mangaZERO_reports').where('status','==','open').onSnapshot(function(snap){
        const n=snap.size;
        const rc=document.getElementById('adminReportCount');
        if(rc)rc.textContent=String(n);
        ['adminReportNavBadge','adminReportTabBadge'].forEach(function(id){const el=document.getElementById(id);if(el)el.textContent=n>0?String(n):'';});
      },function(e){console.warn('reports count listener:',e);});
    }catch(e){console.warn('startReportsCountListener:',e);}
  }
  async function updateCounts(){
    if(!db)return;
    try{
      const s=await db.collection('mangaZERO_users').get();
      const n=s.size;
      const c=document.getElementById('adminUserCount'),t=document.getElementById('usersCountText');
      if(c)c.textContent=n;
      if(t)t.textContent='👥 عدد المستخدمين المسجلين: '+n;
      const online=document.getElementById('onlineUserCount');
      if(online)online.textContent=window.currentUser?'1 نشط الآن':'0 نشط الآن';
      const r=await db.collection('mangaZERO_reports').where('status','==','open').get(),rc=document.getElementById('adminReportCount');
      const reportCount=r.size;
      if(rc)rc.textContent=reportCount;
      ['adminReportNavBadge','adminReportTabBadge'].forEach(function(id){const el=document.getElementById(id);if(el)el.textContent=reportCount>0?String(reportCount):'';});
    }catch(e){console.error('updateCounts:',e);}
  }
  const TITLE_META={admin:{label:'ADMIN',icon:'👑',cls:'admin'},moderator:{label:'مشرف',icon:'🛡️',cls:'mod'},supporter:{label:'داعم',icon:'💎',cls:'support'},veteran:{label:'مخضرم',icon:'⚡',cls:'veteran'},member:{label:'عضو',icon:'👤',cls:'member'}};
  function normalizeTitle(t){const x=mzCommentNormalizeTitle(t);return TITLE_META[x]?x:'member';}
  function getTitleArray(data){return window.mzGetUserTitles?window.mzGetUserTitles(data):[normalizeTitle(data)];}
  function titleBadgeHTML(title,verified){const arr=getTitleArray(title);return arr.map(function(k){const m=TITLE_META[k];const isVerified=(k==='admin')||verified===true;const v=isVerified?' <span class="mz-verified-badge" title="حساب موثّق">✓</span>':'';return '<span class="mz-title-badge mz-title-'+m.cls+'">'+m.icon+' '+m.label+v+'</span>';}).join(' ');}
  function titleNameHTML(name,title){const k=getTitleArray(title)[0],m=TITLE_META[k];return '<span class="mz-title-name-'+m.cls+'">'+esc2(name)+'</span>';}
  async function setUserTitles(uid,titles,u){
    if(!isAdmin())return;
    const id=typeof uid==='string'?uid:uid&&uid.id;if(!id)return;
    let next=window.mzGetUserTitles?window.mzGetUserTitles(titles):['member'];
    if(next.length>2)next=next.slice(0,2);
    const primary=next[0]||'member';
    try{
      await db.collection('mangaZERO_users').doc(id).set({titles:next,title:primary,titleUpdatedAt:firebase.firestore.FieldValue.serverTimestamp(),titleUpdatedByUid:window.currentUser.uid},{merge:true});
      const ps=await db.collection('mangaZERO_users').doc(id).get();
      if(ps.exists)await syncPublicProfileFromUserData(Object.assign({uid:id},ps.data()||{}),false);
      try{
        const cs=await db.collection('mangaZERO_comments').where('uid','==',id).get();
        if(!cs.empty){let batch=db.batch(),count=0;cs.forEach(function(doc){batch.update(doc.ref,{titles:next,title:primary,titleUpdatedAt:firebase.firestore.FieldValue.serverTimestamp()});count++;if(count===400){batch.commit();batch=db.batch();count=0;}});if(count>0)await batch.commit();}
      }catch(commentErr){console.warn('comment title sync:',commentErr);}
      try{
        if(typeof mangaList!=='undefined'&&Array.isArray(mangaList))mangaList.forEach(function(m){if(Array.isArray(m.comments))m.comments.forEach(function(c){if(String(c.uid||'')===id){c.titles=next.slice();c.title=primary;}});});
        if(typeof window.currentMangaPage!=='undefined'&&window.currentMangaPage&&Array.isArray(window.currentMangaPage.comments)){window.currentMangaPage.comments.forEach(function(c){if(String(c.uid||'')===id){c.titles=next.slice();c.title=primary;}});if(typeof renderComments==='function')renderComments(window.currentMangaPage);}
      }catch(renderErr){console.warn('comment title render sync:',renderErr);}
      showToast('تم تعيين '+next.length+' لقب للمستخدم ✅');
      await renderUsers();
      await renderBans();
    }catch(e){console.error('setUserTitles:',e);showToast('تعذر تغيير الألقاب: '+(e&&e.code?e.code:'خطأ غير معروف'));}
  }
  async function setUserTitle(uid,title,u){ return setUserTitles(uid,[title],u); }
  async function setUserVerified(uid,verified,u){
    if(!isAdmin())return;
    const id=typeof uid==='string'?uid:uid&&uid.id;if(!id)return;
    const next=!!verified;
    try{
      await db.collection('mangaZERO_users').doc(id).set({verified:next,verifiedUpdatedAt:firebase.firestore.FieldValue.serverTimestamp(),verifiedUpdatedByUid:window.currentUser.uid},{merge:true});
      const ps=await db.collection('mangaZERO_users').doc(id).get();
      if(ps.exists)await syncPublicProfileFromUserData(Object.assign({uid:id},ps.data()||{}),false);
      try{
        const cs=await db.collection('mangaZERO_comments').where('uid','==',id).get();
        if(!cs.empty){let batch=db.batch(),count=0;cs.forEach(function(doc){batch.update(doc.ref,{verified:next,verifiedUpdatedAt:firebase.firestore.FieldValue.serverTimestamp()});count++;if(count===400){batch.commit();batch=db.batch();count=0;}});if(count>0)await batch.commit();}
      }catch(e){console.warn('comment verified sync:',e);}
      try{
        if(typeof mangaList!=='undefined'&&Array.isArray(mangaList))mangaList.forEach(function(m){if(Array.isArray(m.comments))m.comments.forEach(function(c){if(String(c.uid||'')===id)c.verified=next;});});
        if(window.currentMangaPage&&Array.isArray(window.currentMangaPage.comments)){window.currentMangaPage.comments.forEach(function(c){if(String(c.uid||'')===id)c.verified=next;});if(typeof renderComments==='function')renderComments(window.currentMangaPage);}
      }catch(e){console.warn('verified render sync:',e);}
      showToast(next?'تم توثيق الحساب 🔵✓':'تم إلغاء توثيق الحساب');
      await renderUsers();
    }catch(e){console.error('setUserVerified:',e);showToast('تعذر تغيير التوثيق: '+(e&&e.code?e.code:'خطأ غير معروف'));}
  }

  async function renderUsers(){
    const box=document.getElementById('usersList');if(!box||!db)return;
    const searchEl=document.getElementById('adminUserEmailSearch');
    const search=String(searchEl&&searchEl.value||'').trim().toLowerCase();
    box.innerHTML='<div class="admin-empty">جاري تحميل المستخدمين...</div>';
    try{
      const s=await db.collection('mangaZERO_users').get();
      const bm={};
      try{const b=await db.collection('mangaZERO_bans').get();b.forEach(d=>bm[d.id]=d.data())}
      catch(be){console.error('mangaZERO_bans:',be);}
      box.innerHTML='';
      if(s.empty){box.innerHTML='<div class="admin-empty">لا يوجد مستخدمون مسجلون.</div>';return}
      const docs=Array.from(s.docs).sort((x,y)=>{const a=x.data()||{},bb=y.data()||{};const ta=a.createdAt&&a.createdAt.toMillis?a.createdAt.toMillis():0,tb=bb.createdAt&&bb.createdAt.toMillis?bb.createdAt.toMillis():0;return tb-ta;});
      const filtered=search?docs.filter(function(d){const u=d.data()||{};return String(u.email||'').toLowerCase().indexOf(search)!==-1;}):docs;
      const countText=document.getElementById('usersCountText');
      if(countText)countText.textContent=search?'🔎 النتائج: '+filtered.length+' من '+docs.length+' مستخدم':'👥 عدد المستخدمين المسجلين: '+docs.length;
      if(!filtered.length){box.innerHTML='<div class="admin-empty">لا يوجد مستخدم بهذا الإيميل.</div>';return}
      filtered.forEach(d=>{const u=d.data()||{},ban=bm[d.id],protectedUser=String(u.email||'').toLowerCase()===ADMIN_EMAIL.toLowerCase(),title=protectedUser?'admin':mzCommentNormalizeTitle(u.title),card=document.createElement('div');card.className='admin-user-card';const avatar=u.photoURL?'<img class="admin-user-avatar" src="'+esc2(u.photoURL)+'">':'<div class="admin-user-avatar" style="display:flex;align-items:center;justify-content:center;">👤</div>';const bt=ban&&ban.active?'<div class="ban-badge">🚫 محظور — '+esc2(ban.durationLabel||'مؤبد')+(ban.expiresAt?' — حتى '+esc2(fmtDate(ban.expiresAt)):'')+'</div>':'';card.innerHTML='<div class="admin-user-top">'+avatar+'<div class="admin-user-info"><strong>'+titleNameHTML(u.name||u.email||'مستخدم',title)+'</strong>'+titleBadgeHTML(title,u.verified===true)+'<span>'+esc2(u.email||'')+'</span>'+bt+'</div></div><div class="admin-user-actions"></div>';const a=card.querySelector('.admin-user-actions');if(isAdmin()&&!protectedUser){const currentTitles=window.mzGetUserTitles?window.mzGetUserTitles(u):[title];
const opts='<option value="member">👤 عضو</option><option value="supporter">💎 داعم</option><option value="moderator">🛡️ مشرف</option><option value="veteran">⚡ مخضرم</option><option value="admin">👑 ADMIN</option>';
const ts1=document.createElement('select');ts1.className='mz-title-select';ts1.innerHTML='<option value="">— اللقب الأول —</option>'+opts;ts1.value=currentTitles[0]||'member';
const ts2=document.createElement('select');ts2.className='mz-title-select';ts2.innerHTML='<option value="">— اللقب الثاني —</option>'+opts;ts2.value=currentTitles[1]||'';
const saveTitles=function(){let vals=[ts1.value,ts2.value].filter(Boolean);vals=[...new Set(vals)];if(!vals.length)vals=['member'];if(vals.length>2)vals=vals.slice(0,2);setUserTitles(d.id,vals,u);};
ts1.onchange=saveTitles;ts2.onchange=saveTitles;a.appendChild(ts1);a.appendChild(ts2);const vb=document.createElement('button');vb.type='button';vb.className='admin-action-btn admin-verify-btn'+(u.verified===true?'':' off');vb.textContent=u.verified===true?'🔵 موثّق ✓':'☑️ توثيق الحساب';vb.title=u.verified===true?'إلغاء التوثيق':'إعطاء علامة التوثيق';vb.onclick=()=>setUserVerified(d.id,u.verified!==true,u);a.appendChild(vb);}if(!protectedUser){if(ban&&ban.active){const x=document.createElement('button');x.className='admin-action-btn admin-unban-btn';x.textContent='🔓 إلغاء الحظر';x.onclick=()=>unbanUser(d.id);a.appendChild(x)}else{[['يوم','1d'],['يومين','2d'],['3 أيام','3d'],['أسبوع','1w'],['سنة','1y'],['مؤبد','forever']].forEach(x=>{const q=document.createElement('button');q.className='admin-action-btn admin-ban-btn';q.textContent='🚫 '+x[0];q.onclick=()=>banUser(d.id,x[1],u);a.appendChild(q)})}}box.appendChild(card)})
    }catch(e){console.error('renderUsers:',e);box.innerHTML='<div class="admin-empty">تعذر تحميل المستخدمين: '+esc2(e&&e.code?e.code:'permission-denied')+'</div>'}
  }
  (function initAdminUserEmailSearch(){
    const input=document.getElementById('adminUserEmailSearch');
    const clear=document.getElementById('adminUserEmailSearchClear');
    if(!input)return;
    let timer=null;
    input.addEventListener('input',function(){
      clearTimeout(timer);
      timer=setTimeout(function(){renderUsers();},120);
    });
    if(clear)clear.addEventListener('click',function(){input.value='';renderUsers();input.focus();});
  })();

  async function banUser(uid,dur,u,mode){if(!window.mzCanBan())return;const id=typeof uid==='string'?uid:uid&&uid.id;if(!id)return;if(String(u.email||'').toLowerCase()===ADMIN_EMAIL.toLowerCase()){showToast('لا يمكن حظر الأدمن الرئيسي');return}const banMode=mode==='full'?'full':'restricted',exp=getBanExpiry(dur),label=getBanLabel(dur);try{await db.collection('mangaZERO_bans').doc(id).set({uid:id,email:u.email||'',name:u.name||'',active:true,mode:banMode,type:banMode,duration:dur,durationLabel:label,expiresAt:exp,createdAt:firebase.firestore.FieldValue.serverTimestamp(),bannedByUid:window.currentUser.uid,bannedByEmail:window.currentUser.email||''},{merge:true});showToast((banMode==='full'?'تم تنفيذ الحظر الكامل 🚫':'تم تقييد المستخدم 🔒'));await renderUsers();await renderBans();updateCounts()}catch(e){console.error('banUser:',e);showToast('تعذر تنفيذ الحظر: '+(e&&e.code?e.code:'خطأ غير معروف'))}}
  async function unbanUser(uid){if(!window.mzCanBan())return;const id=typeof uid==='string'?uid:uid&&uid.id;if(!id)return;try{await db.collection('mangaZERO_bans').doc(id).set({active:false,unbannedAt:firebase.firestore.FieldValue.serverTimestamp(),unbannedByUid:window.currentUser.uid},{merge:true});showToast('تم إلغاء الحظر 🔓');await renderUsers();updateCounts()}catch(e){console.error(e);showToast('تعذر إلغاء الحظر')}}
  function getBanExpiry(dur){
    const now=Date.now();
    if(dur==='1d') return new Date(now+86400000);
    if(dur==='2d') return new Date(now+172800000);
    if(dur==='3d') return new Date(now+259200000);
    if(dur==='1w') return new Date(now+604800000);
    if(dur==='1y') return new Date(now+31536000000);
    return null;
  }
  function getBanLabel(dur){return ({'1d':'يوم واحد','2d':'يومين','3d':'3 أيام','1w':'أسبوع','1y':'سنة','forever':'نهائي'})[dur]||'نهائي'}
  async function loadBanMap(){
    const bm={};
    try{const b=await db.collection('mangaZERO_bans').get();b.forEach(d=>bm[d.id]=d.data()||{});}catch(e){console.error('mangaZERO_bans:',e);}
    return bm;
  }
  function banIsActive(b){
    if(!b||!b.active)return false;
    const exp=b.expiresAt&&b.expiresAt.toDate?b.expiresAt.toDate():null;
    return !exp||exp.getTime()>Date.now();
  }
  async function renderBans(){
    const box=document.getElementById('bansList');const count=document.getElementById('bansCountText');
    if(!box||!db||!(isAdmin()||window.mzRole==='helper'))return;
    try{
      const s=await db.collection('mangaZERO_users').get(),bm=await loadBanMap(),arr=[];
      s.forEach(d=>{const u=d.data()||{},b=bm[d.id];if(b&&b.active&&!banIsActive(b)){db.collection('mangaZERO_bans').doc(d.id).set({active:false,autoUnbannedAt:firebase.firestore.FieldValue.serverTimestamp()},{merge:true});return;}arr.push({id:d.id,u,b});});
      arr.sort((a,b)=>String(a.u.name||a.u.email||'').localeCompare(String(b.u.name||b.u.email||''),'ar'));
      const active=arr.filter(x=>banIsActive(x.b)).length;
      if(count)count.textContent='إجمالي المستخدمين: '+arr.length+' — المحظورون/المقيّدون حاليًا: '+active;
      box.innerHTML='';
      if(!arr.length){box.innerHTML='<div class="admin-empty">لا يوجد مستخدمون مسجلون.</div>';return;}
      arr.forEach(function(item){
        const d=item.id,u=item.u,b=item.b,protectedUser=String(u.email||'').toLowerCase()===ADMIN_EMAIL.toLowerCase();
        const card=document.createElement('div');card.className='admin-user-card';
        const avatar=u.photoURL?'<img class="admin-user-avatar" src="'+esc2(u.photoURL)+'">':'<div class="admin-user-avatar" style="display:flex;align-items:center;justify-content:center;">👤</div>';
        const activeBan=banIsActive(b);
        const banMode=(b&&(b.type||b.mode))==='full'?'full':'restricted';
        const badge=activeBan?(banMode==='full'?'<div class="ban-full-badge">🚫 حظر كامل — '+esc2(b.durationLabel||getBanLabel(b.duration))+(b.expiresAt?' — حتى '+esc2(fmtDate(b.expiresAt)):'')+'</div>':'<div class="ban-restricted-badge">🔒 تقييد — '+esc2(b.durationLabel||getBanLabel(b.duration))+(b.expiresAt?' — حتى '+esc2(fmtDate(b.expiresAt)):'')+'</div>'):'';
        card.innerHTML='<div class="admin-user-top">'+avatar+'<div class="admin-user-info"><strong>'+esc2(u.name||u.email||'مستخدم')+(protectedUser?' 👑 ADMIN <span class=\"mz-verified-badge\" title=\"حساب موثّق\">✓</span>':'')+'</strong><span>'+esc2(u.email||'')+'</span>'+badge+'</div></div><div class="admin-user-actions"></div>';
        const actions=card.querySelector('.admin-user-actions');
        if(protectedUser){actions.innerHTML='<span class="admin-empty">الأدمن الرئيسي محمي من الحظر.</span>';box.appendChild(card);return;}
        if(activeBan){const ub=document.createElement('button');ub.className='admin-action-btn admin-unban-btn';ub.textContent='🔓 إلغاء الحظر/التقييد';ub.onclick=()=>unbanUser(d).then(renderBans);actions.appendChild(ub);}
        else{
          const mode=document.createElement('select');mode.className='admin-ban-select';mode.innerHTML='<option value="restricted">🔒 تقييد فقط</option><option value="full">🚫 حظر كامل</option>';
          const dur=document.createElement('select');dur.className='admin-ban-select';dur.innerHTML='<option value="1d">يوم</option><option value="2d">يومين</option><option value="3d">3 أيام</option><option value="1w">أسبوع</option><option value="1y">سنة</option><option value="forever">نهائي</option>';
          const go=document.createElement('button');go.className='admin-action-btn admin-ban-btn';go.textContent='🚫 تنفيذ';go.onclick=async()=>{if(!confirm((mode.value==='full'?'حظر كامل':'تقييد')+' «'+(u.name||u.email||'المستخدم')+'» لمدة '+getBanLabel(dur.value)+'؟'))return;await banUser(d,dur.value,u,mode.value);await renderBans();};
          actions.appendChild(mode);actions.appendChild(dur);actions.appendChild(go);
        }
        box.appendChild(card);
      });
    }catch(e){console.error('renderBans:',e);box.innerHTML='<div class="admin-empty">تعذر تحميل صفحة الحظر.</div>';}
  }
  async function renderHelpers(){const box=document.getElementById('helpersList');if(!box||!db||!isAdmin())return;try{const s=await db.collection('mangaZERO_helpers').get();box.innerHTML='';if(s.empty){box.innerHTML='<div class="admin-empty">لا يوجد مساعدين حاليًا</div>';return}Array.from(s.docs).sort((x,y)=>{const a=x.data()||{},bb=y.data()||{};const ta=a.addedAt&&a.addedAt.toMillis?a.addedAt.toMillis():0,tb=bb.addedAt&&bb.addedAt.toMillis?bb.addedAt.toMillis():0;return tb-ta;}).forEach(d=>{const h=d.data(),c=document.createElement('div');c.className='admin-helper-card';c.innerHTML='<div class="admin-user-top"><div class="admin-user-avatar" style="display:flex;align-items:center;justify-content:center;">🛡️</div><div class="admin-user-info"><strong>'+esc2(h.name||h.email||'مساعد')+'</strong><span>'+esc2(h.email||'')+'</span><span>صلاحيات: مانجا + فصول + حظر/إلغاء حظر</span></div></div><div class="admin-user-actions"><button class="admin-action-btn admin-delete-btn">🗑️ إزالة المساعد</button></div>';c.querySelector('button').onclick=async()=>{if(!confirm('إزالة هذا المساعد؟'))return;try{await db.collection('mangaZERO_helpers').doc(d.id).delete();showToast('تمت إزالة المساعد');renderHelpers()}catch(e){showToast('تعذر إزالة المساعد')}};box.appendChild(c)})}catch(e){console.error(e);box.innerHTML='<div class="admin-empty">تعذر تحميل المساعدين.</div>'}}
  let mzHelperUsersCache=null;
  let mzHelperPickerLoaded=false;
  function closeHelperPicker(){const picker=document.getElementById('helperPicker'),panel=document.getElementById('helperPickerPanel');if(!picker||!panel)return;panel.style.display='none';picker.classList.remove('open')}
  function renderHelperUserOptions(filter){const list=document.getElementById('helperUserList');if(!list)return;const users=Array.isArray(mzHelperUsersCache)?mzHelperUsersCache:[],q=String(filter||'').trim().toLowerCase();const filtered=users.filter(u=>{const name=String(u.name||'').toLowerCase(),email=String(u.email||'').toLowerCase();return !q||name.includes(q)||email.includes(q)});list.innerHTML='';if(!filtered.length){list.innerHTML='<div class="admin-empty">لا يوجد مستخدم مطابق للبحث.</div>';return}filtered.forEach(function(u){const row=document.createElement('button');row.type='button';row.className='mz-helper-user-option';const avatar=document.createElement('div');avatar.className='mz-helper-user-avatar';if(u.photoURL){const img=document.createElement('img');img.src=u.photoURL;img.className='mz-helper-user-avatar';img.alt='';avatar.replaceWith(img)}else{avatar.textContent='👤'}const info=document.createElement('div');info.className='mz-helper-user-info';const name=document.createElement('span');name.className='mz-helper-user-name';name.textContent=u.name||u.email||'مستخدم';const email=document.createElement('span');email.className='mz-helper-user-email';email.textContent=u.email||'';info.appendChild(name);info.appendChild(email);row.appendChild(avatar.parentNode===row?avatar:avatar);row.appendChild(info);row.onclick=function(){const input=document.getElementById('helperEmailInput'),text=document.getElementById('helperPickerText');if(input)input.value=String(u.email||'').trim().toLowerCase();if(text)text.textContent=(u.name||u.email||'مستخدم')+' — '+(u.email||'');closeHelperPicker()};list.appendChild(row)})}
  async function loadHelperUsers(force){if(!isAdmin()||!db)return;if(mzHelperUsersCache&&!force){renderHelperUserOptions(document.getElementById('helperUserSearch')?.value||'');return}const list=document.getElementById('helperUserList');if(list)list.innerHTML='<div class="admin-empty">جاري تحميل المستخدمين...</div>';try{const s=await db.collection('mangaZERO_users').get();mzHelperUsersCache=Array.from(s.docs).map(function(d){const u=d.data()||{};return {uid:d.id,email:String(u.email||'').trim(),name:String(u.name||u.username||u.email||'مستخدم'),photoURL:String(u.photoURL||'')}}).filter(u=>u.email);mzHelperUsersCache.sort(function(a,b){return String(a.name||a.email).localeCompare(String(b.name||b.email),'ar')});mzHelperPickerLoaded=true;renderHelperUserOptions('')}catch(e){console.error('load helper users:',e);mzHelperUsersCache=[];if(list)list.innerHTML='<div class="admin-empty">تعذر تحميل المستخدمين.</div>';showToast('تعذر تحميل قائمة المستخدمين')}}
  function openHelperPicker(){if(!isAdmin())return;const picker=document.getElementById('helperPicker'),panel=document.getElementById('helperPickerPanel'),search=document.getElementById('helperUserSearch');if(!picker||!panel)return;const open=panel.style.display!=='none';if(open){closeHelperPicker();return}panel.style.display='block';picker.classList.add('open');loadHelperUsers(false).then(function(){if(search){search.value='';search.focus()}})}
  async function addHelper(){if(!isAdmin())return;const i=document.getElementById('helperEmailInput'),email=(i.value||'').trim().toLowerCase();if(!email){showToast('اختار المستخدم الأول');return}try{const q=await db.collection('mangaZERO_users').where('email','==',email).limit(1).get();if(q.empty){showToast('الإيميل غير مسجل. لازم صاحبه يسجل دخول Google الأول.');return}const d=q.docs[0],u=d.data()||{};if(email===ADMIN_EMAIL.toLowerCase()){showToast('ده الأدمن الرئيسي بالفعل');return}const existing=await db.collection('mangaZERO_helpers').doc(d.id).get();if(existing.exists){showToast('المستخدم ده مساعد بالفعل 🛡️');return}await db.collection('mangaZERO_helpers').doc(d.id).set({uid:d.id,email,name:u.name||u.username||email,photoURL:u.photoURL||'',addedAt:firebase.firestore.FieldValue.serverTimestamp(),addedByUid:window.currentUser.uid,addedByEmail:window.currentUser.email},{merge:true});i.value='';const text=document.getElementById('helperPickerText');if(text)text.textContent='اختر مستخدمًا من المسجلين في الموقع';closeHelperPicker();showToast('تمت إضافة المساعد 🛡️');await renderHelpers()}catch(e){console.error(e);showToast('تعذر إضافة المساعد')}}

  async function renderReports(){
    const box=document.getElementById('reportsList');
    if(!box||!db||!(isAdmin()||window.mzRole==='helper'))return;
    try{
      // نعرض البلاغات المفتوحة فقط حتى لا تمتلئ الصفحة بالبلاغات التي تم التعامل معها.
      const s=await db.collection('mangaZERO_reports').where('status','==','open').get();
      box.innerHTML='';
      if(s.empty){box.innerHTML='<div class="admin-empty">لا توجد بلاغات جديدة حاليًا. ✅</div>';return;}
      Array.from(s.docs).sort((x,y)=>{
        const a=x.data()||{},bb=y.data()||{};
        const ta=a.createdAt&&a.createdAt.toMillis?a.createdAt.toMillis():0;
        const tb=bb.createdAt&&bb.createdAt.toMillis?bb.createdAt.toMillis():0;
        return tb-ta;
      }).forEach(d=>{
        const r=d.data()||{},c=document.createElement('div');
        c.className='admin-report-card';
        c.innerHTML='<strong>🚩 '+esc2(r.type==='chapter_comment'?'بلاغ تعليق فصل':'بلاغ تعليق مانجا')+' — '+esc2(r.mangaName||'مانجا')+'</strong>'+
          (r.type==='chapter_comment'?'<div class="admin-report-text">الفصل: '+esc2(r.chapterTitle||'الفصل')+'</div>':'')+
          '<div class="admin-report-text">التعليق: '+esc2(r.commentText||'')+'</div>'+
          '<div class="admin-report-text">صاحب التعليق: '+esc2(r.commentUser||'مستخدم')+' — '+esc2(r.commentEmail||'')+'</div>'+ 
          '<div class="admin-report-text">السبب: '+esc2(r.reason||'بدون سبب')+'</div>'+ 
          '<div class="admin-report-text">المُبلّغ: '+esc2(r.reportedByEmail||'')+'</div>'+ 
          '<div class="admin-report-text">الحالة: بلاغ جديد</div>'+ 
          '<div class="admin-user-actions"></div>';
        const a=c.querySelector('.admin-user-actions');

        const del=document.createElement('button');
        del.className='admin-action-btn admin-delete-btn';
        del.textContent='🗑️ حذف التعليق';
        del.onclick=async()=>{
          if(!confirm('هل تريد حذف التعليق والتعامل مع هذا البلاغ؟'))return;
          try{
            if(r.type==='chapter_comment'){
              await db.collection('mangaZERO_chapter_comments').doc(String(r.commentId||'')).delete();
            }else{
              const m=mangaList.find(x=>String(x.id)===String(r.mangaId));
              if(m&&Array.isArray(m.comments)){
                const idx=m.comments.findIndex(cc=>String(cc.id||'')===String(r.commentId||r.commentUid||'') || (String(cc.uid||'')===String(r.commentUid||'')&&String(cc.text||'')===String(r.commentText||'')));
                if(idx>=0){m.comments.splice(idx,1);saveData();renderManga();}
              }
              await db.collection('mangaZERO_comments').doc(String(r.commentId||'')).delete().catch(function(){});
            }
            await db.collection('mangaZERO_reports').doc(d.id).delete();
            showToast('تم حذف التعليق وحذف البلاغ ✅');
            await renderReports();
            await updateCounts();
          }catch(e){
            console.error('delete reported comment:',e);
            showToast(e&&e.code==='permission-denied'?'ليس لديك صلاحية حذف البلاغ':'تعذر حذف التعليق أو البلاغ');
          }
        };

        const close=document.createElement('button');
        close.className='admin-action-btn admin-muted-btn';
        close.textContent='✅ إغلاق البلاغ';
        close.onclick=async()=>{
          if(!confirm('إغلاق هذا البلاغ وإزالته من البلاغات الجديدة؟'))return;
          try{
            await db.collection('mangaZERO_reports').doc(d.id).update({
              status:'closed',action:'dismissed',
              handledAt:firebase.firestore.FieldValue.serverTimestamp(),
              handledByUid:window.currentUser.uid
            });
            showToast('تم إغلاق البلاغ ✅');
            await renderReports();
            await updateCounts();
          }catch(e){
            console.error('close report:',e);
            showToast(e&&e.code==='permission-denied'?'ليس لديك صلاحية إغلاق البلاغ':'تعذر إغلاق البلاغ');
          }
        };

        a.appendChild(del);
        a.appendChild(close);

        // حذف سجل البلاغ نهائيًا حتى لا يظل محفوظًا ويملأ الصفحة.
        if(isAdmin()){
          const deleteReport=document.createElement('button');
          deleteReport.className='admin-action-btn admin-delete-btn';
          deleteReport.textContent='🗑️ حذف البلاغ';
          deleteReport.onclick=async()=>{
            if(!confirm('حذف رسالة البلاغ نهائيًا؟ لا يمكن التراجع عن هذا الإجراء.'))return;
            try{
              await db.collection('mangaZERO_reports').doc(d.id).delete();
              showToast('تم حذف البلاغ نهائيًا 🗑️');
              await renderReports();
              await updateCounts();
            }catch(e){
              console.error('delete report:',e);
              showToast(e&&e.code==='permission-denied'?'ليس لديك صلاحية حذف البلاغ':'تعذر حذف البلاغ');
            }
          };
          a.appendChild(deleteReport);
        }
        box.appendChild(c);
      });
    }catch(e){
      console.error('renderReports:',e);
      box.innerHTML='<div class="admin-empty">تعذر تحميل البلاغات.</div>';
    }
  }
  async function refreshAdminData(){if(!(isAdmin()||window.mzRole==='helper'))return;startReportsCountListener();await updateCounts();await renderUsers();await renderBans();await renderReports();if(isAdmin()){await renderHelpers();loadAdminSupport()}}
  window.refreshAdminData=refreshAdminData;
  window.mzBanInfo=null;window.mzIsRestricted=()=>!!(window.mzBanInfo&&window.mzBanInfo.active&&(window.mzBanInfo.type||window.mzBanInfo.mode)==='restricted');window.mzIsFullyBanned=()=>!!(window.mzBanInfo&&window.mzBanInfo.active&&(window.mzBanInfo.type||window.mzBanInfo.mode)==='full');
  async function checkBan(){if(!db||!window.currentUser){window.mzBanInfo=null;return null}try{const ref=db.collection('mangaZERO_bans').doc(window.currentUser.uid),s=await ref.get();if(!s.exists||!s.data().active){window.mzBanInfo=null;return null}const b=s.data()||{},mode=(b.type||b.mode||'full')==='full'?'full':'restricted',exp=b.expiresAt&&b.expiresAt.toDate?b.expiresAt.toDate():null;if(exp&&exp.getTime()<=Date.now()){await ref.set({active:false,autoUnbannedAt:firebase.firestore.FieldValue.serverTimestamp()},{merge:true});window.mzBanInfo=null;return null}window.mzBanInfo=Object.assign({},b,{mode:mode,type:mode});if(mode==='full'){showToast('حسابك محظور من الموقع '+(b.durationLabel||''));try{await auth.signOut()}catch(e){}return Object.assign({},b,{mode:mode,type:mode})}showToast('حسابك مقيّد: يمكنك المشاهدة والقراءة وتسجيل الخروج فقط 🔒');return Object.assign({},b,{mode:mode,type:mode})}catch(e){console.error('checkBan:',e);window.mzBanInfo=null;return null}}
  function guardRestricted(action){if(!window.mzIsRestricted())return true;showToast('حسابك مقيّد حاليًا: المسموح فقط المشاهدة والقراءة وتسجيل الخروج 🔒');return false}
  function applyRestrictionUI(){const restricted=(!isAdmin() && window.mzIsRestricted());document.documentElement.classList.toggle('mz-user-restricted',restricted);document.querySelectorAll('#mzSupportOpen,#mzProfileOpen,#mzThemeToggle,#mzProfileThemeToggle').forEach(function(el){if(!el)return;el.classList.toggle('mz-restricted-action',restricted);el.setAttribute('aria-disabled',restricted?'true':'false');});/* التعليقات لا تُعطّل من الواجهة؛ السماح النهائي يحدده تسجيل الدخول وFirebase Rules. */}
  async function signInWithGoogle(){
    if(!auth||!provider){setMsg(loginMsg,'تعذر تشغيل Firebase.',false);return}
    if(googleLogin)googleLogin.disabled=true;
    setMsg(loginMsg,'جاري فتح تسجيل الدخول بـ Google...',true);
    try{
      await auth.signInWithPopup(provider);
    }catch(e){
      console.error('Google sign-in:',e);
      const code=e&&e.code?String(e.code):'';
      if(code==='auth/popup-closed-by-user') setMsg(loginMsg,'تم إغلاق نافذة تسجيل الدخول.',false);
      else if(code==='auth/popup-blocked') setMsg(loginMsg,'المتصفح منع نافذة Google. اسمح بالنوافذ المنبثقة ثم حاول مرة أخرى.',false);
      else setMsg(loginMsg,'حدث خطأ أثناء تسجيل الدخول بـ Google. حاول مرة أخرى.',false);
    }finally{
      if(googleLogin)googleLogin.disabled=false;
    }
  }
  if(menu)menu.addEventListener('click',openSide);if(sideClose)sideClose.addEventListener('click',closeSide);if(overlay)overlay.addEventListener('click',closeSide);if(loginOpen)loginOpen.addEventListener('click',openAccount);if(accountClose)accountClose.addEventListener('click',closeAccount);if(googleLogin)googleLogin.addEventListener('click',signInWithGoogle);if(termsOpen)termsOpen.addEventListener('click',function(){openTerms(false)});if(termsClose)termsClose.addEventListener('click',function(){if(window.currentUser&&termsConsent&&termsConsent.style.display!=='none')return;closeTerms()});if(termsCancel)termsCancel.addEventListener('click',async function(){try{await auth.signOut()}catch(e){}});if(termsCheckbox)termsCheckbox.addEventListener('change',function(){if(termsAccept)termsAccept.disabled=!this.checked});if(termsAccept)termsAccept.addEventListener('click',acceptTerms);if(profileOpen)profileOpen.addEventListener('click',function(){if(guardRestricted('profile'))openProfile();});if(profileClose)profileClose.addEventListener('click',closeProfile);if(usernameSave)usernameSave.addEventListener('click',function(){if(guardRestricted('profile'))saveUsername();});function toggleTheme(){const current=document.documentElement.classList.contains('mz-day-mode')?'light':'dark';if(guardRestricted('theme'))saveTheme(current==='light'?'dark':'light');}if(sideThemeToggle)sideThemeToggle.addEventListener('click',toggleTheme);if(profileThemeToggle)profileThemeToggle.addEventListener('click',toggleTheme);historyOpen.addEventListener('click',openHistory);historyBack.addEventListener('click',closeHistory);
  if(supportOpen)supportOpen.addEventListener('click',openSupport);if(supportClose)supportClose.addEventListener('click',closeSupport);if(supportSend)supportSend.addEventListener('click',sendSupportMessage);if(supportInput)supportInput.addEventListener('keydown',function(e){if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendSupportMessage();}});const adminSupportSend=document.getElementById('adminSupportSend');if(adminSupportSend)adminSupportSend.addEventListener('click',sendAdminSupportMessage);const adminSupportInput=document.getElementById('adminSupportInput');if(adminSupportInput)adminSupportInput.addEventListener('keydown',function(e){if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendAdminSupportMessage();}});
  const ah=document.getElementById('addHelperBtn');if(ah)ah.addEventListener('click',addHelper);
  const helperPickerBtn=document.getElementById('helperPickerBtn');if(helperPickerBtn)helperPickerBtn.addEventListener('click',openHelperPicker);
  const helperUserSearch=document.getElementById('helperUserSearch');if(helperUserSearch)helperUserSearch.addEventListener('input',function(){renderHelperUserOptions(this.value)});
  document.addEventListener('click',function(e){const picker=document.getElementById('helperPicker');if(picker&&picker.style.display!=='none'&&!picker.contains(e.target))closeHelperPicker()});
  logout.addEventListener('click',async()=>{try{await auth.signOut()}catch(e){}closeSide()});
  function getHistory(){return []}
  function saveHistory(list){}
  async function getCloudHistory(){
    const user=window.currentUser;
    if(!user||!window.mzFirestore)return [];
    try{
      const snap=await window.mzFirestore.collection('mangaZERO_reading_history')
        .doc(String(user.uid)).collection('mangas').orderBy('updatedAt','desc').limit(30).get();
      const out=[];
      snap.forEach(function(doc){out.push(Object.assign({id:doc.id},doc.data()||{}));});
      return out;
    }catch(e){
      console.error('reading history load:',e);
      return [];
    }
  }
  async function recordChapterRead(manga,ch){
    const user=window.currentUser;
    if(!user||!window.mzFirestore||!manga||!ch)return;
    const chapterNumber=getChapterNumber(manga,ch);
    try{
      const db=window.mzFirestore;
      const uid=String(user.uid);
      const mangaId=String(manga.id||'');
      const chapterId=String(ch.id||'');
      const uniqueKey=mangaId+'__'+chapterId;
      const uniqueRef=db.collection('mangaZERO_reading_history').doc(uid).collection('chapters').doc(uniqueKey);
      // سجل المانجا الحالي يظل آخر فصل قرأه المستخدم.
      await db.collection('mangaZERO_reading_history')
        .doc(uid).collection('mangas').doc(mangaId).set({
          mangaId:mangaId,
          mangaName:manga.name||'مانجا',
          author:manga.author||'',
          chapterId:chapterId,
          chapterTitle:ch.title||'الفصل',
          chapterNumber:chapterNumber,
          updatedAt:firebase.firestore.FieldValue.serverTimestamp()
        },{merge:true});

      // تسجيل الفصل والعداد داخل Transaction واحدة: حتى لو فتح المستخدم
      // نفس الفصل من جهازين في نفس اللحظة، الفصل يتحسب مرة واحدة فقط.
      const statsRef=db.collection('mangaZERO_reading_stats').doc(uid);
      const txResult=await db.runTransaction(async function(tx){
        const uniqueSnap=await tx.get(uniqueRef);
        const statsSnap=await tx.get(statsRef);
        const current=statsSnap.exists?Number((statsSnap.data()||{}).uniqueChapterCount||0):0;
        if(uniqueSnap.exists){
          return {isNew:false,nextStats:current};
        }
        tx.set(uniqueRef,{
          mangaId:mangaId,
          chapterId:chapterId,
          chapterNumber:chapterNumber,
          mangaName:manga.name||'مانجا',
          chapterTitle:ch.title||'الفصل',
          firstReadAt:firebase.firestore.FieldValue.serverTimestamp()
        },{merge:false});
        const next=current+1;
        tx.set(statsRef,{uid:uid,uniqueChapterCount:next,updatedAt:firebase.firestore.FieldValue.serverTimestamp()},{merge:true});
        return {isNew:true,nextStats:next};
      });
      const nextStats=Number(txResult.nextStats||0);
      if(txResult.isNew){

        // لقب مخضرم يُمنح تلقائيًا عند الوصول إلى 13,000 فصل مختلف.
        if(nextStats>=13000){
          try{
            const userRef=db.collection('mangaZERO_users').doc(uid);
            const us=await userRef.get();
            const ud=us.exists?(us.data()||{}):{};
            const email=String(ud.email||user.email||'').toLowerCase();
            if(email!==ADMIN_EMAIL.toLowerCase()){
              const oldTitles=window.mzGetUserTitles?window.mzGetUserTitles(ud):[mzCommentNormalizeTitle(ud.title)];
              if(oldTitles.indexOf('veteran')===-1){
                const nextTitles=(oldTitles.length>=2?[oldTitles[0],'veteran']:oldTitles.concat(['veteran'])).slice(0,2);
                await userRef.set({titles:nextTitles,title:nextTitles[0],titleUpdatedAt:firebase.firestore.FieldValue.serverTimestamp(),veteranAt:firebase.firestore.FieldValue.serverTimestamp()},{merge:true});
                await db.collection('mangaZERO_public_profiles').doc(uid).set({titles:nextTitles,title:nextTitles[0],titleUpdatedAt:firebase.firestore.FieldValue.serverTimestamp(),veteranAt:firebase.firestore.FieldValue.serverTimestamp()},{merge:true});
                if(window.currentUser&&String(window.currentUser.uid)===uid){
                  mzProfileUserData=Object.assign({},mzProfileUserData||{},{titles:nextTitles,title:nextTitles[0]});
                  window.mzProfileUserData=mzProfileUserData;
                }
                showToast('🏆 مبروك! وصلت لـ 13,000 فصل مختلف وأصبحت مخضرم ⚡');
              }
            }
          }catch(titleErr){console.warn('veteran title update:',titleErr);}
        }
      }
    }catch(e){
      console.error('reading history save:',e);
    }
  }
  // Expose the chapter-history writer to the main reader script.
  // The reader lives in a different <script> scope, so it cannot call
  // the local function directly.
  window.mzRecordChapterRead=recordChapterRead;

  async function renderHistory(){
    historyList.innerHTML='<div class="mz-history-empty">جاري تحميل سجل القراءة...</div>';
    const l=await getCloudHistory();
    historyList.innerHTML='';
    if(!l.length){
      historyList.innerHTML='<div class="mz-history-empty">لسه مفيش فصول اتقرت.<br>لما تقرأ فصل هتظهر هنا.</div>';
      return;
    }
    l.forEach(function(it){
      const el=document.createElement('div');
      el.className='mz-history-item';
      const ts=it.updatedAt&&it.updatedAt.toDate?it.updatedAt.toDate():new Date();
      el.innerHTML='<div class="mz-history-cover">📖</div><div class="mz-history-info"><strong></strong><span></span></div>';
      el.querySelector('strong').textContent=it.mangaName||'مانجا';
      el.querySelector('span').textContent='✍️ '+(it.author||'غير معروف')+' • 📖 الفصل '+(it.chapterNumber||'—')+' • آخر قراءة: '+ts.toLocaleDateString('ar-EG');
      el.onclick=function(){
        const m=mangaList.find(function(x){return String(x.id)===String(it.mangaId||it.id)});
        if(!m){closeHistory();return;}
        const target=Array.isArray(m.chapters)&&it.chapterId
          ? m.chapters.find(function(ch){return String(ch&&ch.id||'')===String(it.chapterId)})
          : null;
        closeHistory();
        if(target){
          openMangaPage(m,true);
          setTimeout(function(){openChapterReader(m,target)},0);
        }else{
          openMangaPage(m,true);
        }
      };
      historyList.appendChild(el);
    });
  }
  function openHistory(){closeSide();renderHistory();historyPage.style.display='block';document.body.style.overflow='hidden'} function closeHistory(){historyPage.style.display='none';document.body.style.overflow=''}
  let mzCloudMangaLoaded=false;
  async function syncMangaToCloud(){
    if(!db || !window.currentUser || !(isAdmin() || window.mzRole==='helper')) return;
    const batch=db.batch();
    mangaList.forEach(function(m){batch.set(db.collection("mangaZERO_manga").doc(String(m.id)),JSON.parse(JSON.stringify(m)),{merge:true});});
    if(mangaList.length) await batch.commit();
  }
  async function saveMangaToCloud(m){
    if(!db || !window.currentUser || !(isAdmin() || window.mzRole==='helper') || !m) throw new Error("لا توجد صلاحية لحفظ المانجا");
    await db.collection("mangaZERO_manga").doc(String(m.id)).set(JSON.parse(JSON.stringify(m)),{merge:true});
  }
  async function deleteMangaFromCloud(id){
    if(!db || !window.currentUser || !(isAdmin() || window.mzRole==='helper')) return;
    await db.collection("mangaZERO_manga").doc(String(id)).delete();
  }
  async function loadMangaFromCloud(){
    if(!db || mzCloudMangaLoaded) return false;
    try{
      const snap=await db.collection("mangaZERO_manga").get();
      const cloud=[];
      snap.forEach(function(d){
        const m=d.data()||{};
        m.id=m.id||d.id;
        cloud.push(m);
      });
      if(cloud.length){
        cloud.sort(function(a,b){return Number(b.createdAt||0)-Number(a.createdAt||0);});
        mangaList=cloud;
        normalizeMangaData();
        localStorage.setItem("mangaZERO_manga",JSON.stringify(mangaList));
      }
      mzCloudMangaLoaded=true;
      renderManga(currentBrowseMode||"home");
      return true;
    }catch(e){
      console.error("Manga cloud load failed:",e);
      // لا نحول فشل المزامنة إلى إشعار أو نمسح البيانات المحلية.
      // الواجهة تستمر باستخدام النسخة المحلية الموجودة على الجهاز.
      renderManga(currentBrowseMode||"home");
      return false;
    }
  }
  // مزامنة الفصول والمانجا لحظيًا عند جميع الزوار بدون الحاجة لتحديث الصفحة.
  let mzMangaCloudUnsubscribe=null;
  function startMangaCloudListener(){
    if(!db || mzMangaCloudUnsubscribe)return;
    try{
      mzMangaCloudUnsubscribe=db.collection("mangaZERO_manga").onSnapshot(function(snap){
        const cloud=[];
        snap.forEach(function(d){
          const m=d.data()||{};
          m.id=m.id||d.id;
          cloud.push(m);
        });
        cloud.sort(function(a,b){return Number(b.createdAt||0)-Number(a.createdAt||0);});
        if(cloud.length || mangaList.length===0){
          mangaList=cloud;
          normalizeMangaData();
          localStorage.setItem("mangaZERO_manga",JSON.stringify(mangaList));
          renderManga(currentBrowseMode||"home");
          if(currentMangaId!=null){
            const current=mangaList.find(function(x){return String(x.id)===String(currentMangaId)});
            if(current && mangaPage && mangaPage.style.display!=="none") renderChapterList(current);
          }
        }
      },function(err){
        console.error("Manga realtime listener failed:",err);
      });
    }catch(e){console.error("Manga realtime listener setup failed:",e)}
  }
  window.mzStartMangaCloudListener=startMangaCloudListener;
  window.mzStopMangaCloudListener=function(){if(mzMangaCloudUnsubscribe){mzMangaCloudUnsubscribe();mzMangaCloudUnsubscribe=null;}};

  window.mzSyncMangaToCloud=syncMangaToCloud;
  window.mzSaveMangaToCloud=saveMangaToCloud;
  window.mzDeleteMangaFromCloud=deleteMangaFromCloud;
  window.mzLoadMangaFromCloud=loadMangaFromCloud;

  async function openAdminFromAuth(){if(location.hash==='#admin'&&(isAdmin()||window.mzRole==='helper')){sitePage.style.display='none';adminPage.style.display='block';showAdminSection('manga');await refreshAdminData()}}
  auth.onAuthStateChanged(function(user){
    window.currentUser=user||null;
    watchHelperRole(user);
    if(typeof window.mzRefreshCurrentMangaRating === "function") window.mzRefreshCurrentMangaRating();
    if(!user){
      window.mzRole='guest';
      window.mzBanInfo=null;
      localStorage.removeItem(SESSION_KEY);
      closeTerms();
      updateUser(null);
      updateAdminVisibility();
      loadMangaFromCloud().catch(function(e){console.warn('manga load:',e)});
      return;
    }

    // لا نربط إغلاق شاشة الدخول بعمليات Firestore البطيئة.
    // واجهة الحساب تتحدث فورًا، والبيانات الإضافية تُحمّل في الخلفية.
    closeAccount();
    closeSide();
    localStorage.setItem(SESSION_KEY,JSON.stringify({uid:user.uid,username:user.displayName||user.email,email:user.email||'',photoURL:user.photoURL||''}));
    updateUser(user);
    updateAdminVisibility();
    applyRestrictionUI();

    Promise.resolve().then(async function(){
      await syncUser(user);
      // بعد اكتمال تسجيل الدخول، حمّل قائمة مستخدمي النقاط فورًا إذا كان المستخدم هو الأدمن.
      // هذا يمنع بقاء واجهة النقاط على "جاري تحميل المستخدمين..." إذا تم فتح صفحة المهام قبل اكتمال Firebase Auth.
      if(isAdmin() && typeof refreshAdminTasksStore==='function'){
        setTimeout(function(){refreshAdminTasksStore().catch(function(e){console.error('refresh points after auth:',e);});},100);
      }
      try{
        const ps=await db.collection('mangaZERO_users').doc(user.uid).get();
        mzProfileUserData=ps.exists?(ps.data()||{}):{};window.mzProfileUserData=mzProfileUserData;
      }catch(e){
        mzProfileUserData=null;
        console.error(e);
      }
      applyTheme((mzProfileUserData&&mzProfileUserData.theme)||localStorage.getItem('mangaZERO_theme')||'dark');
      updateUser(user);
      updateAdminVisibility();
      const banInfo=await checkBan();
      if(banInfo&&banInfo.mode==='full')return;
      applyRestrictionUI();
      const termsAccepted=await requireTermsConsent(user);
      if(!termsAccepted){await loadRole(user);return;}
      closeTerms();
      if(!mzProfileManualClose && !(mzProfileUserData&&String(mzProfileUserData.username||'').trim()))setTimeout(function(){if(!mzProfileManualClose)openProfile();},250);
      await loadRole(user);
      if(isAdmin()) await seedDefaultProfileBackgrounds();
      await loadMangaFromCloud();
      if(isAdmin()||window.mzRole==='helper')await syncMangaToCloud();
      await openAdminFromAuth();
    }).catch(function(e){
      console.error('Auth background setup:',e);
      // تسجيل الدخول نفسه يظل ناجحًا حتى لو تعطل Firestore أو الشبكة.
      updateUser(user);
      updateAdminVisibility();
    });
  });
  function updateUser(user){if(user){const n=(mzProfileUserData&&mzProfileUserData.username)||user.displayName||user.email||'مستخدم Google',p=user.photoURL?'<img class="mz-user-avatar" src="'+esc2(user.photoURL)+'" alt="">':'<div class="mz-user-avatar-fallback">👤</div>';sideUser.innerHTML=p+'<strong>مرحبًا، '+esc2(n)+' 👋</strong><span>'+esc2(user.email||'')+'</span>';loginOpen.style.display='none';if(profileOpen)profileOpen.style.display='block';if(document.getElementById('mzStoreOpen'))document.getElementById('mzStoreOpen').style.display='block';if(document.getElementById('mzTasksOpen'))document.getElementById('mzTasksOpen').style.display='block';logout.style.display='block'}else{sideUser.innerHTML='<strong>مرحبًا 👋</strong><span>سجّل دخولك للوصول لحسابك.</span>';loginOpen.style.display='block';if(profileOpen)profileOpen.style.display='none';if(document.getElementById('mzStoreOpen'))document.getElementById('mzStoreOpen').style.display='none';if(document.getElementById('mzTasksOpen'))document.getElementById('mzTasksOpen').style.display='none';logout.style.display='none';mzProfileUserData=null;applyTheme(localStorage.getItem('mangaZERO_theme')||'dark')}}
  window.mzGetCurrentUser=()=>window.currentUser||null;updateUser(auth.currentUser||null);updateAdminVisibility();
  loadMangaFromCloud();
  startMangaCloudListener();
})();
})();

/* ===== inline script 4 of 6 | original line 6174 | <script > ===== */
(function(){ /* sloppy-mode wrapper: see note above */
/* Motion disabled: keeps login/account controls responsive. */
})();

/* ===== inline script 5 of 6 | original line 6183 | <script > ===== */
(function(){ /* sloppy-mode wrapper: see note above */
(function(){
  function closeMangaZeroProfile(){
    try{window.mzProfileManualClose=true;}catch(e){}
    var page=document.getElementById('mzProfilePage');
    if(!page)return;
    page.classList.remove('mz-motion-open','is-open');
    page.classList.add('is-closed');
    page.style.setProperty('display','none','important');
    page.style.removeProperty('opacity');
    page.style.removeProperty('transform');
    document.body.style.overflow='';
  }
  function bindProfileClose(){
    var btn=document.getElementById('mzProfileClose');
    if(btn&&!btn.__mzCloseBound){
      btn.__mzCloseBound=true;
      btn.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();closeMangaZeroProfile();},true);
    }
  }
  function bind(){
    bindProfileClose();
    document.addEventListener('click',function(e){
      var t=e.target;
      if(t&&t.closest&&t.closest('#mzProfileClose')){e.preventDefault();e.stopPropagation();closeMangaZeroProfile();}
    },true);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind);else bind();
  window.mzCloseProfile=closeMangaZeroProfile;
})();
})();

/* ===== inline script 6 of 6 | original line 6226 | <script id="MZ_TASKS_STORE_APP"> ===== */
(function(){ /* sloppy-mode wrapper: see note above */
(function(){
  'use strict';
  const TASKS_COL='mangaZERO_tasks', POINTS_COL='mangaZERO_user_points', PROGRESS_COL='mangaZERO_task_progress', TX_COL='mangaZERO_points_transactions', STORE_COL='mangaZERO_store', PURCHASE_COL='mangaZERO_purchases';
  const dailyDefs=[
    {key:'read3',icon:'📖',title:'اقرأ 3 فصول اليوم',desc:'افتح 3 فصول مختلفة اليوم.',target:3,reward:5,event:'read'},
    {key:'comment3',icon:'💬',title:'اكتب 3 تعليقات اليوم',desc:'اكتب 3 تعليقات في الموقع اليوم.',target:3,reward:5,event:'comment'}
  ];
  let pointsUnsub=null, tasksUnsub=null, storeUnsub=null, currentPoints=0, currentDaily=null, dailyDate='';
  const $=id=>document.getElementById(id);
  function user(){return window.currentUser||((window.firebase&&firebase.auth&&firebase.auth().currentUser)||null)}
  function admin(){return !!user() && String(user().email||'').toLowerCase()==='maxking1789@gmail.com'}
  function dayKey(){const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
  function taskProgressId(){return String(user().uid)+'__daily__'+String(dailyDate)}
  function showTaskToast(msg){if(typeof window.showToast==='function')window.showToast(msg);else alert(msg)}
  function setPoints(n){currentPoints=Number(n||0);['mzTasksPoints','mzStorePoints'].forEach(id=>{const e=$(id);if(e)e.textContent=currentPoints.toLocaleString('en-US')});['mzTasksHeadPoints','mzStoreHeadPoints'].forEach(id=>{const e=$(id);if(e){const b=e.querySelector('b');if(b)b.textContent=currentPoints.toLocaleString('en-US')}})}
  function closePages(){['mzTasksPage','mzStorePage'].forEach(id=>{const e=$(id);if(e){e.classList.remove('open');e.setAttribute('aria-hidden','true');e.style.display='none';}});document.body.style.overflow='';}
  async function openStore(){if(!user()){showTaskToast('سجل دخولك الأول عشان تفتح المتجر');return}if(typeof closeSide==='function')closeSide();const page=$('mzStorePage');if(!page)return;page.classList.add('open');page.setAttribute('aria-hidden','false');page.style.display='block';document.body.style.overflow='hidden';await loadPoints();await loadStore();}
  function openTasksPage(){return openTasks();}
  async function ensurePointsDoc(){const u=user();if(!u||!window.mzFirestore)return null;const ref=window.mzFirestore.collection(POINTS_COL).doc(u.uid);const snap=await ref.get();if(!snap.exists && admin())await ref.set({uid:u.uid,points:0,totalEarned:0,totalSpent:0,updatedAt:Date.now()},{merge:true});return ref}
  async function loadPoints(){const u=user();if(!u||!window.mzFirestore){setPoints(0);return}try{const ref=window.mzFirestore.collection(POINTS_COL).doc(u.uid);const snap=await ref.get();setPoints(snap.exists?(snap.data().points||0):0);if(pointsUnsub)pointsUnsub();pointsUnsub=ref.onSnapshot(s=>setPoints(s.exists?(s.data().points||0):0));}catch(e){console.warn('points load',e)}}
  async function loadDaily(){const u=user();if(!u||!window.mzFirestore)return;dailyDate=dayKey();const ref=window.mzFirestore.collection(PROGRESS_COL).doc(taskProgressId());try{const s=await ref.get();currentDaily=s.exists?(s.data()||{}):{uid:u.uid,dateKey:dailyDate,readCount:0,commentCount:0,readRewarded:false,commentRewarded:false};renderDaily()}catch(e){console.warn('daily load',e);renderDaily()}}
  function renderDaily(){const box=$('mzDailyTasksList');if(!box)return;const d=currentDaily||{};box.innerHTML=dailyDefs.map(t=>{const count=Math.min(Number(d[t.key==='read3'?'readCount':'commentCount']||0),t.target);const done=!!d[t.key==='read3'?'readRewarded':'commentRewarded'];return '<div class="mz-task-card"><div class="mz-task-icon">'+t.icon+'</div><div class="mz-task-main"><div class="mz-task-title">'+t.title+'</div><div class="mz-task-desc">'+t.desc+'</div><div class="mz-task-progress"><i style="width:'+Math.round(count/t.target*100)+'%"></i></div><div class="mz-task-count">'+count+' / '+t.target+(done?' • مكتملة ✅':'')+'</div></div><div class="'+(done?'mz-task-done':'mz-task-reward')+'">'+(done?'تمت':'+'+t.reward+' نقطة')+'</div></div>'}).join('')}
  async function awardDailyEvent(event,eventId){
    const u=user();
    if(!u||!window.mzFirestore){console.warn('MZ task: user/firestore not ready',!!u,!!window.mzFirestore);return;}
    if(event!=='read'&&event!=='comment')return;

    // مهمة الأدمن/الموقع مستقلة تمامًا عن المهمة اليومية.
    // نبدأ بها قبل المهمة اليومية حتى لا يمنع permission-denied في مسار آخر تسجيلها.
    const customTaskPromise=updateCustomTasks(event,eventId).catch(function(customErr){
      console.error('MZ custom tasks update failed (independent):',customErr);
      return false;
    });

    const date=dayKey();
    dailyDate=date;
    const dailyId=String(u.uid)+'__daily__'+date;
    const dailyRef=window.mzFirestore.collection(PROGRESS_COL).doc(dailyId);
    const pointsRef=window.mzFirestore.collection(POINTS_COL).doc(String(u.uid));
    const txRef=window.mzFirestore.collection(TX_COL).doc();
    try{
      let completed=false;
      await window.mzFirestore.runTransaction(async tx=>{
        const ds=await tx.get(dailyRef);
        const pts=await tx.get(pointsRef);
        const d=ds.exists?(ds.data()||{}):{
          uid:u.uid,dateKey:date,readCount:0,commentCount:0,
          readRewarded:false,commentRewarded:false,seenRead:{},seenComment:{}
        };
        d.uid=u.uid;
        d.dateKey=date;
        d.seenRead=d.seenRead||{};
        d.seenComment=d.seenComment||{};
        let reward=0,key='';
        const k=String(eventId||Date.now()+'_'+Math.random());
        if(event==='read'&&!d.readRewarded&&!d.seenRead[k]){
          d.seenRead[k]=true;
          d.readCount=Math.min(3,Number(d.readCount||0)+1);
          if(d.readCount>=3){d.readRewarded=true;reward=5;key='read3';completed=true;}
        }
        if(event==='comment'&&!d.commentRewarded&&!d.seenComment[k]){
          d.seenComment[k]=true;
          d.commentCount=Math.min(3,Number(d.commentCount||0)+1);
          if(d.commentCount>=3){d.commentRewarded=true;reward=5;key='comment3';completed=true;}
        }
        tx.set(dailyRef,d,{merge:true});
        if(reward>0){
          const p=pts.exists?(pts.data()||{}):{uid:u.uid,points:0,totalEarned:0,totalSpent:0};
          tx.set(pointsRef,{uid:u.uid,points:Number(p.points||0)+reward,totalEarned:Number(p.totalEarned||0)+reward,totalSpent:Number(p.totalSpent||0),updatedAt:Date.now()},{merge:true});
          tx.set(txRef,{uid:u.uid,type:'task_reward',taskKey:key,amount:reward,dateKey:date,createdAt:Date.now()},{merge:true});
        }
      });
      currentDaily=currentDaily||{uid:u.uid,dateKey:date,readCount:0,commentCount:0,readRewarded:false,commentRewarded:false};
      if(event==='read')currentDaily.readCount=Math.min(3,Number(currentDaily.readCount||0)+1);
      if(event==='comment')currentDaily.commentCount=Math.min(3,Number(currentDaily.commentCount||0)+1);
      renderDaily();
      await loadDaily();
      if(completed)showTaskToast('🎉 أحسنت! أنجزت المهمة اليومية +5 نقطة');
      // ننتظر انتهاء مسار مهام الموقع، لكنه لا يعتمد على نجاح المهمة اليومية.
      await customTaskPromise;
      await loadSiteTasks();
    }catch(e){
      // حتى لو فشلت المهمة اليومية، مهمة الأدمن/الموقع تكون قد بدأت بالفعل.
      await customTaskPromise;
      console.error('MZ daily task update failed:',e);
      // لا نعرض خطأ داخلي للمستخدم؛ تفاصيل Firebase موجودة في Console.
      console.warn('تعذر تسجيل المهمة اليومية:', e&&e.code, e&&e.message);
    }
  }
  async function updateCustomTasks(event,eventId){
    const u=user();
    if(!u||!window.mzFirestore)return false;
    if(event!=='read'&&event!=='comment')return false;
    try{
      // اقرأ المهام النشطة فقط. كل مستخدم له تقدم مستقل: UID_TASKID.
      const snap=await window.mzFirestore.collection(TASKS_COL).where('active','==',true).get();
      const jobs=[];
      snap.forEach(d=>{
        const t=Object.assign({id:d.id},d.data()||{});
        if((event==='read'&&String(t.taskType)==='chapters')||(event==='comment'&&String(t.taskType)==='comments'))jobs.push(t);
      });

      for(const t of jobs){
        const taskId=String(t.id);
        const ref=window.mzFirestore.collection(PROGRESS_COL).doc(String(u.uid)+'__task__'+taskId);
        const target=Math.max(1,Number(t.targetCount||1));
        const key=String(eventId||Date.now()+'_'+Math.random());
        const seenField=event==='read'?'seenRead':'seenComment';
        let completedNow=false;
        let reward=0;

        // مهم: لا نضع قراءة/تحديث النقاط داخل نفس transaction الخاصة بالتقدم.
        // بهذا لا يؤدي permission-denied في points إلى إلغاء تقدم المهمة نفسه.
        try{
          await window.mzFirestore.runTransaction(async tx=>{
            const ps=await tx.get(ref);
            const d=ps.exists?(ps.data()||{}):{
              uid:u.uid,
              taskId:taskId,
              count:0,
              targetCount:target,
              completed:false,
              seenRead:{},
              seenComment:{}
            };
            if(String(d.uid||'')!==String(u.uid))throw new Error('invalid task progress owner');
            if(d.completed===true)return;

            d[seenField]=d[seenField]||{};
            if(d[seenField][key])return;

            const oldCount=Math.max(0,Number(d.count||0));
            const newCount=Math.min(target,oldCount+1);
            completedNow=newCount>=target;
            reward=completedNow?Math.max(0,Number(t.points||0)):0;
            d[seenField][key]=true;

            tx.set(ref,{
              uid:u.uid,
              taskId:taskId,
              count:newCount,
              targetCount:target,
              completed:completedNow,
              seenRead:d.seenRead||{},
              seenComment:d.seenComment||{},
              updatedAt:Date.now()
            },{merge:true});
          });
        }catch(progressErr){
          console.error('MZ custom task progress failed:',{
            taskId:taskId,
            title:t.title,
            event:event,
            code:progressErr&&progressErr.code,
            message:progressErr&&progressErr.message
          },progressErr);
          continue;
        }

        // إذا اكتملت المهمة الآن، حاول إضافة المكافأة بشكل مستقل.
        // فشل المكافأة لا يمسح تقدم المهمة.
        if(completedNow&&reward>0){
          try{
            const pointsRef=window.mzFirestore.collection(POINTS_COL).doc(String(u.uid));
            const txRef=window.mzFirestore.collection(TX_COL).doc();
            await window.mzFirestore.runTransaction(async tx=>{
              const pts=await tx.get(pointsRef);
              const p=pts.exists?(pts.data()||{}):{uid:u.uid,points:0,totalEarned:0,totalSpent:0};
              tx.set(pointsRef,{
                uid:u.uid,
                points:Number(p.points||0)+reward,
                totalEarned:Number(p.totalEarned||0)+reward,
                totalSpent:Number(p.totalSpent||0),
                updatedAt:Date.now()
              },{merge:true});
              tx.set(txRef,{
                uid:u.uid,
                type:'site_task_reward',
                taskId:taskId,
                amount:reward,
                createdAt:Date.now()
              },{merge:true});
            });
            showTaskToast('🎉 أحسنت! أنجزت مهمة الموقع +'+reward+' نقطة');
          }catch(rewardErr){
            console.error('MZ custom task reward failed:',{
              taskId:taskId,
              title:t.title,
              code:rewardErr&&rewardErr.code,
              message:rewardErr&&rewardErr.message
            },rewardErr);
          }
        }
      }
      await loadSiteTasks();
      return true;
    }catch(e){
      console.error('MZ custom tasks load failed:',e);
      return false;
    }
  }
  window.mzCustomTaskEvent=updateCustomTasks;
  window.mzTaskEvent=awardDailyEvent;
  function renderSiteTasks(arr){
    const box=$('mzSiteTasksList');if(!box)return;
    if(!arr.length){box.innerHTML='<div class="mz-empty-box">لا توجد مهام موقع متاحة حاليًا.</div>';return}
    const u=user();
    const tasks=arr.filter(t=>t.active!==false);
    if(!u){box.innerHTML='<div class="mz-empty-box">سجل دخولك أولًا.</div>';return}
    Promise.all(tasks.map(async t=>{
      try{const id=String(u.uid)+'__task__'+String(t.id);const ps=await window.mzFirestore.collection(PROGRESS_COL).doc(id).get();return [t,ps.exists?(ps.data()||{}):{}]}catch(e){return [t,{}]}
    })).then(rows=>{
      box.innerHTML=rows.map(([t,p])=>{
        const target=Math.max(1,Number(t.targetCount||t.target||1));
        const count=Math.min(target,Number(p.count||0));
        const done=p.completed===true || count>=target;
        const type=t.taskType==='comments'?'💬 تعليقات':'📖 فصول';
        const width=Math.min(100,Math.round(count/target*100));
        return '<div class="mz-task-card"><div class="mz-task-icon">'+(t.taskType==='comments'?'💬':'📖')+'</div><div class="mz-task-main"><div class="mz-task-title">'+safe(t.title)+'</div><div class="mz-task-desc">'+type+' • المطلوب: '+target+' • المكافأة: '+Number(t.points||0)+' نقطة</div><div class="mz-task-progress"><i style="width:'+width+'%"></i></div><div class="mz-task-count">'+count+' / '+target+(done?' • مكتملة ✅':'')+'</div></div><div class="'+(done?'mz-task-done':'mz-task-reward')+'">'+(done?'تمت':'+'+Number(t.points||0)+' نقطة')+'</div></div>'
      }).join('')||'<div class="mz-empty-box">لا توجد مهام موقع متاحة حاليًا.</div>';
    });
  }
  function safe(v){return String(v==null?'':v).replace(/[&<>'"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[m]))}
  async function loadSiteTasks(){if(!window.mzFirestore)return;try{const s=await window.mzFirestore.collection(TASKS_COL).where('active','==',true).get();const a=[];s.forEach(d=>a.push(Object.assign({id:d.id},d.data()||{})));renderSiteTasks(a)}catch(e){console.warn('site tasks',e);renderSiteTasks([])}}
  async function completeSiteTask(){showTaskToast('المهام دي بتتحسب تلقائيًا عند إنجازها، مش بزر أنجزت المهمة.');await loadSiteTasks()}
  async function openTasks(){if(!user()){showTaskToast('سجل دخولك الأول عشان تفتح المهام');return}if(typeof closeSide==='function')closeSide();const page=$('mzTasksPage');if(!page)return;page.classList.add('open');page.setAttribute('aria-hidden','false');page.style.display='block';document.body.style.overflow='hidden';dailyDate=dayKey();await loadPoints();await loadDaily();await loadSiteTasks()}
  /* الخلفيات العادية فقط تدخل المتجر. خلفيات الأدمن لا تُباع ولا تُزرع في المتجر. */
  const MZ_DEFAULT_PROFILE_BACKGROUNDS=[
    {id:'profile_bg_aurora',name:'🌌 شفق قطبي',description:'خلفية متوهجة بألوان الشفق.',type:'profile_background',points:2500,bgClass:'bg_aurora',animated:true,adminOnly:false},
    {id:'profile_bg_sakura',name:'🌸 ساكورا',description:'خلفية وردية هادئة ومتوهجة.',type:'profile_background',points:2500,bgClass:'bg_sakura',animated:true,adminOnly:false},
    {id:'profile_bg_void',name:'🖤 الفراغ',description:'خلفية داكنة بطابع غامض.',type:'profile_background',points:2500,bgClass:'bg_void',animated:true,adminOnly:false},
    {id:'profile_bg_neon',name:'⚡ نيون',description:'خلفية نيون متحركة.',type:'profile_background',points:3500,bgClass:'bg_neon',animated:true,adminOnly:false},
    {id:'profile_bg_cosmic',name:'🌠 كوني',description:'خلفية فضائية متحركة.',type:'profile_background',points:3500,bgClass:'bg_cosmic',animated:true,adminOnly:false}
  ];
  const MZ_ADMIN_PROFILE_BACKGROUNDS=[
    {id:'profile_bg_admin',name:'👑 العرش الأسطوري — ADMIN',description:'خلفية الأدمن الدائمة.',type:'profile_background',points:0,bgClass:'bg_admin',animated:true,adminOnly:true},
    {id:'profile_bg_admin_gold',name:'👑 العرش الذهبي — ADMIN',description:'خلفية ذهبية للأدمن.',type:'profile_background',points:0,bgClass:'bg_admin_gold',animated:true,adminOnly:true},
    {id:'profile_bg_admin_void',name:'👑 العرش المظلم — ADMIN',description:'خلفية مظلمة للأدمن.',type:'profile_background',points:0,bgClass:'bg_admin_void',animated:true,adminOnly:true}
  ];
  const MZ_STORE_PREVIEW_CLASSES={bg_aurora:'mz-bg-aurora',bg_neon:'mz-bg-neon',bg_sakura:'mz-bg-sakura',bg_cosmic:'mz-bg-cosmic',bg_void:'mz-bg-void',bg_admin:'mz-bg-admin',bg_admin_gold:'mz-bg-admin-gold',bg_admin_void:'mz-bg-admin-void'};
  function storePreviewClass(bgClass){return MZ_STORE_PREVIEW_CLASSES[String(bgClass||'')]||'';}
  async function seedDefaultProfileBackgrounds(){const u=user();if(!u||!admin()||!window.mzFirestore)return false;try{const ref=window.mzFirestore.collection(STORE_COL);const batch=window.mzFirestore.batch();for(const p of MZ_DEFAULT_PROFILE_BACKGROUNDS){const data=Object.assign({},p,{active:true,adminOnly:false});delete data.id;batch.set(ref.doc(p.id),data,{merge:true});}for(const p of MZ_ADMIN_PROFILE_BACKGROUNDS){const data=Object.assign({},p,{active:true,adminOnly:true,points:0});delete data.id;batch.set(ref.doc(p.id),data,{merge:true});}await batch.commit();console.log('MangaZERO: default profile backgrounds synced:',MZ_DEFAULT_PROFILE_BACKGROUNDS.length,'store +',MZ_ADMIN_PROFILE_BACKGROUNDS.length,'admin-only');return true}catch(e){console.error('MangaZERO: seed profile backgrounds failed:',e);return false}}
  async function loadStore(){const box=$('mzStoreProducts');if(!box||!window.mzFirestore)return;try{await seedDefaultProfileBackgrounds();let s=await window.mzFirestore.collection(STORE_COL).where('active','==',true).get();let a=[];s.forEach(d=>{const p=Object.assign({id:d.id},d.data()||{});if(p.adminOnly)return;a.push(p)});if(!a.length&&admin()){await seedDefaultProfileBackgrounds();s=await window.mzFirestore.collection(STORE_COL).where('active','==',true).get();a=[];s.forEach(d=>{const p=Object.assign({id:d.id},d.data()||{});if(p.adminOnly)return;a.push(p)});}if(!a.length){box.innerHTML='<div class="mz-empty-box">لا توجد منتجات متاحة حاليًا.</div>';return}
    let owned=new Set();const u=user();if(u){try{const ps=await window.mzFirestore.collection(PURCHASE_COL).where('uid','==',String(u.uid)).get();ps.forEach(d=>{const x=d.data()||{};if(x.productId)owned.add(String(x.productId));});}catch(e){}}
    const activeBgId=await (async()=>{try{if(!u)return '';const us=await window.mzFirestore.collection('mangaZERO_users').doc(String(u.uid)).get();return us.exists?String((us.data()||{}).activeProfileBackgroundId||''):''}catch(e){return ''}})();
    box.innerHTML='<div class="mz-store-grid">'+a.map(p=>{const bg=p.type==='profile_background';const own=owned.has(String(p.id));const active=bg&&activeBgId===String(p.id);let action='';if(bg){if(active)action='<button type="button" class="mz-buy-btn mz-buy-btn-active" disabled>✓ مفعلة</button>';else if(own)action='<button type="button" class="mz-buy-btn" data-activate-bg="'+safe(p.id)+'">تفعيل الخلفية</button>';else action='<button type="button" class="mz-buy-btn" data-buy-product="'+safe(p.id)+'">شراء الخلفية</button>';}else action='<button type="button" class="mz-buy-btn" data-buy-product="'+safe(p.id)+'">شراء</button>';const previewCls=bg?storePreviewClass(p.bgClass):'';const visual=bg?'<div class="mz-bg-preview"><div class="mz-profile-bg-layer '+safe(previewCls)+'"></div><div class="mz-bg-preview-label">'+safe(p.name)+'<\/div><\/div>':('<div class="mz-product-image '+(p.bgClass||'')+'">'+(p.image?'<img src="'+safe(p.image)+'" alt="">':'🛍️')+'</div>');return '<div class="mz-product-card" data-product-card="'+safe(p.id)+'">'+visual+'<div class="mz-product-body"><div class="mz-product-name">'+safe(p.name)+'</div><div class="mz-product-desc">'+safe(p.description||'')+'</div><div class="mz-product-foot"><span class="mz-product-price">'+Number(p.points||0)+' 🪙</span>'+action+'</div><div class="mz-store-status" data-store-status="'+safe(p.id)+'" aria-live="polite"></div></div></div>'}).join('')+'</div>'
  document.querySelectorAll('#mzStoreProducts [data-buy-product]').forEach(btn=>{btn.onclick=function(ev){ev.preventDefault();ev.stopPropagation();buyProduct(this.getAttribute('data-buy-product'),this);};});document.querySelectorAll('#mzStoreProducts [data-activate-bg]').forEach(btn=>{btn.onclick=function(ev){ev.preventDefault();ev.stopPropagation();activateStoreBackground(this.getAttribute('data-activate-bg'),this);};});
  }catch(e){console.warn('store load',e);box.innerHTML='<div class="mz-empty-box">تعذر تحميل المتجر حاليًا.</div>'}}
  async function buyProduct(id,button){const u=user();if(!u||!window.mzFirestore)return;try{const pr=window.mzFirestore.collection(STORE_COL).doc(String(id)),ur=window.mzFirestore.collection(POINTS_COL).doc(u.uid),purQuery=window.mzFirestore.collection(PURCHASE_COL).where('uid','==',String(u.uid)).where('productId','==',String(id)).limit(1);const existing=await purQuery.get();if(!existing.empty)throw new Error('ALREADY_OWNED');const firstPoints=await ur.get();if(!firstPoints.exists){await ur.set({uid:u.uid,points:0,totalEarned:0,totalSpent:0,updatedAt:firebase.firestore.FieldValue.serverTimestamp()},{merge:false});}const pur=window.mzFirestore.collection(PURCHASE_COL).doc(),tx=window.mzFirestore.collection(TX_COL).doc();await window.mzFirestore.runTransaction(async t=>{const [ps,us]=await Promise.all([t.get(pr),t.get(ur)]);if(!ps.exists||ps.data().active!==true)throw new Error('PRODUCT');const product=ps.data(),pts=us.exists?(us.data()||{}):{points:0,totalEarned:0,totalSpent:0};if(product.adminOnly)throw new Error('ADMIN_ONLY');if(product.type!=='profile_background')throw new Error('PRODUCT');const price=Number(product.points||0);if(!Number.isFinite(price)||price<=0)throw new Error('PRICE');if(Number(pts.points||0)<price)throw new Error('POINTS');t.set(ur,{uid:u.uid,points:Number(pts.points||0)-price,totalEarned:Number(pts.totalEarned||0),totalSpent:Number(pts.totalSpent||0)+price,updatedAt:firebase.firestore.FieldValue.serverTimestamp()},{merge:true});t.set(pur,{uid:u.uid,productId:String(id),productName:product.name||'',points:price,status:'completed',createdAt:firebase.firestore.FieldValue.serverTimestamp()});t.set(tx,{uid:u.uid,type:'purchase',productId:String(id),amount:-price,createdAt:firebase.firestore.FieldValue.serverTimestamp()})});showTaskToast('✅ تمت عملية الشراء بنجاح — يمكنك الآن تفعيل الخلفية');await loadPoints();await loadStore()}catch(e){console.error('buyProduct',e);const msg=e&&e.message==='POINTS'?'رصيدك غير كافي':e&&e.message==='ALREADY_OWNED'?'أنت تملك هذه الخلفية بالفعل — فعّلها من الزر':e&&e.message==='ADMIN_ONLY'?'الخلفية دي للأدمن وموجودة مجانًا داخل الملف الشخصي':e&&e.code==='permission-denied'?'صلاحيات Firestore تمنع الشراء — استخدم الـRules المرفقة':e&&e.message==='PRODUCT'?'المنتج غير متاح حاليًا':'تعذر إتمام الشراء: '+(e&&e.code||e&&e.message||'خطأ');if(button){const card=button.closest('[data-product-card]');const st=card&&card.querySelector('[data-store-status]');if(st){st.textContent='❌ '+msg;st.style.color='#ff8b9f';}button.disabled=false;}showTaskToast(msg)}}
  async function activateStoreBackground(id,button){const u=user();if(!u||!window.mzFirestore)return;try{const ps=await window.mzFirestore.collection(STORE_COL).doc(String(id)).get();if(!ps.exists||ps.data().active!==true||ps.data().type!=='profile_background')throw new Error('BG');const bg=Object.assign({id:String(id)},ps.data()||{});if(bg.adminOnly)throw new Error('ADMIN_ONLY');const pur=await window.mzFirestore.collection(PURCHASE_COL).where('uid','==',String(u.uid)).where('productId','==',String(id)).limit(1).get();if(pur.empty)throw new Error('OWN');const data={activeProfileBackgroundId:String(id),updatedAt:firebase.firestore.FieldValue.serverTimestamp()};await window.mzFirestore.collection('mangaZERO_users').doc(String(u.uid)).set(data,{merge:true});await window.mzFirestore.collection('mangaZERO_public_profiles').doc(String(u.uid)).set(data,{merge:true});if(button){button.disabled=true;button.textContent='✓ مفعلة';button.classList.add('mz-buy-btn-active');const card=button.closest('[data-product-card]');const st=card&&card.querySelector('[data-store-status]');if(st){st.textContent='✓ تم تفعيل الخلفية بنجاح';st.style.color='#bfffc8';}}showTaskToast('✨ تم تفعيل الخلفية بنجاح — وكل الناس هتشوفها في بروفايلك');await loadStore();}catch(e){console.error('activateStoreBackground',e);const msg=e&&e.message==='ADMIN_ONLY'?'خلفيات الأدمن موجودة داخل الملف الشخصي ولا تُباع':e&&e.message==='OWN'?'لازم تشتري الخلفية الأول':e&&e.code==='permission-denied'?'صلاحيات Firestore تمنع التفعيل — راجع القواعد':'تعذر تفعيل الخلفية: '+(e&&e.code||e&&e.message||'خطأ');if(button){const card=button.closest('[data-product-card]');const st=card&&card.querySelector('[data-store-status]');if(st){st.textContent='❌ '+msg;st.style.color='#ff8b9f';}button.disabled=false;button.textContent='تفعيل الخلفية';}showTaskToast(msg)}}
  window.mzBuyStoreProduct=buyProduct;window.mzActivateStoreBackground=activateStoreBackground;
  async function adminLoadTasks(){
    if(!admin()||!window.mzFirestore)return;const box=$('adminTaskList');if(!box)return;
    try{const snap=await window.mzFirestore.collection(TASKS_COL).get();const a=[];snap.forEach(d=>a.push(Object.assign({id:d.id},d.data()||{})));
      box.innerHTML=a.length?a.map(t=>{const type=t.taskType==='comments'?'💬 تعليقات':'📖 فصول';return '<div class="mz-admin-task-item"><div class="mz-admin-task-row"><b>'+safe(t.title)+'</b><span>'+type+' • '+Number(t.targetCount||1)+' • +'+Number(t.points||0)+' 🪙</span></div><div style="opacity:.7;font-size:12px;margin-top:4px">التقدم يُحسب تلقائيًا عند '+(t.taskType==='comments'?'كتابة التعليقات':'قراءة الفصول')+'</div><div class="mz-admin-mini-actions"><button class="mz-mini-toggle" data-toggle-task="'+safe(t.id)+'">'+(t.active!==false?'إيقاف':'تفعيل')+'</button><button class="mz-mini-delete" data-delete-task="'+safe(t.id)+'">حذف</button></div></div>'}).join(''):'<div class="admin-empty">لا توجد مهام موقع.</div>';
    }catch(e){console.warn(e)}
  }
  async function adminAddTask(){
    if(!admin()||!window.mzFirestore)return;
    const title=$('adminTaskTitle').value.trim(),taskType=$('adminTaskType').value,targetCount=Math.max(1,Number($('adminTaskTarget').value||1)),points=Math.max(1,Number($('adminTaskPoints').value||5));
    if(!title){showTaskToast('اكتب عنوان المهمة');return}
    await window.mzFirestore.collection(TASKS_COL).add({title,taskType,targetCount,points,active:true,createdAt:Date.now()});
    $('adminTaskTitle').value='';$('adminTaskTarget').value='3';$('adminTaskPoints').value='5';await adminLoadTasks();showTaskToast('تم نشر المهمة — والتقدم هيظهر تلقائيًا');
  }
  async function adminAddProduct(){if(!admin()||!window.mzFirestore)return;const name=$('adminProductName').value.trim(),description=$('adminProductDesc').value.trim(),points=Math.max(1,Number($('adminProductPoints').value||0)),image=$('adminProductImage').value.trim();if(!name||!points){showTaskToast('اكتب اسم المنتج والسعر');return}await window.mzFirestore.collection(STORE_COL).add({name,description,points,image,active:true,createdAt:Date.now()});$('adminProductName').value='';$('adminProductDesc').value='';$('adminProductPoints').value='';$('adminProductImage').value='';await adminLoadProducts();showTaskToast('تمت إضافة المنتج')}
  let adminPointsUsers=[];
  let adminSelectedPointsUser=null;
  let adminGivePointsBusy=false;

  // لم نعد نحمل كل المستخدمين. يتم البحث عن صاحب الإيميل مباشرة من Firestore.
  async function adminLoadPointsUsers(){
    adminPointsUsers=[];
    adminSelectedPointsUser=null;
  }

  async function adminGivePoints(){
    if(adminGivePointsBusy)return;
    if(!admin()||!window.mzFirestore){showTaskToast('لازم تكون داخل حساب الأدمن.');return}
    const emailInput=$('adminPointsManualEmail');
    const pointsInput=$('adminPointsAmount');
    const status=$('adminPointsManualStatus');
    const btn=$('adminGivePoints');
    const email=String(emailInput&&emailInput.value||'').trim().toLowerCase();
    const raw=String(pointsInput&&pointsInput.value||'').trim();
    if(!email||!email.includes('@')){
      if(status){status.style.display='block';status.style.color='#ffb4b4';status.textContent='❌ اكتب إيميل صحيح.';}
      return;
    }
    if(!/^\d+$/.test(raw)){
      if(status){status.style.display='block';status.style.color='#ffb4b4';status.textContent='❌ اكتب عدد نقاط صحيح.';}
      return;
    }
    const amount=parseInt(raw,10);
    if(!Number.isSafeInteger(amount)||amount<1||amount>1000000){
      if(status){status.style.display='block';status.style.color='#ffb4b4';status.textContent='❌ عدد النقاط يجب أن يكون من 1 إلى 1,000,000.';}
      return;
    }
    adminGivePointsBusy=true;if(btn)btn.disabled=true;
    if(status){status.style.display='block';status.style.color='';status.textContent='🔎 جاري العثور على صاحب الإيميل...';}
    try{
      const snap=await window.mzFirestore.collection('mangaZERO_users').where('email','==',email).limit(1).get();
      if(snap.empty){
        if(status){status.style.color='#ffb4b4';status.textContent='❌ لا يوجد حساب مسجل بهذا الإيميل.';}
        return;
      }
      const d=snap.docs[0];
      const u=Object.assign({uid:d.id},d.data()||{});
      const ref=window.mzFirestore.collection(POINTS_COL).doc(String(u.uid));
      const txRef=window.mzFirestore.collection(TX_COL).doc();
      await window.mzFirestore.runTransaction(async tx=>{
        const snapPoints=await tx.get(ref);
        const p=snapPoints.exists?(snapPoints.data()||{}):{};
        const oldPoints=Number(p.points||0),oldEarned=Number(p.totalEarned||0),oldSpent=Number(p.totalSpent||0);
        tx.set(ref,{uid:String(u.uid),points:oldPoints+amount,totalEarned:oldEarned+amount,totalSpent:oldSpent,updatedAt:Date.now()},{merge:true});
        tx.set(txRef,{uid:String(u.uid),type:'admin_manual_reward',amount:amount,adminUid:user().uid,adminEmail:user().email||'',createdAt:Date.now()});
      });
      const name=u.username||u.name||u.displayName||'المستخدم';
      showTaskToast('💰 تم إضافة '+amount.toLocaleString('en-US')+' نقطة إلى '+name);
      if(status){status.style.color='#bfffc8';status.textContent='✅ تم إرسال '+amount.toLocaleString('en-US')+' نقطة إلى '+email;}
      if(pointsInput)pointsInput.value='';
    }catch(e){
      console.error('admin give points by email:',e);
      if(status){status.style.color='#ffb4b4';status.textContent='❌ تعذر إرسال النقاط: '+safe(e&&e.code||e&&e.message||'خطأ غير معروف');}
    }finally{
      adminGivePointsBusy=false;if(btn)btn.disabled=false;
    }
  }
  async function refreshAdminTasksStore(){await adminLoadTasks();await adminLoadProducts();await adminLoadPointsUsers()}
  document.addEventListener('click',e=>{const t=e.target.closest&&e.target.closest('[data-site-task],[data-toggle-task],[data-delete-task],[data-toggle-product],[data-delete-product]');if(!t)return;if(t.dataset.siteTask)completeSiteTask(t.dataset.siteTask);else if(t.dataset.toggleTask)window.mzFirestore.collection(TASKS_COL).doc(t.dataset.toggleTask).get().then(s=>window.mzFirestore.collection(TASKS_COL).doc(t.dataset.toggleTask).update({active:s.data().active===false})).then(refreshAdminTasksStore);else if(t.dataset.deleteTask)window.mzFirestore.collection(TASKS_COL).doc(t.dataset.deleteTask).delete().then(refreshAdminTasksStore);else if(t.dataset.toggleProduct)window.mzFirestore.collection(STORE_COL).doc(t.dataset.toggleProduct).get().then(s=>window.mzFirestore.collection(STORE_COL).doc(t.dataset.toggleProduct).update({active:s.data().active===false})).then(refreshAdminTasksStore);else if(t.dataset.deleteProduct)window.mzFirestore.collection(STORE_COL).doc(t.dataset.deleteProduct).delete().then(refreshAdminTasksStore)});
  $('mzTasksOpen')?.addEventListener('click',openTasks);$('mzStoreOpen')?.addEventListener('click',openStore);$('mzTasksBack')?.addEventListener('click',closePages);$('mzStoreBack')?.addEventListener('click',closePages);
  document.addEventListener('click',function(e){const b=e.target&&e.target.closest?e.target.closest('#mzTasksBack,#mzStoreBack'):null;if(b){e.preventDefault();e.stopPropagation();closePages();}},true);$('adminTaskAdd')?.addEventListener('click',adminAddTask);$('adminProductAdd')?.addEventListener('click',adminAddProduct);$('adminGivePoints')?.addEventListener('click',adminGivePoints);$('adminPointsManualEmail')?.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();adminGivePoints()}});
  window.mzRefreshTasksStore=refreshAdminTasksStore;
  // Reading is recorded directly inside openChapterReader(); no duplicate click hook.
  // Refresh task data when auth becomes available.
  // Comments call mzTaskEvent only after the comment is successfully saved.
  document.addEventListener('click',function(e){const b=e.target.closest&&e.target.closest('[data-admin-nav="tasks"]');if(b)setTimeout(refreshAdminTasksStore,50)});
  document.addEventListener('click',function(e){if(e.target.closest&&e.target.closest('#mzLogout'))closePages()});
  if(window.mzFirestore){}
})();
})();


/* ===== Zero AI (ai.js) — مدمج في آخر app.js ===== */
/* =========================================================
   MangaZERO  —  ai.js  (v3)
   1) أيقونة Zero AI متحركة بتعمل تعبيرات
      - ضغطة: بتفتح صفحة Zero AI
      - دوس طويل: قائمة (اسأل Zero AI / مانجا عشوائي / بحث)
      - نقرات ورا بعض: وش غضبان
      - نقرات كتير: بتكبر
   2) فلتر ذكاء اصطناعي إضافي على التعليقات
   المفتاح كله عند الـ Worker، مش هنا.
   ========================================================= */
(function () {
  "use strict";

  var AI_URL = "https://mangazero-ai.maxking1789.workers.dev";
  var AI_TIMEOUT = 12000;

  /* ================= أدوات ================= */

  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function toast(msg) {
    if (typeof window.showToast === "function") {
      try { window.showToast(msg); return; } catch (e) {}
    }
    var t = el("div", "mzai-toast", esc(msg));
    document.body.appendChild(t);
    setTimeout(function () { if (t.parentNode) t.remove(); }, 2800);
  }

  function buzz(ms) {
    try { if (navigator.vibrate) navigator.vibrate(ms); } catch (e) {}
  }

  // رد من الوركر. بيرجع أوبجيكت دايمًا، ومش بيرمي إيرور.
  function ask(message, mode, context) {
    var ctrl = null, timer = null;
    try { ctrl = new AbortController(); } catch (e) { ctrl = null; }

    var p = fetch(AI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: message, mode: mode || "chat", context: context || "" }),
      signal: ctrl ? ctrl.signal : undefined
    }).then(function (r) { return r.json(); });

    var timeout = new Promise(function (resolve) {
      timer = setTimeout(function () {
        if (ctrl) { try { ctrl.abort(); } catch (e) {} }
        resolve({ error: "timeout" });
      }, AI_TIMEOUT);
    });

    return Promise.race([p, timeout]).then(function (d) {
      clearTimeout(timer);
      return d || { error: "empty" };
    }).catch(function () {
      clearTimeout(timer);
      return { error: "network" };
    });
  }

  /* ================= الستايل ================= */

  var CSS = [
    /* ---------- الأيقونة ---------- */
    ".mzai-fab{position:fixed;left:18px;bottom:18px;z-index:9998;width:58px;height:58px;border-radius:50%;",
    "border:none;padding:0;cursor:pointer;background:linear-gradient(145deg,#a78bfa,#6d28d9);",
    "box-shadow:0 10px 26px rgba(109,40,217,.45);display:flex;align-items:center;justify-content:center;",
    "transition:transform .18s cubic-bezier(.34,1.56,.64,1),box-shadow .2s ease,background .25s ease;transform-origin:0 100%;",
    "-webkit-tap-highlight-color:transparent;touch-action:manipulation;overflow:hidden}",
    ".mzai-fab::after{content:'';position:absolute;inset:-6px;border-radius:50%;",
    "border:2px solid rgba(167,139,250,.5);opacity:0;animation:mzai-ring 3.4s ease-out infinite;pointer-events:none}",
    "@keyframes mzai-ring{0%{opacity:.55;transform:scale(.85)}55%{opacity:0;transform:scale(1.22)}100%{opacity:0;transform:scale(1.22)}}",
    ".mzai-fab.pop{animation:mzai-pop .32s cubic-bezier(.34,1.56,.64,1)}",
    "@keyframes mzai-pop{0%{transform:scale(1)}45%{transform:scale(1.22)}100%{transform:scale(1)}}",

    /* ---------- الوش ---------- */
    ".mzai-face{position:relative;width:calc(100% - 7px);height:calc(100% - 7px);border-radius:50%;",
    "background:linear-gradient(160deg,#f8f4ff,#d3c1ff);box-shadow:inset 0 -3px 8px rgba(80,30,140,.18);",
    "display:flex;align-items:center;justify-content:center;gap:7px;transition:background .3s ease}",
    ".mzai-fab.angry .mzai-face{background:radial-gradient(circle at 50% 35%,#ffd6d6,#ff8f8f);}",
    ".mzai-eye{position:relative;width:11px;height:13px;border-radius:6px;background:#2b1b4d;",
    "display:flex;align-items:center;justify-content:center;transition:all .18s ease;",
    "animation:mzai-blink 5.5s infinite}",
    ".mzai-eye.r{animation-delay:.07s}",
    ".mzai-eye i{position:absolute;top:2.5px;left:2.5px;width:4px;height:4px;border-radius:50%;background:#fff;opacity:.92}",
    "@keyframes mzai-blink{0%,93%,100%{transform:scaleY(1)}95%{transform:scaleY(.1)}97%{transform:scaleY(1)}}",
    ".mzai-brow{position:absolute;top:12px;width:11px;height:3px;border-radius:2px;background:#2b1b4d;",
    "opacity:0;transition:opacity .15s ease}",
    ".mzai-brow.l{left:11px;transform:rotate(22deg)}",
    ".mzai-brow.r{right:11px;transform:rotate(-22deg)}",
    ".mzai-mouth{position:absolute;bottom:12px;left:50%;transform:translateX(-50%);",
    "width:17px;height:7px;border-radius:0 0 17px 17px;background:#2b1b4d;transition:all .18s ease}",

    ".mzai-fab.happy .mzai-eye{animation:none;transform:scaleY(.45)}",
    ".mzai-fab.happy .mzai-mouth{width:21px;height:9px}",
    ".mzai-fab.wink .mzai-eye.l{animation:none;transform:scaleY(.12)}",
    ".mzai-fab.surprised .mzai-eye{animation:none;transform:scale(1.3)}",
    ".mzai-fab.surprised .mzai-mouth{width:9px;height:9px;border-radius:50%}",
    ".mzai-fab.angry .mzai-eye{animation:none;transform:scaleY(.5)}",
    ".mzai-fab.angry .mzai-brow{opacity:1}",
    ".mzai-fab.angry .mzai-mouth{width:15px;height:7px;border-radius:15px 15px 0 0;background:#2b1b4d}",
    ".mzai-fab.angry{animation:mzai-shake .38s ease}",
    "@keyframes mzai-shake{0%,100%{transform:translateX(0) rotate(0)}20%{transform:translateX(-4px) rotate(-5deg)}",
    "50%{transform:translateX(4px) rotate(5deg)}80%{transform:translateX(-3px) rotate(-3deg)}}",

    /* ---------- القائمة (دوس طويل) ---------- */
    ".mzai-menu{position:fixed;left:18px;bottom:86px;z-index:9999;display:none;flex-direction:column;gap:7px;",
    "width:min(240px,calc(100vw - 36px));direction:rtl;font-family:inherit}",
    ".mzai-menu.open{display:flex}",
    ".mzai-menu button{display:flex;align-items:center;gap:10px;padding:12px 14px;border-radius:14px;",
    "border:1px solid rgba(255,255,255,.12);background:linear-gradient(140deg,#251b36,#171021);color:#efe7ff;",
    "font-size:13.5px;font-family:inherit;cursor:pointer;text-align:right;",
    "box-shadow:0 10px 26px rgba(0,0,0,.45);opacity:0;transform:translateY(8px);",
    "animation:mzai-mi .26s ease forwards}",
    ".mzai-menu button:nth-child(1){animation-delay:.02s}",
    ".mzai-menu button:nth-child(2){animation-delay:.07s}",
    ".mzai-menu button:nth-child(3){animation-delay:.12s}",
    ".mzai-menu button:nth-child(4){animation-delay:.17s}",
    ".mzai-menu button:active{background:linear-gradient(140deg,#3a2a54,#221730)}",
    ".mzai-menu button b{font-weight:700;font-size:15px}",
    "@keyframes mzai-mi{to{opacity:1;transform:none}}",

    /* ---------- صفحة Zero AI ---------- */
    ".mzai-page{position:fixed;inset:0;z-index:10004;display:none;flex-direction:column;",
    "background:radial-gradient(circle at 50% 0%,rgba(126,65,170,.22),transparent 42%),#0a0710;",
    "direction:rtl;font-family:inherit}",
    ".mzai-page.open{display:flex;animation:mzai-in .22s ease}",
    "@keyframes mzai-in{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}",
    ".mzai-top{display:flex;align-items:center;gap:12px;padding:16px 16px 14px;",
    "border-bottom:1px solid rgba(255,255,255,.08);background:rgba(20,14,30,.75);backdrop-filter:blur(10px)}",
    ".mzai-top .mzai-ava{width:38px;height:38px;border-radius:50%;flex:0 0 auto;",
    "background:linear-gradient(145deg,#a78bfa,#6d28d9);display:flex;align-items:center;justify-content:center;",
    "font-size:18px;box-shadow:0 6px 16px rgba(109,40,217,.4)}",
    ".mzai-top b{color:#fff;font-size:16px;display:block}",
    ".mzai-top span{color:#a78bfa;font-size:11.5px}",
    ".mzai-x{margin-right:auto;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);",
    "color:#e6dcff;width:38px;height:38px;border-radius:12px;font-size:20px;line-height:1;cursor:pointer;",
    "display:flex;align-items:center;justify-content:center;font-family:inherit}",
    ".mzai-body{flex:1;overflow-y:auto;padding:18px 16px;display:flex;flex-direction:column;gap:12px}",
    ".mzai-msg{max-width:82%;padding:12px 15px;border-radius:16px;font-size:14px;line-height:1.75;",
    "white-space:pre-wrap;word-break:break-word;animation:mzai-m .2s ease}",
    "@keyframes mzai-m{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}",
    ".mzai-msg.bot{align-self:flex-start;background:#241a33;color:#ece4fa;border-bottom-right-radius:6px;",
    "border:1px solid rgba(255,255,255,.06)}",
    ".mzai-msg.me{align-self:flex-end;background:linear-gradient(140deg,#8b5cf6,#6d28d9);color:#fff;border-bottom-left-radius:6px}",
    ".mzai-typing{display:flex;gap:5px;align-items:center;padding:14px 16px}",
    ".mzai-typing i{width:7px;height:7px;border-radius:50%;background:#a78bfa;animation:mzai-b 1s infinite}",
    ".mzai-typing i:nth-child(2){animation-delay:.15s}.mzai-typing i:nth-child(3){animation-delay:.3s}",
    "@keyframes mzai-b{0%,60%,100%{opacity:.3;transform:translateY(0)}30%{opacity:1;transform:translateY(-4px)}}",
    ".mzai-chips{display:flex;gap:8px;overflow-x:auto;padding:0 16px 10px;flex:0 0 auto}",
    ".mzai-chips button{flex:0 0 auto;background:rgba(139,92,246,.14);border:1px solid rgba(139,92,246,.35);",
    "color:#d9c9ff;padding:9px 13px;border-radius:999px;font-size:12.5px;font-family:inherit;cursor:pointer}",
    ".mzai-chips button:active{background:rgba(139,92,246,.28)}",
    ".mzai-foot{display:flex;gap:9px;padding:12px 14px calc(14px + env(safe-area-inset-bottom));",
    "border-top:1px solid rgba(255,255,255,.08);background:rgba(13,10,20,.9)}",
    ".mzai-in{flex:1;background:#1b1526;border:1px solid rgba(255,255,255,.1);border-radius:14px;",
    "padding:13px 15px;color:#fff;font-size:14px;font-family:inherit;outline:none;min-width:0}",
    ".mzai-in:focus{border-color:#8b5cf6;box-shadow:0 0 0 3px rgba(139,92,246,.18)}",
    ".mzai-send{background:linear-gradient(140deg,#8b5cf6,#6d28d9);border:none;border-radius:14px;color:#fff;",
    "padding:0 20px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit}",
    ".mzai-send:disabled{opacity:.5;cursor:default}",

    ".mzai-toast{position:fixed;left:50%;bottom:26px;transform:translateX(-50%);z-index:100001;",
    "background:#241a33;color:#f3ecff;border:1px solid rgba(139,92,246,.4);padding:12px 18px;border-radius:12px;",
    "font-size:13px;box-shadow:0 10px 30px rgba(0,0,0,.5);direction:rtl;font-family:inherit}",

    "@media (prefers-reduced-motion:reduce){.mzai-fab::after,.mzai-eye,.mzai-page.open,.mzai-menu button,",
    ".mzai-msg,.mzai-fab.pop,.mzai-fab.angry{animation:none!important}}",
    "@media (max-width:520px){.mzai-fab{width:54px;height:54px;left:14px;bottom:14px}",
    ".mzai-menu{left:14px;bottom:80px}}"
  ].join("");

  var CSS2 = [
    /* ---------- حياة أكتر للأيقونة ---------- */
    ".mzai-fab{background:linear-gradient(145deg,#a78bfa,#6d28d9 55%,#4c1d95)}",
    ".mzai-fab::before{content:'';position:absolute;inset:0;border-radius:50%;pointer-events:none;",
    "background:radial-gradient(circle at 32% 20%,rgba(255,255,255,.5),transparent 46%)}",
    ".mzai-fab::after{border-color:rgba(251,146,60,.55);animation:mzai-ring 2.4s ease-out infinite}",
    ".mzai-face{animation:mzai-breathe 3.2s ease-in-out infinite}",
    "@keyframes mzai-breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}",

    /* ---------- الضحكة الشريرة ---------- */
    ".mzai-fab.evil{background:linear-gradient(145deg,#fb7185,#b91c1c 60%,#7f1d1d);",
    "box-shadow:0 12px 34px rgba(239,68,68,.85)}",
    ".mzai-fab.evil .mzai-face{background:radial-gradient(circle at 50% 30%,#ffe6bf,#fb923c 62%,#c2410c);",
    "animation:mzai-cackle .44s ease-in-out 4}",
    "@keyframes mzai-cackle{0%,100%{transform:rotate(0) scale(1)}25%{transform:rotate(-7deg) scale(1.07)}75%{transform:rotate(7deg) scale(1.07)}}",
    ".mzai-fab.evil .mzai-eye{animation:none;background:#1a0d0d;width:12px;height:13px;",
    "transform:scaleY(.4) rotate(-11deg)}",
    ".mzai-fab.evil .mzai-eye.r{transform:scaleY(.4) rotate(11deg)}",
    ".mzai-fab.evil .mzai-eye i{display:none}",
    ".mzai-fab.evil .mzai-brow{opacity:1;height:2.5px;background:#1a0d0d}",
    ".mzai-fab.evil .mzai-mouth{width:25px;height:14px;bottom:9px;border-radius:4px 4px 14px 14px;background:#2a0a0a;",
    "box-shadow:inset 0 4px 0 #fff6e5,0 2px 8px rgba(0,0,0,.4)}",

    ".mzai-ha{position:fixed;left:22px;bottom:82px;z-index:9997;direction:rtl;font-family:inherit;",
    "background:linear-gradient(140deg,#2a0a0a,#120a0a);color:#ffd9a0;border:1px solid rgba(251,146,60,.45);",
    "padding:7px 13px;border-radius:14px 14px 14px 4px;font-size:13px;font-weight:700;",
    "box-shadow:0 8px 22px rgba(0,0,0,.55);opacity:0;transform:translateY(6px) scale(.92);",
    "animation:mzai-ha-in .26s ease forwards;pointer-events:none}",
    "@keyframes mzai-ha-in{to{opacity:1;transform:none}}",
    ".mzai-ha.out{animation:mzai-ha-out .3s ease forwards}",
    "@keyframes mzai-ha-out{to{opacity:0;transform:translateY(-7px)}}",

    /* ---------- الغضب والانفجار ---------- */
    ".mzai-fab.rage{box-shadow:0 14px 40px rgba(239,68,68,.85);z-index:9999}",
    ".mzai-fab.rage .mzai-face{animation:mzai-rage-shake .24s linear infinite}",
    "@keyframes mzai-rage-shake{0%,100%{transform:translate(0,0) rotate(0)}25%{transform:translate(-3px,1px) rotate(-3deg)}",
    "50%{transform:translate(3px,-1px) rotate(3deg)}75%{transform:translate(-2px,2px) rotate(-2deg)}}",
    ".mzai-fab.rage .mzai-eye{animation:none;background:#2a0505;transform:scaleY(.35) rotate(-10deg)}",
    ".mzai-fab.rage .mzai-eye.r{transform:scaleY(.35) rotate(10deg)}",
    ".mzai-fab.rage .mzai-eye i{display:none}",
    ".mzai-fab.rage .mzai-brow{opacity:1;height:3px;background:#2a0505}",
    ".mzai-fab.rage .mzai-mouth{width:22px;height:11px;border-radius:4px 4px 12px 12px;background:#2a0505}",
    ".mzai-spark2{position:fixed;width:9px;height:9px;border-radius:50%;pointer-events:none;z-index:10001;",
    "margin:-4.5px 0 0 -4.5px;animation:mzai-spark2 .85s cubic-bezier(.2,.7,.3,1) forwards}",
    "@keyframes mzai-spark2{0%{opacity:1;transform:translate(0,0) scale(1)}",
    "100%{opacity:0;transform:translate(var(--tx),var(--ty)) scale(.2)}}",
    ".mzai-flash{position:fixed;inset:0;pointer-events:none;z-index:10000;opacity:0;",
    "background:radial-gradient(circle at 50% 88%,rgba(255,232,180,.95),rgba(255,120,60,.55) 32%,transparent 68%);",
    "animation:mzai-flash .55s ease-out forwards}",
    "@keyframes mzai-flash{0%{opacity:0}18%{opacity:1}100%{opacity:0}}",

    /* ---------- عجلة الحظ ---------- */
    ".mzw{position:fixed;inset:0;z-index:10005;display:none;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:22px;",
    "background:radial-gradient(circle at 50% 28%,rgba(109,40,217,.38),transparent 58%),rgba(8,5,14,.95);",
    "backdrop-filter:blur(6px);direction:rtl;font-family:inherit}",
    ".mzw.open{display:flex;animation:mzai-in .24s ease}",
    ".mzw-t{color:#fff;font-size:19px;font-weight:800}",
    ".mzw-s{color:#a78bfa;font-size:12.5px;margin-top:-9px}",
    ".mzw-wrap{position:relative;width:300px;height:300px;max-width:84vw;max-height:84vw;margin-top:6px;",
    "filter:drop-shadow(0 12px 34px rgba(139,92,246,.5));transition:filter .3s ease}",
    ".mzw-wrap.spinning{filter:drop-shadow(0 14px 46px rgba(168,85,247,.9))}",
    ".mzw-wrap canvas{width:100%;height:100%;display:block;border-radius:50%}",
    ".mzw-pin{position:absolute;top:-15px;left:50%;transform:translateX(-50%);width:0;height:0;z-index:3;",
    "border-left:12px solid transparent;border-right:12px solid transparent;border-top:23px solid #fbbf24;",
    "filter:drop-shadow(0 3px 6px rgba(0,0,0,.65));animation:mzw-pin 1.6s ease-in-out infinite}",
    "@keyframes mzw-pin{0%,100%{transform:translateX(-50%) translateY(0)}50%{transform:translateX(-50%) translateY(3px)}}",
    ".mzw-hub{position:absolute;top:50%;left:50%;width:52px;height:52px;margin:-26px 0 0 -26px;border-radius:50%;z-index:2;",
    "background:linear-gradient(145deg,#fde68a,#d97706);box-shadow:0 4px 14px rgba(0,0,0,.55),inset 0 -2px 6px rgba(0,0,0,.3);",
    "display:flex;align-items:center;justify-content:center;font-size:21px}",
    ".mzw-spin{padding:14px 36px;border:none;border-radius:999px;font-family:inherit;font-size:15px;font-weight:800;color:#fff;",
    "background:linear-gradient(140deg,#8b5cf6,#6d28d9);box-shadow:0 10px 26px rgba(109,40,217,.55);cursor:pointer;",
    "transition:transform .15s ease,opacity .2s ease}",
    ".mzw-spin:active{transform:scale(.96)}",
    ".mzw-spin:disabled{opacity:.55;cursor:default}",
    ".mzw-res{min-height:66px;display:flex;flex-direction:column;align-items:center;gap:10px;text-align:center}",
    ".mzw-name{color:#fff;font-size:17px;font-weight:800;padding:9px 20px;border-radius:14px;",
    "background:rgba(139,92,246,.16);border:1px solid rgba(139,92,246,.45);animation:mzw-pop .42s cubic-bezier(.34,1.56,.64,1)}",
    "@keyframes mzw-pop{0%{opacity:0;transform:scale(.72)}100%{opacity:1;transform:scale(1)}}",
    ".mzw-open{padding:12px 30px;border:none;border-radius:999px;font-family:inherit;font-size:14.5px;font-weight:800;color:#160c26;",
    "background:linear-gradient(140deg,#fde68a,#fbbf24);cursor:pointer;box-shadow:0 8px 22px rgba(251,191,36,.4);",
    "animation:mzw-pop .42s .08s cubic-bezier(.34,1.56,.64,1) both}",
    ".mzw-x{position:absolute;top:16px;right:16px;width:38px;height:38px;border-radius:12px;border:1px solid rgba(255,255,255,.14);",
    "background:rgba(255,255,255,.08);color:#e6dcff;font-size:20px;font-family:inherit;cursor:pointer;",
    "display:flex;align-items:center;justify-content:center}",
    ".mzw-spark{position:absolute;top:50%;left:50%;width:7px;height:7px;border-radius:50%;pointer-events:none;z-index:4;",
    "animation:mzw-sp .9s ease-out forwards}",
    "@keyframes mzw-sp{0%{opacity:1;transform:translate(0,0) scale(1)}100%{opacity:0;transform:translate(var(--tx),var(--ty)) scale(.15)}}",
    "@media (max-width:520px){.mzai-ha{left:18px;bottom:76px}}",
    "@media (prefers-reduced-motion:reduce){.mzai-fab,.mzai-face,.mzai-fab.evil .mzai-face,.mzai-ha{animation:none!important}}"
  ].join("");

  function injectCSS() {
    if (document.getElementById("mzai-css")) return;
    var s = el("style");
    s.id = "mzai-css";
    s.textContent = CSS;
    document.head.appendChild(s);
    var s2 = el("style");
    s2.id = "mzai-css2";
    s2.textContent = CSS2;
    document.head.appendChild(s2);
  }

  /* ================= سياق الموقع ================= */

  function mangaArray() {
    try {
      return (typeof mangaList !== "undefined" && Array.isArray(mangaList)) ? mangaList : [];
    } catch (e) { return []; }
  }

  function siteContext() {
    var list = mangaArray();
    if (!list.length) return "";
    return list.slice(0, 45).map(function (m) {
      var n = String((m && m.name) || "").trim();
      if (!n) return "";
      var t = String((m && m.type) || "").trim();
      return "- " + n + (t ? " (" + t + ")" : "");
    }).filter(Boolean).join("\n");
  }

  /* ================= صفحة Zero AI ================= */

  var GREET = "أهلاً! أنا Zero AI 👋\nاسألني أي حاجة: مانجا في الموقع، مانجا برّه الموقع، أو أي سؤال عام. أنا مش محدود بالموقع.";
  var CHIPS = ["رشحلي مانجا", "رشحلي مانجا مش عندك", "إيه الجديد؟", "عايز حاجة رعب", "أقصر مانجا أقراها"];

  var page, pageBody, pageInput, pageSend, pageBusy = false, pageStarted = false;

  function buildPage() {
    if (page) return;
    page = el("div", "mzai-page");
    page.id = "mzai-page";
    page.innerHTML =
      '<div class="mzai-top"><div class="mzai-ava">🤖</div>' +
      '<div><b>Zero AI</b><span>مساعد MangaZERO</span></div>' +
      '<button class="mzai-x" type="button" aria-label="إغلاق">×</button></div>' +
      '<div class="mzai-body" id="mzai-page-body"></div>' +
      '<div class="mzai-chips" id="mzai-chips"></div>' +
      '<div class="mzai-foot"><input class="mzai-in" id="mzai-page-in" type="text" maxlength="500" ' +
      'placeholder="اكتب سؤالك..." autocomplete="off">' +
      '<button class="mzai-send" id="mzai-page-send" type="button">إرسال</button></div>';
    document.body.appendChild(page);

    pageBody = page.querySelector("#mzai-page-body");
    pageInput = page.querySelector("#mzai-page-in");
    pageSend = page.querySelector("#mzai-page-send");

    var chips = page.querySelector("#mzai-chips");
    CHIPS.forEach(function (c) {
      var b = el("button", null, esc(c));
      b.type = "button";
      b.onclick = function () { pageInput.value = c; sendPage(); };
      chips.appendChild(b);
    });

    page.querySelector(".mzai-x").onclick = closePage;
    pageSend.onclick = sendPage;
    pageInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendPage(); }
    });
  }

  function pageBubble(text, who) {
    var b = el("div", "mzai-msg " + who, esc(text));
    pageBody.appendChild(b);
    pageBody.scrollTop = pageBody.scrollHeight;
    return b;
  }

  function openPage() {
    buildPage();
    page.classList.add("open");
    document.body.style.overflow = "hidden";
    if (!pageStarted) {
      pageStarted = true;
      pageBubble(GREET, "bot");
    }
    setTimeout(function () { try { pageInput.focus(); } catch (e) {} }, 180);
  }

  function closePage() {
    if (!page) return;
    page.classList.remove("open");
    document.body.style.overflow = "";
  }

  function sendPage() {
    var text = String(pageInput.value || "").trim();
    if (!text || pageBusy) return;
    unlock();
    pageBusy = true;
    pageSend.disabled = true;
    pageInput.value = "";
    pageBubble(text, "me");

    var t = el("div", "mzai-msg bot mzai-typing", "<i></i><i></i><i></i>");
    pageBody.appendChild(t);
    pageBody.scrollTop = pageBody.scrollHeight;

    ask(text, "chat", siteContext()).then(function (d) {
      t.remove();
      pageBusy = false;
      pageSend.disabled = false;
      var reply = (d && d.reply) ? String(d.reply) : "";
      if (!reply) reply = "معلش، مش قادر أرد دلوقتي. جرّب تاني بعد شوية.";
      pageBubble(reply, "bot");
      sfxMsg();
    });
  }

  /* ================= المانجا العشوائية والبحث ================= */

  function randomManga() {
    var list = mangaArray().filter(function (m) { return m && m.name; });
    if (!list.length) { toast("مفيش مانجا متاحة دلوقتي"); return; }
    var pick = list[Math.floor(Math.random() * list.length)];
    closeMenu();
    if (typeof window.openMangaPage === "function") {
      try { window.openMangaPage(pick, false); return; } catch (e) {}
    }
    toast("جربت أفتح " + String(pick.name || "مانجا"));
  }

  function goSearch() {
    closeMenu();
    var homeBtn = document.querySelector('[data-site="home"]');
    if (homeBtn) { try { homeBtn.click(); } catch (e) {} }
    setTimeout(function () {
      var si = document.getElementById("searchInput");
      if (!si) return;
      try { si.scrollIntoView({ behavior: "smooth", block: "center" }); } catch (e) {}
      try { si.focus(); } catch (e) {}
    }, 220);
  }

  /* ================= القائمة ================= */

  var menu;

  function buildMenu() {
    if (menu) return;
    menu = el("div", "mzai-menu");
    menu.id = "mzai-menu";
    menu.innerHTML =
      '<button type="button" data-act="ask"><b>🤖</b> اسأل Zero AI</button>' +
      '<button type="button" data-act="random"><b>🎡</b> عجلة الحظ — مانجا عشوائي</button>' +
      '<button type="button" data-act="search"><b>🔍</b> بحث</button>' +
      '<button type="button" data-act="sound"><b id="mzai-snd">' + (soundOn ? "🔊" : "🔇") + '</b> الصوت</button>';
    document.body.appendChild(menu);

    menu.addEventListener("click", function (e) {
      var b = e.target && e.target.closest ? e.target.closest("button[data-act]") : null;
      if (!b) return;
      e.stopPropagation();
      var act = b.dataset.act;
      if (act === "ask") { closeMenu(); openPage(); }
      else if (act === "random") { closeMenu(); openWheel(); }
      else if (act === "search") goSearch();
      else if (act === "sound") toggleSound();
    });
  }

  function openMenu() {
    unlock();
    buildMenu();
    menu.classList.add("open");
    sfxPop();
    setTimeout(function () { document.addEventListener("click", outsideClose, true); }, 30);
  }

  function closeMenu() {
    if (!menu) return;
    menu.classList.remove("open");
    document.removeEventListener("click", outsideClose, true);
  }

  function outsideClose(e) {
    if (menu && menu.contains(e.target)) return;
    if (fab && fab.contains(e.target)) return;
    closeMenu();
  }

  /* ================= الأصوات ================= */

  var actx = null, soundOn = true, audioUnlocked = false;
  try { soundOn = window.localStorage.getItem("mzai_sound") !== "0"; } catch (e) {}

  function ac() {
    if (!soundOn) return null;
    try {
      if (!actx) {
        var C = window.AudioContext || window.webkitAudioContext;
        if (!C) return null;
        actx = new C();
      }
      if (actx.state === "suspended") { try { actx.resume(); } catch (e) {} }
      return actx;
    } catch (e) { return null; }
  }

  function unlock() {
    audioUnlocked = true;
    ac();
  }

  function blip(o) {
    if (!audioUnlocked) return;
    var c = ac();
    if (!c) return;
    try {
      var t0 = c.currentTime + (o.delay || 0);
      var osc = c.createOscillator(), g = c.createGain(), node = osc;
      osc.type = o.type || "sine";
      osc.frequency.setValueAtTime(o.from, t0);
      if (o.to && o.to !== o.from) {
        osc.frequency.exponentialRampToValueAtTime(Math.max(20, o.to), t0 + o.dur);
      }
      if (o.filter) {
        var f = c.createBiquadFilter();
        f.type = "bandpass";
        f.frequency.value = o.filter;
        f.Q.value = o.q || 6;
        osc.connect(f);
        node = f;
      }
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(o.vol || 0.09, t0 + Math.min(0.02, o.dur / 3));
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + o.dur);
      node.connect(g);
      g.connect(c.destination);
      osc.start(t0);
      osc.stop(t0 + o.dur + 0.03);
    } catch (e) {}
  }

  function sfxTap() { blip({ from: 640, to: 280, dur: 0.24, type: "sine", vol: 0.1 }); }
  function sfxPop() { blip({ from: 300, to: 660, dur: 0.1, type: "sine", vol: 0.07 }); }
  function sfxTick() { blip({ from: 1500, to: 1150, dur: 0.035, type: "square", vol: 0.03 }); }
  function sfxMsg() { blip({ from: 760, to: 980, dur: 0.09, type: "triangle", vol: 0.05 }); }

  function sfxWin() {
    var notes = [523.25, 659.25, 783.99, 1046.5];
    for (var i = 0; i < notes.length; i++) {
      blip({ from: notes[i], dur: 0.17, type: "triangle", vol: 0.085, delay: i * 0.09 });
    }
  }

  function sfxLaugh() {
    for (var i = 0; i < 5; i++) {
      blip({
        from: 215 - i * 13, to: 150 - i * 9, dur: 0.14, type: "sawtooth",
        vol: 0.075 - i * 0.007, filter: 880, q: 7, delay: i * 0.135
      });
    }
  }

  function sfxGrowl() {
    blip({ from: 150, to: 80, dur: 0.55, type: "sawtooth", vol: 0.09, filter: 320, q: 4 });
  }

  function sfxBoom() {
    var c = ac();
    if (!c) return;
    try {
      var dur = 0.45, sr = c.sampleRate;
      var buf = c.createBuffer(1, Math.floor(sr * dur), sr);
      var d = buf.getChannelData(0);
      for (var i = 0; i < d.length; i++) {
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 2.4);
      }
      var src = c.createBufferSource();
      src.buffer = buf;
      var lp = c.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.setValueAtTime(1800, c.currentTime);
      lp.frequency.exponentialRampToValueAtTime(220, c.currentTime + dur);
      var g = c.createGain();
      g.gain.setValueAtTime(0.32, c.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
      src.connect(lp); lp.connect(g); g.connect(c.destination);
      src.start();
    } catch (e) {}
    blip({ from: 120, to: 38, dur: 0.4, type: "sine", vol: 0.16 });
  }

  function toggleSound() {
    unlock();
    soundOn = !soundOn;
    try { window.localStorage.setItem("mzai_sound", soundOn ? "1" : "0"); } catch (e) {}
    var b = document.getElementById("mzai-snd");
    if (b) b.textContent = soundOn ? "🔊" : "🔇";
    if (soundOn) sfxPop();
    toast(soundOn ? "الصوت شغال 🔊" : "الصوت مقفول 🔇");
  }

  /* ================= عجلة الحظ ================= */

  var wheel, wheelCanvas, wheelCtx, wheelRes, wheelBtn;
  var wheelItems = [], wheelIdx = 0, wheelRot = 0, wheelBusy = false, wheelRAF = null, wheelOpenTimer = null;

  var WHEEL_COLORS = ["#8b5cf6", "#6d28d9", "#a78bfa", "#4c1d95",
                      "#c084fc", "#7c3aed", "#9333ea", "#5b21b6"];

  function wheelPool() {
    var list = mangaArray().filter(function (m) { return m && m.name; });
    var n = Math.min(list.length, 8);
    var copy = list.slice(), out = [];
    for (var i = 0; i < n; i++) {
      out.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
    }
    return out;
  }

  function wheelLabel(s) {
    s = String(s || "").trim();
    return s.length > 16 ? s.slice(0, 15) + "…" : s;
  }

  function drawWheel(rot) {
    if (!wheelCtx) return;
    var cv = wheelCanvas, dpr = Math.min(window.devicePixelRatio || 1, 2);
    var size = cv.clientWidth || 300;
    var px = Math.round(size * dpr);
    if (cv.width !== px || cv.height !== px) {
      cv.width = px;
      cv.height = px;
    }
    var ctx = wheelCtx, R = cv.width / 2, n = wheelItems.length;
    if (!n) return;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, cv.width, cv.height);
    ctx.translate(R, R);
    ctx.rotate(rot);

    var seg = Math.PI * 2 / n, i;
    for (i = 0; i < n; i++) {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, R - 2, i * seg, (i + 1) * seg);
      ctx.closePath();
      ctx.fillStyle = WHEEL_COLORS[i % WHEEL_COLORS.length];
      ctx.fill();
      ctx.strokeStyle = "rgba(10,7,16,.55)";
      ctx.lineWidth = Math.max(1, dpr);
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.arc(0, 0, R - 2, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(251,191,36,.9)";
    ctx.lineWidth = 4 * dpr;
    ctx.stroke();
  }

  function buildWheel() {
    if (wheel) return;
    wheel = el("div", "mzw");
    wheel.id = "mzw";
    wheel.innerHTML =
      '<button class="mzw-x" type="button" aria-label="إغلاق">×</button>' +
      '<div class="mzw-t">عجلة الحظ 🎡</div>' +
      '<div class="mzw-s">هتفتحلك مانهوا عشوائي</div>' +
      '<div class="mzw-wrap"><div class="mzw-pin"></div><canvas></canvas><div class="mzw-hub">؟</div></div>' +
      '<button class="mzw-spin" type="button">لف العجلة</button>' +
      '<div class="mzw-res"></div>';
    document.body.appendChild(wheel);
    wheelCanvas = wheel.querySelector("canvas");
    wheelCtx = wheelCanvas.getContext("2d");
    wheelRes = wheel.querySelector(".mzw-res");
    wheelBtn = wheel.querySelector(".mzw-spin");
    wheel.querySelector(".mzw-x").onclick = closeWheel;
    wheelBtn.onclick = spinWheel;
  }

  function openWheel() {
    buildWheel();
    wheelItems = wheelPool();
    if (wheelItems.length < 2) { toast("مفيش مانجا كفاية للعجلة"); return; }
    wheelRot = 0;
    wheelRes.innerHTML = "";
    wheelBtn.disabled = false;
    wheelBtn.textContent = "لف العجلة";
    wheel.classList.add("open");
    document.body.style.overflow = "hidden";
    drawWheel(0);
  }

  function closeWheel() {
    if (!wheel) return;
    wheel.classList.remove("open");
    document.body.style.overflow = "";
    if (wheelRAF) { cancelAnimationFrame(wheelRAF); wheelRAF = null; }
    if (wheelOpenTimer) { clearTimeout(wheelOpenTimer); wheelOpenTimer = null; }
    wheelBusy = false;
  }

  function openPicked(pick) {
    if (typeof window.openMangaPage === "function") {
      try { window.openMangaPage(pick, false); return; } catch (e) {}
    }
    toast("جربت أفتح " + String((pick && pick.name) || "مانجا"));
  }

  function sparkle() {
    var wrap = wheel.querySelector(".mzw-wrap");
    if (!wrap) return;
    for (var i = 0; i < 16; i++) {
      var s = el("i", "mzw-spark");
      var a = Math.random() * Math.PI * 2, d = 70 + Math.random() * 90;
      s.style.setProperty("--tx", Math.round(Math.cos(a) * d) + "px");
      s.style.setProperty("--ty", Math.round(Math.sin(a) * d) + "px");
      s.style.background = ["#fbbf24", "#a78bfa", "#f472b6", "#fff"][i % 4];
      s.style.animationDelay = (Math.random() * 0.12) + "s";
      wrap.appendChild(s);
      (function (node) { setTimeout(function () { if (node.parentNode) node.remove(); }, 1200); })(s);
    }
  }

  function finishWheel() {
    wheelBusy = false;
    wheelBtn.disabled = false;
    wheelBtn.textContent = "لف تاني";
    var wrap = wheel.querySelector(".mzw-wrap");
    if (wrap) wrap.classList.remove("spinning");
    var pick = wheelItems[wheelIdx];
    if (!pick) return;
    sparkle();
    sfxWin();
    buzz(26);
    wheelRes.innerHTML = "";
    if (wheelOpenTimer) clearTimeout(wheelOpenTimer);
    wheelOpenTimer = setTimeout(function () {
      wheelOpenTimer = null;
      closeWheel();
      openPicked(pick);
    }, 800);
  }

  function spinWheel() {
    if (wheelBusy || !wheelItems.length) return;
    unlock();
    wheelBusy = true;
    wheelBtn.disabled = true;
    wheelBtn.textContent = "بتلف...";
    wheelRes.innerHTML = "";
    var wrap = wheel.querySelector(".mzw-wrap");
    if (wrap) wrap.classList.add("spinning");

    var n = wheelItems.length, seg = Math.PI * 2 / n, twoPi = Math.PI * 2;
    wheelIdx = Math.floor(Math.random() * n);

    var start = wheelRot % twoPi;
    var desired = ((-Math.PI / 2 - (wheelIdx + 0.5) * seg) % twoPi + twoPi) % twoPi;
    var delta = ((desired - start) % twoPi + twoPi) % twoPi;
    var end = start + twoPi * 5 + delta;
    var t0 = (window.performance && performance.now) ? performance.now() : Date.now();
    var dur = 3600;

    if (wheelRAF) cancelAnimationFrame(wheelRAF);
    var lastTick = -1;
    function step(t) {
      var p = Math.min(1, (t - t0) / dur);
      var e = 1 - Math.pow(1 - p, 3);
      wheelRot = start + (end - start) * e;
      var ti = Math.floor((((-Math.PI / 2 - wheelRot) % twoPi) + twoPi) % twoPi / seg);
      if (ti !== lastTick) { lastTick = ti; sfxTick(); }
      drawWheel(wheelRot);
      if (p < 1) wheelRAF = requestAnimationFrame(step);
      else finishWheel();
    }
    wheelRAF = requestAnimationFrame(step);
  }

  /* ================= الأيقونة والتفاعل ================= */

  var fab;
  var tapCount = 0, tapTimer = null, tapHintShown = false;
  var longTimer = null, longFired = false;
  var exprTimer = null, exprClear = null;
  var scale = 1, scaleTimer = null;

  function setExpr(name, ms) {
    if (!fab) return;
    fab.classList.remove("happy", "wink", "surprised", "evil");
    if (name) fab.classList.add(name);
    if (exprClear) clearTimeout(exprClear);
    if (ms) exprClear = setTimeout(function () {
      if (fab) fab.classList.remove("happy", "wink", "surprised", "evil");
    }, ms);
  }

  function angry() {
    if (!fab) return;
    fab.classList.remove("happy", "wink", "surprised", "evil");
    fab.classList.add("angry");
    buzz(24);
    if (exprClear) clearTimeout(exprClear);
    exprClear = setTimeout(function () { if (fab) fab.classList.remove("angry"); }, 1500);
  }

  var rageActive = false, rageLevel = 0, rageTimer = null, rageResetTimer = null;

  function paintRage(k) {
    if (!fab) return;
    var face = fab.querySelector(".mzai-face");
    var r = Math.round(252 - 22 * k);
    var g = Math.round(196 - 168 * k);
    var b = Math.round(170 - 150 * k);
    if (face) {
      face.style.background = "radial-gradient(circle at 50% 32%,#fff4e2,rgb(" + r + "," + g + "," + b + ") 66%,rgb(" +
        Math.round(r * 0.82) + "," + Math.round(g * 0.5) + "," + Math.round(b * 0.5) + "))";
    }
    fab.style.transform = "scale(" + (1 + 0.95 * k).toFixed(3) + ")";
  }

  function burstOut() {
    if (!fab) return;
    var rect = fab.getBoundingClientRect();
    var cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
    var i, p;
    for (i = 0; i < 20; i++) {
      p = el("i", "mzai-spark2");
      var ang = (Math.PI * 2 * i) / 20 + Math.random() * 0.4;
      var dist = 45 + Math.random() * 75;
      p.style.left = cx + "px";
      p.style.top = cy + "px";
      p.style.setProperty("--tx", Math.round(Math.cos(ang) * dist) + "px");
      p.style.setProperty("--ty", Math.round(Math.sin(ang) * dist) + "px");
      p.style.background = i % 3 === 0 ? "#fff3c4" : (i % 3 === 1 ? "#ffb03a" : "#ff4d3d");
      p.style.animationDelay = (Math.random() * 0.08) + "s";
      document.body.appendChild(p);
      (function (n) { setTimeout(function () { if (n.parentNode) n.remove(); }, 1100); })(p);
    }
    var fl = el("div", "mzai-flash");
    document.body.appendChild(fl);
    setTimeout(function () { if (fl.parentNode) fl.remove(); }, 700);
  }

  function explode() {
    if (!fab || !rageActive) return;
    rageActive = false;
    if (rageTimer) { clearInterval(rageTimer); rageTimer = null; }
    sfxBoom();
    buzz([40, 60, 120]);
    burstOut();
    fab.classList.remove("rage");
    fab.style.transform = "scale(0.001)";
    fab.style.opacity = "0";
    fab.style.transition = "transform .18s ease-in,opacity .18s ease-in";
    if (rageResetTimer) clearTimeout(rageResetTimer);
    rageResetTimer = setTimeout(resetRage, 900);
  }

  function resetRage() {
    rageLevel = 0;
    rageActive = false;
    tapCount = 0;
    if (!fab) return;
    fab.classList.remove("rage", "angry", "evil", "happy", "wink", "surprised");
    var face = fab.querySelector(".mzai-face");
    if (face) face.style.background = "";
    fab.style.transition = "transform .42s cubic-bezier(.34,1.56,.64,1),opacity .3s ease";
    fab.style.opacity = "1";
    fab.style.transform = "scale(1)";
    setTimeout(function () { if (fab) fab.style.transition = ""; }, 460);
    setExpr("happy", 900);
    buzz(18);
  }

  function startRage() {
    if (!fab || rageActive) return;
    rageActive = true;
    rageLevel = 0;
    fab.classList.remove("happy", "wink", "surprised", "evil", "angry");
    fab.classList.add("rage");
    if (exprClear) clearTimeout(exprClear);
    sfxGrowl();
    buzz([25, 40, 25]);
    paintRage(0);
    if (rageTimer) clearInterval(rageTimer);
    rageTimer = setInterval(function () {
      rageLevel = Math.min(1, rageLevel + 0.075);
      paintRage(rageLevel);
      if (rageLevel >= 1) explode();
    }, 150);
  }

  function rageTap() {
    if (!rageActive) { startRage(); return; }
    rageLevel = Math.min(1, rageLevel + 0.16);
    paintRage(rageLevel);
    sfxTick();
    buzz(12);
    if (rageLevel >= 1) explode();
  }

  function grow() {
    if (!fab) return;
    scale = Math.min(scale + 0.08, 1.55);
    fab.style.transform = "scale(" + scale + ")";
    fab.classList.remove("pop");
    void fab.offsetWidth;
    fab.classList.add("pop");
    buzz(14);
    if (scaleTimer) clearTimeout(scaleTimer);
    scaleTimer = setTimeout(function () {
      scale = 1;
      if (fab) fab.style.transform = "";
    }, 2600);
  }

  var haEl = null, haTimer = null, haOut = null;
  var HA_WORDS = ["ههههههه 😈", "هيهيهي 😈", "ههههههههه", "هاهاها 😈"];

  function haBubble() {
    if (!haEl) {
      haEl = el("div", "mzai-ha");
      document.body.appendChild(haEl);
    }
    haEl.textContent = HA_WORDS[Math.floor(Math.random() * HA_WORDS.length)];
    haEl.classList.remove("out");
    void haEl.offsetWidth;
    if (haTimer) clearTimeout(haTimer);
    if (haOut) clearTimeout(haOut);
    haTimer = setTimeout(function () {
      if (!haEl) return;
      haEl.classList.add("out");
      haOut = setTimeout(function () { if (haEl) haEl.classList.remove("out"); }, 320);
    }, 1500);
  }

  function evilLaugh() {
    if (!fab) return;
    fab.classList.remove("happy", "wink", "surprised", "angry");
    fab.classList.add("evil");
    buzz(20);
    sfxLaugh();
    haBubble();
    if (exprClear) clearTimeout(exprClear);
    exprClear = setTimeout(function () { if (fab) fab.classList.remove("evil"); }, 2100);
  }

  function resetTaps() { tapCount = 0; }

  function idleLoop() {
    if (exprTimer) clearInterval(exprTimer);
    exprTimer = setInterval(function () {
      if (!fab) return;
      if (fab.classList.contains("angry")) return;
      if (page && page.classList.contains("open")) return;
      if (menu && menu.classList.contains("open")) return;
      if (Math.random() < 0.28) { evilLaugh(); return; }
      var pool = ["happy", "wink", "surprised", "", "", ""];
      setExpr(pool[Math.floor(Math.random() * pool.length)], 1500);
    }, 5200);
  }

  function tapPing() {
    if (!fab) return;
    unlock();
    fab.classList.remove("pop");
    void fab.offsetWidth;
    fab.classList.add("pop");
    buzz(12);
    sfxTap();
    setExpr("happy", 850);
    if (!tapHintShown) {
      tapHintShown = true;
      setTimeout(function () { toast("دوسة طويلة على الأيقونة تفتح Zero AI 👆"); }, 260);
    }
  }

  function onDown(e) {
    longFired = false;
    if (longTimer) clearTimeout(longTimer);
    longTimer = setTimeout(function () {
      longFired = true;
      buzz(30);
      setExpr("surprised", 700);
      openMenu();
    }, 520);
  }

  function onUp(e) {
    if (longTimer) { clearTimeout(longTimer); longTimer = null; }
    if (longFired) { longFired = false; return; }   // دوس طويل خلاص فتح القائمة

    tapCount++;
    if (tapTimer) clearTimeout(tapTimer);
    tapTimer = setTimeout(resetTaps, 1100);

    if (tapCount === 1) { tapPing(); return; }

    if (tapCount > 10) { rageTap(); return; }
    if (tapCount >= 7) grow();
    else if (tapCount >= 3) angry();
    else setExpr("surprised", 500);
  }

  function onCancel() {
    if (longTimer) { clearTimeout(longTimer); longTimer = null; }
    longFired = false;
  }

  function buildFab() {
    if (document.getElementById("mzai-fab")) { fab = document.getElementById("mzai-fab"); return; }
    injectCSS();

    fab = el("button", "mzai-fab");
    fab.id = "mzai-fab";
    fab.type = "button";
    fab.setAttribute("aria-label", "Zero AI");
    fab.innerHTML =
      '<span class="mzai-face">' +
      '<span class="mzai-brow l"></span><span class="mzai-brow r"></span>' +
      '<span class="mzai-eye l"><i></i></span><span class="mzai-eye r"><i></i></span>' +
      '<span class="mzai-mouth"></span></span>';
    document.body.appendChild(fab);

    fab.addEventListener("pointerdown", onDown);
    fab.addEventListener("pointerup", onUp);
    fab.addEventListener("pointercancel", onCancel);
    fab.addEventListener("pointerleave", onCancel);
    fab.addEventListener("contextmenu", function (e) { e.preventDefault(); });

    idleLoop();
  }

  /* ================= فلتر التعليقات ================= */

  var aiApproved = false;

  function localBad(text) {
    try { return (typeof window.mzHasBadWord === "function") && window.mzHasBadWord(text); }
    catch (e) { return false; }
  }

  document.addEventListener("click", function (e) {
    var btn = e.target && e.target.closest ? e.target.closest("#addCommentBtn, #addChapterCommentBtn") : null;
    if (!btn) return;

    if (aiApproved) { aiApproved = false; return; }
    if (btn.dataset && btn.dataset.mzaiBusy === "1") return;

    var inputId = btn.id === "addChapterCommentBtn" ? "chapterCommentInput" : "commentInput";
    var input = document.getElementById(inputId);
    var text = input ? String(input.value || "").trim() : "";

    if (!text || text.length > 300) return;
    if (localBad(text)) return;

    e.preventDefault();
    e.stopPropagation();

    btn.dataset.mzaiBusy = "1";
    var old = btn.textContent;
    btn.textContent = "🔍 بنراجع التعليق...";

    function done(allow) {
      delete btn.dataset.mzaiBusy;
      btn.textContent = old;
      if (allow) { aiApproved = true; btn.click(); }
      else {
        toast("التعليق فيه كلام مش مناسب. عدّله وجرب تاني 🙏");
        if (input) input.focus();
      }
    }

    ask(text, "moderate", "").then(function (d) {
      if (!d || d.error || !d.reply) return done(true);
      done(String(d.reply).toUpperCase().indexOf("BAD") === -1);
    }).catch(function () { done(true); });
  }, true);

  /* ================= تشغيل ================= */

  function start() {
    if (!document.body) return;
    var go = function () { try { buildFab(); } catch (e) {} };
    if (document.readyState === "complete") setTimeout(go, 350);
    else window.addEventListener("load", function () { setTimeout(go, 350); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
