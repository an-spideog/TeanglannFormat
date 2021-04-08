// Put all the javascript code here, that you want to execute after page load.
/*let dictionary = new Map()
dictionary.set(/( )([\d]\.)/, '\n$2')
dictionary.set(/(\D)(\. [A-Z|Á|É|Í|Ó|Ú])/, '$1\n	$2')

let regexs = new Map()
regexs.set("numbers", new RegExp('( )([\d]\.)'))*/

/*document.body.div.fgb.entry.color = "green"
document.span.diclick.color = "green"*/
//document.getElementsByClassName("fgb title")[0].style.backgroundColor = "green"
//document.getElementsByClassName("fgb title")[0].innerHTML = "glac <br>"
var word = document.getElementsByClassName("fgb title")[0].innerHTML.replace(/([\w|á|é|í|ú|ó|Á|É|Í|Ú|Ó]*).*/, '$1')

console.log(word)
var bolds = document.getElementsByClassName("fgb b clickable")  //"span" is not a class
for (let bold of bolds) {
  var currentBold = bold.innerHTML
  currentBold = currentBold.replace(/([\d]*\. )/, '<br> $1')
  currentBold = currentBold.replace(/~/g, word)
  currentBold = currentBold.replace(/(<span.*>[a-z|A-Z|á|é|í|ú|ó|Á|É|Í|Ú|Ó|~])/, '<span> • </span> $1')
  bold.innerHTML = currentBold
}
var regulars = document.getElementsByClassName("fgb r clickable")
for (let regular of regulars) {
  var currentRegular = regular.innerHTML
  currentRegular = currentRegular.replace(/>[\.|?] *<\/span>/, '>. <br> </span>')
  regular.innerHTML = currentRegular
}

var italics = document.getElementsByClassName("fgb i clickable")
for (let italic of italics) {
  var currentItalic = italic.innerHTML
  currentItalic = currentItalic.replace(/(<span.*>[A-Z|Á|É|Í|Ó|Ú|~])/, '<span style="bold"> • </span> $1')
  currentItalic = currentItalic.replace("~", word)
  italic.innerHTML = currentItalic
}
