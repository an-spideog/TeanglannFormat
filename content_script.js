// Put all the javascript code here, that you want to execute after page load.
// FGB
var word = ""
if (document.getElementsByClassName("eid current").length > 0) {
   word = document.getElementsByClassName("eid src unclickable")[0].innerHTML
} else {
   word = document.getElementsByClassName("fgb title")[0].innerHTML.replace(/([\w|á|é|í|ú|ó|Á|É|Í|Ú|Ó]*).*/, '$1')
}

// Exact Matches
var topArea = document.getElementsByClassName("dir obverse exacts")[0]

console.log(word)
var bolds = topArea.getElementsByClassName("fgb b clickable")
for (let bold of bolds) {
  var currentBold = bold.innerHTML
  currentBold = currentBold.replace(/(<span>[^0-9|])/, '<span> • </span> $1')
  currentBold = currentBold.replace(/([\d]*\. )/, '<br> $1')
  currentBold = currentBold.replace(/~/g, word) 

  bold.innerHTML = currentBold
}
var regulars = topArea.getElementsByClassName("fgb r clickable")
for (let regular of regulars) {
  var currentRegular = regular.innerHTML
  currentRegular = currentRegular.replace(/>[\.|?] *<\/span>/, '>. <br> </span>')
  regular.innerHTML = currentRegular
}

var italics = topArea.getElementsByClassName("fgb i clickable")
for (let italic of italics) {
  var currentItalic = italic.innerHTML
  currentItalic = currentItalic.replace(/(<span.*>[A-Z|Á|É|Í|Ó|Ú|~])/, '<span style="bold"> • </span> $1')
  currentItalic = currentItalic.replace("~", word)
  italic.innerHTML = currentItalic
}

// Phrases in FGB
var bottomArea = document.getElementsByClassName("dir obverse")[2]
var examples = bottomArea.getElementsByClassName("ex")
for (let example of examples) {
  word = example.getElementsByTagName("a")[0].innerHTML.replace(/([^<]*) <span.*/, '$1')
  console.log(word)
  example.innerHTML = example.innerHTML.replace(/~/, word)
  

}

// EID
var entries = document.getElementsByClassName("eid entry")
for (let entry of entries) {
  var currentEntry = entry.innerHTML
  currentEntry = currentEntry.replace(/(<span class="eid sense unclickable">)/g, '<br><br> $1')
  currentEntry = currentEntry.replace(/(<span class="eid subsense unclickable")/g, '<br> $1 style="margin-left: 20px"')
  currentEntry = currentEntry.replace(/(<span class="eid src clickable")/g, '<br> $1 style="margin-left:40px"')
  entry.innerHTML = currentEntry
}
