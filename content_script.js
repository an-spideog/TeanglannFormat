// Put all the javascript code here, that you want to execute after page load.


// Loading Variant Data
async function fetchVariants() {
  const response = await fetch(browser.runtime.getURL("variants_full.json"));
  const variants = await response.json();
  return variants;
}

function uneclipse(string) {
  if ( ['mb', 'gc', 'nd', 'n-', 'ng', 'bp', 'dt'].includes(string.slice(0, 2)) ) {
    return string.slice(1);
  }
  if (string.slice(0, 3) == 'bhf') {
    return string.slice(2);
  }
  
  return string;
}

function delenite(string) {
  if (string[1] == 'h') {
    return string[0] + string.slice(2);
  }

  return string;
}

function removeH(string) {
  if (string[0] == 'h') {
    return string.slice(1);
  }

  return string;
}

function insertLineBreakAfter(node) {
  node.appendChild(document.createElement("br"))
}

function insertLineBreakBefore(node) {
  node.parentNode.insertBefore(document.createElement("br"), node)
}

const PREPOSITIONS = ["i", "in", "le", "do", "de", "ar", "faoi", 'um', 'go'];
const ECLIPSING = ['i'];
const LENITING = ['ar', 'do', 'de', 'ar', 'faoi', 'um'];
const H_PREFIXING = ['le'];

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

  var entries = topArea.getElementsByClassName("fgb entry")
  for (let entry of entries) {
    word = entry.getElementsByClassName("fgb title")[0].textContent.trim().replace(/(.*),/g, '$1')
    let shouldReplaceWord = true;
    let split = word.split(' ');
      
    // FGB -----

    // Special Exceptions:
    if (split.length > 1) {
      if ( ECLIPSING.includes(split[0]) ) {
        word = uneclipse(split[1]);
      } else if ( H_PREFIXING.includes(split[0]) ) {
        word = removeH(split[1]);
      } else if ( LENITING.includes(split[0]) ) {
        word = delenite(split[1]);
      } else if ( PREPOSITIONS.includes(split[0]) ) {
        word = split[1];
      } else if ( !PREPOSITIONS.includes(split[0]) ) {
        word = split[0]
      } else {
        shouldReplaceWord = false; // Don't replace the tildes if something has gone wrong
      }
    }
    if (entry.getElementsByClassName("fgb title")[0].nextElementSibling.className == "fgb x") {
      number = entry.getElementsByClassName("fgb x")[0].textContent
      key = word + number
    } else {
      key = word
    }
    if (variants[key.toLowerCase()]) {
      var list = variants[key.toLowerCase()]
      list_string = list.join(", ");
      insertLineBreakAfter(entry)
      entry.appendChild(document.createTextNode("Possible variants: " + list_string))
    }

    var bolds = entry.getElementsByClassName("fgb b clickable")
    for (let bold of bolds) {
    var textContent = bold.textContent
    if (shouldReplaceWord) {
      textContent = textContent.replace(/[A-Z]~/g, word[0].toUpperCase() + word.substring(1));
      textContent = textContent.replace(/~/g, word) 
    }
    bold.textContent = textContent

    // Numbered definition groups are split with a line break
    var startsWithDigit = textContent[0].match(/\d/)
    if (startsWithDigit) {
      insertLineBreakBefore(bold)
    }
  }

  var regulars = entry.getElementsByClassName("fgb r clickable")
  for (let regular of regulars) {
    if (regular.innerText.length > 1 && regular.innerText.match(/.*[\.!?]/)) {
         insertLineBreakAfter(regular)
    }
  }

  var italics = entry.getElementsByClassName("fgb i clickable")
  for (let italic of italics) {
    var textContent = italic.textContent
    if (shouldReplaceWord) {
      textContent = textContent.replace(/[A-Z]~/, word[0].toUpperCase() + word.substring(1));
      textContent = textContent.replace("~", word)
    }
   
    italic.textContent = textContent
  }

  var letters = entry.getElementsByClassName("fgb l")
  for (let letter of letters) {
    if (letter.innerText === "a") {
      var paren = letter.previousSibling
          if (paren.nodeValue == "(") {
         if (paren.previousSibling.lastChild && paren.previousSibling.lastChild.nodeName !== "BR") {
          insertLineBreakBefore(paren)
          }
      }
    }
  }
    
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

  // EID ----
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

  // AFB ----
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
