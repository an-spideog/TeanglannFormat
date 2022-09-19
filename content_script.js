// Put all the javascript code here, that you want to execute after page load.


// Loading Variant Data
async function fetchVariants() {
  const response = await fetch(browser.runtime.getURL("variants_full.json"));
  const variants = await response.json();
  return variants;
}

const prepositions = ["i", "in", "le", "do", "de", "ar", "faoi"]
const mutating = ["i", "le",]

fetchVariants().then(variants => {

  var topArea = document.getElementsByClassName("dir obverse exacts")[0]
  var word = ""
  if (document.getElementsByClassName("eid current").length > 0) {
     word = document.getElementsByClassName("eid src unclickable")[0].innerHTML
  } else if (document.getElementsByClassName("fgb entry").length > 0) {
     word = document.getElementsByClassName("fgb title")[0].textContent.trim().replace(/(.*),/g, '$1')
  } else {
    word = document.getElementsByClassName("fb headword clickable")[0].textContent.trim()
  }
  let last_word = word.split(' ')[word.split(' ').length - 1] 
  if (prepositions.indexOf(last_word) > -1) {
    word = word.split(' ')[0]
  } 

  if (mutating.indexOf(word.split(' ')[0]) > -1) {
    var mutated = word.split(' ').slice(1, (word.split(' ').length)).join(" ")
    word = mutated.slice(1, (mutated.length - 1))
}
    

  // Special Exceptions:
  if (word == "i gceann" || word == "ar ceann" || word == "de cheann" || word == "go ceann" || word == "um cheann") {
    word = "ceann"
  } else if (word == "le haghaidh" || word == "in aghaidh" || word == "ar aghaidh") {
    word = "aghaidh"
  } else if (word == "in airde") {
    word = "airde"
  } 


  // FGB

  /// Variants
  var entries = topArea.getElementsByClassName("fgb entry")
  for (let entry of entries) {
    if (entry.getElementsByClassName("fgb title")[0].nextElementSibling.className == "fgb x") {
      number = entry.getElementsByClassName("fgb x")[0].textContent
      key = word + number
    } else {
      key = word
    }
    if (variants[key.toLowerCase()]) {
      var list = variants[key.toLowerCase()]
      list_string = list.join(", ");
      entry.appendChild(document.createElement("br"))
      entry.appendChild(document.createTextNode("Possible variants: " + list_string))
    }
  
  }


  var bolds = topArea.getElementsByClassName("fgb b clickable")
  for (let bold of bolds) {
    var textContent = bold.textContent
    textContent = textContent.replace(/[A-Z]~/g, word[0].toUpperCase() + word.substring(1));
    textContent = textContent.replace(/~/g, word) 
    bold.textContent = textContent

    var currentBold = bold.innerHTML
    //currentBold = currentBold.replace(/(<span>[^ |1-9])/, '<span> • </span> $1')
    currentBold = currentBold.replace(/([\d]*\. )/, '<br> $1')
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
    //currentItalic = currentItalic.replace(/(<span.*>[A-Z|Á|É|Í|Ó|Ú|~])/, '<span style="bold"> • </span> $1')
    currentItalic = currentItalic.replace(/[A-Z]~/, word[0].toUpperCase() + word.substring(1));
    currentItalic = currentItalic.replace("~", word)
    italic.innerHTML = currentItalic
  }

  /// Phrases in FGB
  if (document.getElementsByClassName("dir obverse").length > 2) {
    var bottomArea = document.getElementsByClassName("dir obverse")[2]
    var examples = bottomArea.getElementsByClassName("ex")
    for (let example of examples) {
      word = example.getElementsByTagName("a")[0].innerHTML.replace(/([^<]*) <span.*/, '$1')
      example.innerHTML = example.innerHTML.replace(/~/, word)
    }
  }
  // EID
  var entries = document.getElementsByClassName("eid entry")
  for (let entry of entries) {
    var senses = entry.getElementsByClassName("eid sense unclickable")
    for (let sense of senses) { 
      breakline = document.createElement("br")
      entry.insertBefore(breakline, sense)
    }

    var subsenses = entry.getElementsByClassName("eid subsense unclickable")
    for (let subsense of subsenses) {
      breakline = document.createElement("br")
      entry.insertBefore(breakline, subsense)
      subsense.style.marginLeft = "20px"
    }   
    var examples = entry.getElementsByClassName("eid example clickable")
    for (let example of examples ) {
      breakline = document.createElement("br")
      entry.insertBefore(breakline, example)
      example.style.marginLeft = "40px"
    }
  }

  // AFB
  var entries = document.getElementsByClassName("fb entry")
  for (let entry of entries) {
    if (entry.getElementsByClassName("fb pos").length > 0) {
      entry.getElementsByClassName("fb pos")[0].appendChild(document.createElement("br"))
    } else {
      entry.getElementsByClassName("fb headword clickable")[0].appendChild(document.createElement("br"))
    }

    var subentries = entry.getElementsByClassName("fb subentry")
    for (let subentry of subentries) {
      entry.insertBefore(document.createElement("br"), subentry)
    }

    var examples = entry.getElementsByClassName("fb example clickable")
    for (let example of examples) {
      if (example.nextElementSibling == null) { // Check if last child
        if (example.parentElement.parentElement.nextElementSibling) { // Check if its parent's parent has a sibling
          if (example.parentElement.parentElement.nextElementSibling.tagName != "BR") { // Is there already a line break
            example.appendChild(document.createElement("br"))
         }
       }
        
      } else {
        example.appendChild(document.createElement("br"))
      }
    }
  }

});