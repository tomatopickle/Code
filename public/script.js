var css;
var html;
var js;
var userData;
var autoRun = false;
var minimap = false;
var autoClearConsole = false;
var fileOwned = false;
var lang = "js";
//html.updateOptions({"fontSize":"50px"})
if (localStorage.getItem("backUp")) {
    var backUp = JSON.parse(localStorage.getItem("backUp"));
}
var file = location.search.replace("?", "");

setTimeout(function() {
    html.focus()
}, 500)

function getBlobURL(code, type) {
    const blob = new Blob([code], {
        type
    })
    return URL.createObjectURL(blob)
}
html = monaco.editor.create(document.getElementById('htmlEditor'), {
    value: "<!--HTML here-->",
    language: 'html',
    automaticLayout: true,
    theme: 'vs-dark',
    value: backUp ? backUp.html : "",
    formatOnPaste: true,
    formatOnType: true,
    formatOnInput: true,
    minimap: {
        enabled: false
    }
});
css = monaco.editor.create(document.getElementById('cssEditor'), {
    value: "/*CSS here*/",
    language: 'css',
    automaticLayout: true,
    theme: 'vs-dark',
    value: backUp ? backUp.css : "",
    formatOnType: true,
    formatOnPaste: true,
    formatOnInput: true,
    minimap: {
        enabled: false
    }
});
js = monaco.editor.create(document.getElementById('jsEditor'), {
    value: "//javascript here",
    language: 'javascript',
    automaticLayout: true,
    theme: 'vs-dark',
    formatOnType: true,
    formatOnInput: true,
    formatOnPaste: true,
    value: backUp ? backUp.js : "",
    minimap: {
        enabled: false
    }
});
//indentSize
var fontSize = localStorage.getItem("fontSize");
fontSize = fontSize ? fontSize : "14px";
html.updateOptions({
    "fontSize": `${fontSize}px`
});
css.updateOptions({
    "fontSize": `${fontSize}px`
});
js.updateOptions({
    "fontSize": `${fontSize}px`
});
if (localStorage.getItem("light") == "true") {
    toggleDarkMode();
    monaco.editor.setTheme('vs-light');
    document.querySelector("#darkModeToggle").checked = false;
}
if (localStorage.getItem("autoRun") == "true") {
    toggleAutoRun();
    document.querySelector("#autoRunToggle").checked = true;
}
if (localStorage.getItem("lang") == "python") {
    toggleBrython();
    document.querySelector("#brythonToggle").checked = true;
} else {
    document.querySelector("#brythonToggle").checked = false;
}
if (localStorage.getItem("minimap") == "true") {
    toggleMinimap();
    document.querySelector("#autoRunToggle").checked = true;
}
if (localStorage.getItem("autoClearConsole") == "true") {
    toggleAutoClearConsole();
    document.querySelector("#autoClearConsoleToggle").checked = true;
}
if (file) {
    getDocs(file);
    $("#link").html(`https://code.abaanshanid.repl.co/sites/${file}.html`);
    document.querySelector(".frameOpts").style.display = "block"
    document.querySelector("#linkHref").href = `https://code.abaanshanid.repl.co/sites/${file}.html`;
    if (userData) {
        userData.files.forEach(function(item) {
            if (item.file === file) {
                fileOwned = true;
            }
        });
        if (!fileOwned) {
            html.updateOptions({
                readOnly: true
            });
            js.updateOptions({
                readOnly: true
            });
            css.updateOptions({
                readOnly: true
            });
        }
    } else {
        html.updateOptions({
            readOnly: true
        });
        js.updateOptions({
            readOnly: true
        });
        css.updateOptions({
            readOnly: true
        });
        $("#saveBtn").html("Fork");
    }
}

function addUp() {
    if (autoClearConsole) {
        $('#console').html('');
    }
    var htmlCode = html.getValue();
    var cssCode = css.getValue();
    var jsCode = js.getValue();
    if (lang != "python") {
        htmlCode += `
<meta http-equiv="Content-type" content="text/html;charset=UTF-8">
  <script>
var log = console.log;
console.log = function (m) {
    log(m)
    window.parent.document.getElementById('console').innerHTML +=  "<div class='info'>"+m+"</div><hr>"; 
}
</script>
  <style>${cssCode}</style><script defer>
  try{
  ${jsCode}
  }catch(err){
    window.parent.document.getElementById('console').innerHTML +=  "<div class='err'>"+err+"</div><hr>";
  }
  </script>
  `;
    } else {
        htmlCode += `
  <html>
  <head>
<meta http-equiv="Content-type" content="text/html;charset=UTF-8">
<script src="https://cdnjs.cloudflare.com/ajax/libs/brython/3.9.1/brython.min.js"></script>
<script src='https://cdnjs.cloudflare.com/ajax/libs/brython/3.9.1/brython_stdlib.min.js'></script>
</head>
<body onload="brython()">
  <script>
var log = console.log;
console.log = function (m) {
    log(m)
    window.parent.document.getElementById('console').innerHTML +=  "<div class='info'>"+m+"</div><hr>"; 
}

var warn = console.warn;
console.warn = function (m) {
    warn(m)
    window.parent.document.getElementById('console').innerHTML +=  "<div class='err'>"+m+"</div><hr>"; 
}
</script>
  <style>${cssCode}</style>
  <script defer  type="text/python">${jsCode}</script>
  </body>
  </html>
  `;
    }
    document.getElementById("pre").src = getBlobURL(htmlCode);
    if (!autoRun) {
        M.toast({
            html: '<span>Code executed</span> <button style="color:white !important" onclick="M.Toast.dismissAll();" class="btn-flat toast-action">  <i class="material-icons">close</i></button>',
            displayLength: 1000
        });
    }

};
document.getElementById("pre").src = getBlobURL(`Click the run button or press Ctrl+S to execute code. Make sure to add the <html> tag in the beginning`);
Split(['#left', '#right'], {
    sizes: [70, 30],
});
Split(['#prePrnt', '#preConsole'], {
    direction: 'vertical',
    sizes: [75, 25],
    cursor: 'row-resize'
});
//intializing all Materilaize CSS stuff
M.Tabs.init(document.querySelector(".tabs"));
M.AutoInit();
var elems = document.querySelectorAll('.modal');
M.Modal.init(elems);
M.updateTextFields();

function handleKeyUp(e) {

    if (e.ctrlKey == true && e.key == "r") {
        e.preventDefault()
        addUp();
    } else if (e.ctrlKey == true && e.key == "s") {
        e.preventDefault()
        document.querySelector("#saveBtn").click();
    }
}

function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    var name = profile.getName();
    var avtr = profile.getImageUrl();
    var email = profile.getEmail();
    var json = {};
    json.email = email;
    json.avatar = avtr;
    json.name = name;
    $.get('https://code.abaanshanid.repl.co/verify', json, function(data, textStatus, jqXHR) {
        localStorage.setItem("acc", JSON.stringify(json));
        userData = json;
        document.querySelector("#saveBtn").dataset.tooltip = "Ctrl + S";
        document.querySelector("#saveBtn").classList.remove("disabled")
    });
}
window.addEventListener("unload", function() {
    var htmlCode = html.getValue();
    var cssCode = css.getValue();
    var jsCode = js.getValue();
    html += `<meta http-equiv="Content-type" content="text/html;charset=UTF-8">`;
    var json = {
        "html": htmlCode,
        "js": jsCode,
        "css": cssCode
    };
    localStorage.setItem("backUp", JSON.stringify(json))
});

function save() {
    var htmlCode = html.getValue();
    var cssCode = css.getValue();
    var jsCode = js.getValue();
    if (lang != "python") {
        htmlCode += `

  <style>${cssCode}</style><script defer>${jsCode}</script>
  `;
    } else {
        `<html>
  <head>
<meta http-equiv="Content-type" content="text/html;charset=UTF-8">
<script src="https://cdnjs.cloudflare.com/ajax/libs/brython/3.9.1/brython.min.js"></script>
<script src='https://cdnjs.cloudflare.com/ajax/libs/brython/3.9.1/brython_stdlib.min.js'></script>
</head>
<body onload="brython()">
  <style>${cssCode}</style>
  <script defer  type="text/python">${jsCode}</script>
  </body>
  </html>`
    }
    $('#htmlFile').val(htmlCode);
    $.ajax({
        type: 'POST',
        url: 'https://code.abaanshanid.repl.co/save',
        data: htmlCode
    }).done(function(data) {
        ;
        var json = userData;
        json.file = data;
        json.fileName = $("#fileName").val();
        M.toast({
            html: '<span>Saved</span><button style="color:white !important" onclick="M.Toast.dismissAll();" class="btn-flat toast-action">  <i class="material-icons">close</i></button>',
            classes: 'green darken-1'
        });
        $.get('https://code.abaanshanid.repl.co/addToUserFile', json, function(data, textStatus, jqXHR) {
            ;
            document.querySelector("#saveBtn").classList.add("disabled");
            $("#saveBtn").html("Update");
            file = json.file;
            html.updateOptions({
                readOnly: false
            });
            js.updateOptions({
                readOnly: false
            });
            css.updateOptions({
                readOnly: false
            });
            document.querySelector("#saveBtn").onclick = update;
        });
    });
}

function editorInpt() {
    if (userData) {
        document.querySelector("#saveBtn").classList.remove("disabled");
    }
    if (autoRun) {
        addUp();
    }
}
var json = JSON.parse(localStorage.getItem("acc"));
$.get('https://code.abaanshanid.repl.co/user', json, function(data, textStatus, jqXHR) {
    localStorage.setItem("accFull", data);
    userData = JSON.parse(data);
    check();
});
userData = localStorage.getItem("accFull");

function check() {
    if (file) {
        userData.files.forEach(function(item) {
            if (item.file == file) {
                document.querySelector("#fileName").value = item.fileName
                document.querySelector("#saveBtn").classList.add("disabled");
                $("#saveBtn").html("Update");
                html.updateOptions({
                    readOnly: false
                });
                js.updateOptions({
                    readOnly: false
                });
                css.updateOptions({
                    readOnly: false
                });
                document.querySelector("#saveBtn").onclick = update;
            }
        })
    }
}

function getDocs(fileName) {
    $.get("https://code.abaanshanid.repl.co/sites/" + fileName + ".html", function(data) {
        var parser = new DOMParser();
        var htmlDoc = parser.parseFromString(data, 'text/html');
        var cssCode = htmlDoc.getElementsByTagName("style")[htmlDoc.getElementsByTagName("style").length - 1].innerHTML;
        var jsCode = htmlDoc.getElementsByTagName("script")[htmlDoc.getElementsByTagName("script").length - 1].innerHTML;
        css.setValue(cssCode);
        js.setValue(jsCode);
        htmlDoc.getElementsByTagName("script")[htmlDoc.getElementsByTagName("script").length - 1].remove();
        htmlDoc.getElementsByTagName("style")[htmlDoc.getElementsByTagName("style").length - 1].remove();
        html.setValue(htmlDoc.children[0].outerHTML);
    })
}

function update() {
    createCookie("file", file, 1);
    var htmlCode = html.getValue();
    var cssCode = css.getValue();
    var jsCode = js.getValue();
    if (lang != "python") {
        htmlCode += `
  <style>${cssCode}</style><script defer>${jsCode}</script>
  `;
    } else {
        htmlCode = `<html>
  <head>
<meta http-equiv="Content-type" content="text/html;charset=UTF-8">
<script src="https://cdnjs.cloudflare.com/ajax/libs/brython/3.9.1/brython.min.js"></script>
</head>
<body onload="brython()">
  <style>${cssCode}</style>
  <script defer  type="text/python">${jsCode}</script>
  ${htmlCode}
  </body>
  </html>`;
    }
    $.ajax({
        type: 'POST',
        url: 'https://code.abaanshanid.repl.co/update',
        data: htmlCode
    }).done(function(data) {
        M.toast({
            html: '<span>Updated</span><button style="color:white !important" onclick="M.Toast.dismissAll();" class="btn-flat toast-action">  <i class="material-icons">close</i></button>',
            classes: 'green darken-1'
        });;
        document.querySelector("#saveBtn").classList.add("disabled");
        $("#saveBtn").html("Update");
        document.querySelector("#saveBtn").onclick = update;
        html.updateOptions({
            readOnly: false
        });
        js.updateOptions({
            readOnly: false
        });
        css.updateOptions({
            readOnly: false
        });
    });
}

function createCookie(name, value, days) {
    var expires;
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    } else {
        expires = "";
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

function getLibs(q) {
    $("#libs").html(`
 <div class="preloader-wrapper active">
    <div class="spinner-layer spinner-red-only">
      <div class="circle-clipper left">
        <div class="circle"></div>
      </div><div class="gap-patch">
        <div class="circle"></div>
      </div><div class="circle-clipper right">
        <div class="circle"></div>
      </div>
    </div>
  </div>
`);
    $.get(`https://api.cdnjs.com/libraries?search=${q}&fields=filename,description&limit=5`, function(data) {
        $("#libs").html(``);
        data.results.forEach(function(item, i) {
            $("#libs").append(`
    <li>
        <div class="collapsible-header" onclick="getLib('${item.name}',${i})">${item.name}</div>
        <div class="collapsible-body">
        ${item.description}
        </div>
    </li>
`)
        });

    });
}

function getLib(q, i) {
    $.get(`https://api.cdnjs.com/libraries/${q}?fields=assets,description`, function(data) {
        $(".collapsible-body")[i].innerHTML = `
${data.description}
<br>
Files : 
<br>
 <div class="preloader-wrapper active">
    <div class="spinner-layer spinner-red-only">
      <div class="circle-clipper left">
        <div class="circle"></div>
      </div><div class="gap-patch">
        <div class="circle"></div>
      </div><div class="circle-clipper right">
        <div class="circle"></div>
      </div>
    </div>
  </div>
`;
        var item = data.assets[data.assets.length - 1];
        var html = `
${data.description}
<br>
Files : 
<br>
`
        item.files.forEach(function(file) {
            var linkName = addLibName(file, item.version, q);
            html += `
  <br>
  <button  onclick="addLib('${file}','${item.version}','${q}')" style="color:var(--text-color) !important;width:100% !important;" class = "btn-flat waves-effect tooltipped" data-position="top" data-tooltip="${linkName}" blue-grey darken-4 waves-light">${file}   <i class="material-icons right">add</i></button>`;

        })
        $(".collapsible-body")[i].innerHTML = html;
        var elems = document.querySelectorAll('.tooltipped');
        M.Tooltip.init(elems);
    });
}

function addLib(link, v, q) {
    M.toast({
        html: `<span>${link} added</span> <button style="color:white !important" onclick="M.Toast.dismissAll();" class="btn-flat toast-action">  <i class="material-icons">close</i></button>`,
        displayLength: 1000
    });
    var htmlCode = html.getValue();
    if (link.includes(".js")) {
        link = `<script src='https://cdnjs.cloudflare.com/ajax/libs/${q}/${v}/${link}'></script>`
    } else {
        link = `<link rel="stylesheet" href='https://cdnjs.cloudflare.com/ajax/libs/${q}/${v}/${link}'/>`
    }
    html.setValue(link + `
` + htmlCode);

}

function addLibName(link, v, q) {
    if (link.includes(".js")) {
        link = `https://cdnjs.cloudflare.com/ajax/libs/${q}/${v}/${link}`
    } else {
        link = `https://cdnjs.cloudflare.com/ajax/libs/${q}/${v}/${link}`
    }
    return link;
}

function toggleDarkMode() {
    var body = document.body;
    if (!body.classList.contains("light")) {
        body.classList.add("light");
        localStorage.setItem("light", "true");
        monaco.editor.setTheme('vs-light');
        $(".langLogo")[0].src = "/assets/html-light.png";
        $(".langLogo")[1].src = "/assets/" + lang + "-light.png";
        $(".langLogo")[2].src = "/assets/css-light.png";
        return
    }
    body.classList.remove("light");
    monaco.editor.setTheme('vs-dark');
    $(".langLogo")[0].src = "/assets/html-dark.png";
    $(".langLogo")[1].src = "/assets/" + lang + "-dark.png";
    $(".langLogo")[2].src = "/assets/css-dark.png";
    localStorage.setItem("light", "false");
}

function toggleAutoRun() {
    if (autoRun) {
        autoRun = false;
        localStorage.setItem("autoRun", "false");
        return
    }
    autoRun = true;
    localStorage.setItem("autoRun", "true");
}

function toggleMinimap() {
    if (minimap) {
        minimap = false;
        localStorage.setItem("minimap", "false");
        html.updateOptions({
            minimap: false
        });
        css.updateOptions({
            minimap: false
        });
        js.updateOptions({
            minimap: false
        });
        return
    }
    minimap = true;
    localStorage.setItem("minimap", "true");
    html.updateOptions({
        minimap: true
    });
    css.updateOptions({
        minimap: true
    });
    js.updateOptions({
        minimap: true
    });
}

function toggleAutoClearConsole() {
    if (autoClearConsole) {
        autoClearConsole = false;
        localStorage.setItem("autoClearConsole", "false");
        return
    }
    autoClearConsole = true;
    localStorage.setItem("autoClearConsole", "true");
}

function updateFontSize(val) {
    localStorage.setItem("fontSize", val);
    html.updateOptions({
        "fontSize": `${val}px`
    });
    css.updateOptions({
        "fontSize": `${val}px`
    });
    js.updateOptions({
        "fontSize": `${val}px`
    });
}

function toggleBrython() {
    if (lang == "js") {
        lang = "python";
        localStorage.setItem("lang", "python");
        var theme = localStorage.getItem("light") == "false" ? "dark" : "light"
        var img = "/assets/" + lang + "-" + theme + ".png";
        $(".langLogo")[1].src = img;
        $("#lang").html(lang);
        var model = js.getModel();
        monaco.editor.setModelLanguage(model, "python");
        return
    }
    lang = "js";
    localStorage.setItem("lang", "js");
    var theme = localStorage.getItem("light") == "false" ? "dark" : "light"
    $(".langLogo")[1].src = "/assets/" + lang + "-" + theme + ".png";
    $("#lang").html(lang);
    var model = js.getModel();
    monaco.editor.setModelLanguage(model, "javascript");
}

