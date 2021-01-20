var json =JSON.parse(localStorage.getItem("acc"));
//intializing all Materilaize CSS stuff
M.Tabs.init(document.querySelector(".tabs"));
M.AutoInit();
loaded();
function loaded(){
$.get('https://code.abaanshanid.repl.co/user',json, function (data, textStatus, jqXHR) {
  localStorage.setItem("acc",data)
  var data = JSON.parse(data);
   
   $("#data").html("");
   $("#starred").html("");
  data.files.forEach(function(item){
    var fileName = item.fileName;
    fileName = fileName ? fileName : "Untitled";
   var starIcon = item.starred == "false" ? "star"  : "star_outline";
   var starText = item.starred == "false" ? "Star" : "Unstar";
  $("#data").append(`
<div class="fileItem">
   ${fileName}
   <div class="actions right">
   <button onclick="deleteFile('${item.file}')" class=" btn red darken-4  waves-effect waves-light"><i class="material-icons left">delete_outline</i>Delete</button>
   <button onclick="starFile('${item.file}')" class=" btn yellow darken-4  waves-effect waves-light"><i class="material-icons left">${starIcon}</i>${starText}</button>
      <a href="https://code.abaanshanid.repl.co/sites/${item.file}.html" class=" btn light-blue darken-4  waves-effect waves-light" target="about:blank"><i class="material-icons left">launch</i>Open</a>
      <a href="https://code.abaanshanid.repl.co?${item.file}" class="btn light-blue darken-4  waves-effect waves-light "><i class="material-icons left">edit</i>Edit</a>
   </div>
</div>
`)
if(item.starred == "true"){
 $("#starred").append(`
<div class="fileItem">
   ${fileName}
   <div class="actions right">
   <button onclick="deleteFile('${item.file}')" class=" btn red darken-4  waves-effect waves-light"><i class="material-icons left">delete_outline</i>Delete</button>
   <button onclick="starFile('${item.file}')" class=" btn yellow darken-4  waves-effect waves-light"><i class="material-icons left">${starIcon}</i>${starText}</button>
      <a href="https://code.abaanshanid.repl.co/sites/${item.file}.html" class=" btn light-blue darken-4  waves-effect waves-light" target="about:blank"><i class="material-icons left">launch</i>Open</a>
      <a href="https://code.abaanshanid.repl.co?${item.file}" class="btn light-blue darken-4  waves-effect waves-light "><i class="material-icons left">edit</i>Edit</a>
   </div>
</div>
`)
}
  })
if(data.files.length <= 0){
  $("#data").append(`
<div class="fileItem">
   No snippets
   <div class="actions right">  
      <a href="https://code.abaanshanid.repl.co" class="btn light-blue darken-4  waves-effect waves-light "><i class="material-icons left">add</i>Make new snippet</a>
   </div>
</div>
`)
}
});
}
//editNameInp
$(".avtr")[0].src = json.avatar;
$(".avtr")[1].src = json.avatar;
$("h3")[0].innerHTML = (json.name);
$("#editNameInp").val(json.name);
function deleteFile(file) {
  var usrData = json;
  usrData.file = file;
  $.get("https://code.abaanshanid.repl.co/delete",usrData,function(data){
   M.toast({
    html: '<span>Deleted</span><button style="color:white !important" onclick="M.Toast.dismissAll();" class="btn-flat toast-action">  <i class="material-icons">close</i></button>',
    classes: 'red darken-1'
    });
    $("#data").html(`
    <div class="preloader-wrapper big active">
      <div class="spinner-layer spinner-blue">
        <div class="circle-clipper left">
          <div class="circle"></div>
        </div><div class="gap-patch">
          <div class="circle"></div>
        </div><div class="circle-clipper right">
          <div class="circle"></div>
        </div>
      </div>
      </div>`);
    loaded();
  })
}
function starFile(file) {
  var usrData = json;
  usrData.file = file;
  $.get("https://code.abaanshanid.repl.co/star",usrData,function(data){  
   var result = data == "true" ?"Starred" :  "Unstarred" ;
   M.toast({
    html: `<span>${result}</span><button style="color:white !important" onclick="M.Toast.dismissAll();" class="btn-flat toast-action">  <i class="material-icons">close</i></button>`
    });
    $("#data").html(`
    <div class="preloader-wrapper big active">
      <div class="spinner-layer spinner-blue">
        <div class="circle-clipper left">
          <div class="circle"></div>
        </div><div class="gap-patch">
          <div class="circle"></div>
        </div><div class="circle-clipper right">
          <div class="circle"></div>
        </div>
      </div>
      </div>`);
    loaded();
  })
}
function createCookie(name, value, days) {
  var expires;
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toGMTString();
  }
  else {
    expires = "";
  }
  document.cookie = name + "=" + value + expires + "; path=/";
}
function toggleDarkMode(){
  var body = document.body;
  if(!body.classList.contains("light")){
     body.classList.add("light"); 
     localStorage.setItem("light","true");
     return
  }
  body.classList.remove("light");
  localStorage.setItem("light","false");
}
if(localStorage.getItem("light")=="true"){
toggleDarkMode();
document.querySelector("#darkModeToggle").checked  = false;
}else{
  document.querySelector("#darkModeToggle").checked  = true;
}
function addAvtr() {
     document.querySelector('#saveEditBtn').classList.remove('disabled');
     document.getElementById("editAvtr").setAttribute("src", document.querySelector('#imgInp').value);
}
function updateUsrName() {
    var jsonData = json;
    json.name =  $("#editNameInp").val();
    jsonData.data = $("#editNameInp").val();
    $.get('https://code.abaanshanid.repl.co/editAcc/name', jsonData, function(data, textStatus, jqXHR) {
        document.querySelector("#saveEditBtn").classList.add("disabled");
    });
}
function updateAvtr(){
  var jsonData = json;
  json.avatar = document.querySelector("#editAvtr").src;
    jsonData.data = document.querySelector("#editAvtr").src;
    $.get('https://code.abaanshanid.repl.co/editAcc/avtr', jsonData, function(data, textStatus, jqXHR) {
        document.querySelector("#saveEditBtn").classList.add("disabled");
       
    });
}
function submitEdit(){
  updateUsrName();
  updateAvtr();
   M.toast({
            html: '<span>Changes saved</span><button style="color:white !important" onclick="M.Toast.dismissAll();" class="btn-flat toast-action">  <i class="material-icons">close</i></button>'
    });
    $(".avtr")[0].src = json.avatar;
$(".avtr")[1].src = json.avatar;
$("h3")[0].innerHTML = (json.name);
$("#editNameInp").val(json.name);
}