var dictionary=[]; //Known words.
var textBody=[]; //Words on the page.
var textFormats = ['txt']; //Formats to accept text in.
var dictFormats = ['ld3']; //Formats to accept dictionaries in.
var saveFormats = [{ex:'ld3',name:'langfr33'},{ex:'txt',name:'anki with tabs'}];
var formatNames = ['langfr33'];
var oldsavename;
function newText()
{
	//Blank out the rest of the screen
	var blocker = document.createElement('div');
	blocker.setAttribute('class', 'blocker');
	//Popup window
	var popup = document.createElement('div');
	popup.setAttribute('class', 'popup');
	blocker.appendChild(popup);
	//Exit button
	var exit = document.createElement('div');
	exit.setAttribute('class','x');
	exit.setAttribute('onclick','closePopUp()');
	popup.appendChild(exit);
	document.getElementsByTagName('body')[0].appendChild(blocker);
	//Text entry
	var textEntry = document.createElement('textarea');
	textEntry.id='textEntry';
	textEntry.setAttribute('class','textentry');
	textEntry.setAttribute('resize',false);
	textEntry.setAttribute('placeholder','The quick brown fox jumps over the lazy dog...');
	//Info
	var info = document.createElement('h4');
	info.appendChild(document.createTextNode('Paste your text into the area below.'));
	info.style.textAlign = 'center';
	popup.appendChild(info);
	popup.appendChild(textEntry);
	//Accept button
	var acceptButton = document.createElement('input');
	acceptButton.type = 'button';
	acceptButton.setAttribute('onclick','addNewText(document.getElementById(\'textEntry\').value,"Langfr33")');
	acceptButton.value='Load';
	acceptButton.setAttribute('class','acceptButton');
	popup.appendChild(acceptButton);
	document.getElementsByTagName('body')[0].appendChild(blocker);
}
function addNewText(theNewText,titlename)
{
	theNewText = theNewText.replace(/\n/g," \n ");
	theNewText = theNewText.split(" ");
	textBody = theNewText.slice();
	closePopUp();
	//Append options to the top before creating the container.
	var nText = document.createElement('input');
	nText.type = 'button';
	nText.value = 'New text';
	nText.onclick = newText;
	var lText = document.createElement('input');
	lText.type = 'button';
	lText.value = 'Load text';
	lText.onclick = loadText;
	var sDict = document.createElement('input');
	sDict.type = 'button';
	sDict.value = 'Save dictionary';
	sDict.onclick = chooseSaveName;
	sDict.id='saveDictionary';
	var lDict = document.createElement('input');
	lDict.type = 'button';
	lDict.value = 'Load dictionary';
	lDict.onclick = loadDict;
	var cDict = document.createElement('input');
	cDict.type = 'button';
	cDict.value = 'Clear dictionary';
	cDict.onclick = clearDict;
	//Container
	var doc = document.createElement('div');
	doc.id='container';
	doc.style.minHeight='800px';
	doc.style.boxShadow='0px 0px 20px black';
	doc.style.paddingTop='15px';
	doc.style.paddingLeft='30px';
	//Title
	var title=document.createElement('h1');
	title.appendChild(document.createTextNode(titlename));
	title.style.textAlign='center';
	title.paddingBottom='10px';
	doc.appendChild(title);
	for (i = 0; i < theNewText.length; i++)
	{
		if (theNewText[i]=='\n')
		{
			var p = document.createElement('br');
		}
		else
		{
			var p = document.createElement('p');
			p.appendChild(document.createTextNode(theNewText[i]));
			p.setAttribute('class','word');
			p.onclick = wordclick;
			p.onmouseover = wordhover;
			p.onmouseout=clearSuggestions;
		}
		doc.appendChild(p);
	}
	document.getElementsByTagName("body")[0].innerHTML="";
	document.getElementsByTagName("body")[0].style.marginTop="40px";
	document.getElementsByTagName("body")[0].appendChild(nText);
	document.getElementsByTagName("body")[0].appendChild(lText);
	document.getElementsByTagName("body")[0].appendChild(sDict);
	document.getElementsByTagName("body")[0].appendChild(lDict);
	document.getElementsByTagName("body")[0].appendChild(cDict);
	document.getElementsByTagName("body")[0].appendChild(doc);
	highlightKnown();
}
function loadText()
{
	//Blank out the rest of the screen
	var blocker = document.createElement('div');
	blocker.setAttribute('class', 'blocker');
	//Popup window
	var popup = document.createElement('div');
	popup.setAttribute('class', 'popup');
	blocker.appendChild(popup);
	//Exit button
	var exit = document.createElement('div');
	exit.setAttribute('class','x');
	exit.setAttribute('onclick','closePopUp()');
	popup.appendChild(exit);
	//Info
	var info = document.createElement('h4');
	info.appendChild(document.createTextNode('Load a file from your harddrive.'));
	info.style.textAlign = 'center';
	popup.appendChild(info);
	//File dialog
	var fileDialog = document.createElement('input');
	fileDialog.type = 'file';
	fileDialog.id='loadedtext';
	fileDialog.name='files[]';
	popup.appendChild(fileDialog);
	//Accept button
	var acceptButton = document.createElement('input');
	acceptButton.type = 'button';
	acceptButton.setAttribute('onclick','loadNewText()');
	acceptButton.value='Load';
	acceptButton.setAttribute('class','acceptButton');
	popup.appendChild(acceptButton);
	document.getElementsByTagName('body')[0].appendChild(blocker);
	//Accepted formats
	var acceptedFormats= document.createElement('p');
	acceptedFormats.appendChild(document.createTextNode('Acceptable file formats:'));
	acceptedFormats.style.display='block';
	var types = document.createElement('p');
	for (i = 0; i < textFormats.length; i++)
	{
		types.appendChild( document.createTextNode('.'+textFormats[i]+' ') );
	}
	types.style.fontWeight = 'bold';
	popup.appendChild(acceptedFormats);
	popup.appendChild(types);
}
function loadNewText()
{
	//Clear error message.
	if (document.getElementById('error'))
		document.getElementById('error').outerHTML='';
	var file = document.getElementById('loadedtext');
	var reader = new FileReader();
	if (file.files[0])
	{
		var fileName = file.files[0].name;
		fileName = fileName.split('.');
		var fileExtension = fileName[fileName.length-1];
		fileName = fileName.splice(fileName.length,1);
		fileName=fileName.join('.');
		if (textFormats.indexOf(fileExtension) != -1)
		{
			var contents = reader.readAsText(file.files[0]);
			reader.onload = function(theFile)
			{
					var result = theFile.currentTarget.result;
					addNewText(result,file.files[0].name);
			};
		}
		else
		{
			//Not a valid format
			var popup=document.getElementsByClassName('popup')[0];
			if (popup)
			{
				var error = document.createElement('b');
				error.style.color='red';
				error.id='error';
				error.appendChild(document.createTextNode('.'+fileExtension+' is not supported, sorry!'));
				popup.insertBefore(error,popup.firstChild);
			}
			else
			{
				alert('.'+fileExtension+' is not supported, sorry!');
			}
		}
	}
	else
	{
		//Empty.		
		var popup=document.getElementsByClassName('popup')[0];
		var error = document.createElement('b');
		error.style.color='red';
		error.id='error';
		error.appendChild(document.createTextNode('Please choose a file to load.'));
		popup.insertBefore(error,popup.firstChild);
	}
}
function loadNewDict()
{
	//Clear error message.
	if (document.getElementById('error'))
		document.getElementById('error').outerHTML='';
	var file = document.getElementById('loadedtext');
	var reader = new FileReader();
	if ( file.files[0])
	{
		var contents = reader.readAsText(file.files[0]);
		//Check that a valid format is being used.
		var fileName = file.files[0].name;
		fileName = fileName.split('.');
		var fileExtension = fileName[fileName.length-1];
		fileName = fileName.splice(fileName.length,1);
		fileName=fileName.join('.');
		if (dictFormats.indexOf(fileExtension) != -1)
		{
			reader.onload = function(theFile)
			{
					var result = theFile.currentTarget.result;
					var temp = result.split("#");
					for (i = 0; i < temp.length; i++)
					{
						temp[i]=temp[i].split('/');
						if (temp[i][0][0] == '`') //easy word
						{
							temp[i][0]=temp[i][0].substring(1,temp[i][0].length);
							dictionary[temp[i][0]] = {
								word:temp[i][1],
								difficulty:false
								};
						}
						else if (temp[i][0][0] == '!') //difficult word
						{
							temp[i][0]=temp[i][0].substring(1,temp[i][0].length);
							dictionary[temp[i][0]] = {
								word:temp[i][1],
								difficulty:true
								};
						}
						else
						{
							alert('Error! Could not find single letter identifier in word '+temp[i][0]+'. Needs to begin with either ! or `.');
						}
					}
			
					var bounds = document.getElementById('go').getBoundingClientRect();
					floaty(bounds.left,bounds.top,"Loaded Dictionary!",'18px','green');
					var oldsavename=file.files[0].name;
					oldsavename=oldsavename.split('.');
					oldsavename=oldsavename.splice(oldsavename.length,1);
					oldsavename=oldsavename.join('.');
					closePopUp();
					highlightKnown();		
			};
		}
		else
		{
			//Not a valid format
			var popup=document.getElementsByClassName('popup')[0];
			if (popup)
			{
				var error = document.createElement('b');
				error.style.color='red';
				error.id='error';
				error.appendChild(document.createTextNode('.'+fileExtension+' is not supported, sorry!'));
				popup.insertBefore(error,popup.firstChild);
			}
			else
			{
				alert('.'+fileExtension+' is not supported, sorry!');
			}
		}
	}
	else
	{
		//Empty.
		var popup=document.getElementsByClassName('popup')[0];
		var error = document.createElement('b');
		error.style.color='red';
		error.id='error';
		error.appendChild(document.createTextNode('Please choose a file to load.'));
		popup.insertBefore(error,popup.firstChild);
	}
}

function clearDict(e)
{
	dictionary=[];
	var bounds = (e.toElement||e.target).getBoundingClientRect();
	floaty(bounds.left,bounds.top-20,"Reset Dictionary!",'18px','green');
	highlightKnown();
}
function chooseSaveName(e)
{
	//Blank out the rest of the screen
	var blocker = document.createElement('div');
	blocker.setAttribute('class', 'blocker');
	document.getElementsByTagName('body')[0].appendChild(blocker);
	//Popup window
	var popup = document.createElement('div');
	popup.setAttribute('class', 'popup');
	blocker.appendChild(popup);
	//Exit button
	var exit = document.createElement('div');
	exit.setAttribute('class','x');
	exit.setAttribute('onclick','closePopUp()');
	popup.appendChild(exit);
	//Info
	var info = document.createElement('h4');
	info.appendChild(document.createTextNode('Save the dictionary file.'));
	info.style.textAlign = 'center';
	popup.appendChild(info);
	//Text input.
	var name = document.createElement('input');
	if (oldsavename) name.value=oldsavename;
	name.id='name';
	popup.appendChild(name);
	var chooseFileType = document.createElement('select');
	chooseFileType.id='extension';
	for (i = 0; i < saveFormats.length; i++)
	{
		var opt = document.createElement('option');
		opt.value='.'+saveFormats[i];
		opt.appendChild(document.createTextNode('.'+saveFormats[i].ex+" ("+saveFormats[i].name+")"));
		chooseFileType.appendChild(opt);
	}
	popup.appendChild(chooseFileType);
	//Slider
	var slider = document.createElement('input');
	slider.type='range';
	slider.style.display='block';
	slider.step='50';
	slider.style.marginTop="8px";
	slider.style.marginBottom="8px";
	slider.style.marginRight='8px';	
	slider.onchange = function()
	{
		var info=document.getElementById('information');
		switch (slider.value)
		{
			case "0":
				info.innerHTML="Save only easy words.";
			break;
			case "50":
				info.innerHTML="Save all words.";		
			break;
			case "100":
				info.innerHTML="Save only hard words.";
			break;
		}
	};
	popup.appendChild(slider);
	//Info
	var info = document.createElement('h5');
	info.id='information';
	info.appendChild(document.createTextNode("Save all words."));
	popup.appendChild(info);
	//Save button
	var saveButton = document.createElement('input');
	saveButton.type='button';
	saveButton.id='go';	
	saveButton.value='Save';
	saveButton.style.background='green';
	saveButton.style.borderRadius='8px';
	saveButton.style.display='block';
	saveButton.style.marginTop='8px';
	popup.appendChild(saveButton);
	saveButton.onclick=function()
	{
		var entername=document.getElementById('name').value;
		var ext=document.getElementById('extension').selectedIndex;

		saveDict(entername,ext,(slider.value/50));
		var bounds = (e.toElement || e.target).getBoundingClientRect();
		floaty(bounds.left,bounds.top,"Saved Dictionary!",'18px','green');
	};
}
function saveDict(name,ext,options)
{
	var save = "";
	for (i in dictionary)
	{
		switch (ext)
		{
			case 0: //Langfr33 format with difficulty indicators.
				if ((options==1  || options == 0) && !dictionary[i].difficulty)
				{
					save+='`'+i+'/'+dictionary[i].word+"#";									
				}
				else if ((options==1  || options == 2) && dictionary[i].difficulty)
				{
					save+='!'+i+'/'+dictionary[i].word+"#";
				}
			break;
			case 1: //Anki format, tabs and newlines.
				if (options==1  || (options == 0 && !dictionary[i].difficulty) || (options == 2 && dictionary[i].difficulty))
				{
					save+=i+'\t'+dictionary[i].word+"\n";
				}
			break;
		}
	}
	name+="."+saveFormats[ext].ex;
	save = save.substring(0,save.length-1);
	var blob = new Blob([save], {type: "text/plain;charset=utf-8"});
	saveAs(blob, name);
}
function loadDict()
{
	//Blank out the rest of the screen
	var blocker = document.createElement('div');
	blocker.setAttribute('class', 'blocker');
	//Popup window
	var popup = document.createElement('div');
	popup.setAttribute('class', 'popup');
	blocker.appendChild(popup);
	//Exit button
	var exit = document.createElement('div');
	exit.setAttribute('class','x');
	exit.setAttribute('onclick','closePopUp()');
	popup.appendChild(exit);
	//Info
	var info = document.createElement('h4');
	info.appendChild(document.createTextNode('Load a dictionary file from your harddrive. This does not clear the current dictionary.'));
	info.style.textAlign = 'center';
	popup.appendChild(info);
	//File dialog
	var fileDialog = document.createElement('input');
	fileDialog.type = 'file';
	fileDialog.id='loadedtext';
	fileDialog.name='files[]';
	popup.appendChild(fileDialog);
	//Accept button
	var acceptButton = document.createElement('input');
	acceptButton.type = 'button';
	acceptButton.setAttribute('onclick','loadNewDict()');
	acceptButton.value='Load';
	acceptButton.id='go';
	acceptButton.setAttribute('class','acceptButton');
	popup.appendChild(acceptButton);
	document.getElementsByTagName('body')[0].appendChild(blocker);
	//Accepted formats
	var acceptedFormats= document.createElement('p');
	acceptedFormats.appendChild(document.createTextNode('Acceptable file formats:'));
	acceptedFormats.style.display='block';
	var types = document.createElement('p');
	for (i = 0; i < dictFormats.length; i++)
	{
		types.appendChild( document.createTextNode('.'+dictFormats[i]+' ') );
	}
	types.style.fontWeight = 'bold';
	popup.appendChild(acceptedFormats);
	popup.appendChild(types);
}
function closePopUp()
{
	var blocker= document.getElementsByClassName('blocker')[0];
	if (blocker)
	{
		blocker.outerHTML="";
	}
}
function wordhover(e)
{
	if ((e.toElement||e.target).children.length === 0) //If the word popup is not on this one.
	{
		clearSuggestions();
		var suggestword = document.createElement('div');
		var word = strip( (e.toElement||e.target).innerHTML );
		if (dictionary[word])
		{
			var dictword = dictionary[word].word;
			suggestword.setAttribute('class','suggestion');
			var p = document.createElement('h5');
			p.appendChild(document.createTextNode(dictword));
			suggestword.appendChild(p);
			(e.toElement||e.target).insertBefore(suggestword,e.toElement.firstChild);
		}
	}
}
function wordclick(e)
{
	if ((e.toElement||e.target).tagName == 'P') //If the word popup is not on this one.
	{
		clearSuggestions();
		closeWordPopup(); //Clear any previously opened popups.
		var word = (e.toElement||e.target);
		var theWord = strip(word.innerHTML);
		word.style.border='1px yellow solid';
		var wordpop = document.createElement('div');
		wordpop.style.color='black';
		wordpop.setAttribute('class','wordpop');		
		word.insertBefore(wordpop,word.firstChild);
		if (dictionary[theWord])
		{
			var diff=dictionary[theWord].difficulty;
			//Word in dictionary already.
			var translation=dictionary[theWord].word;
			var topinfo=document.createElement('h5');
			topinfo.style.marginTop = '5px';
			topinfo.style.marginBottom = '5px';
			topinfo.appendChild(document.createTextNode(translation));
			topinfo.style.textAlign = 'center';
			//Change difficulty
			var changeDifficulty = document.createElement('input');
			changeDifficulty.type='button';
			changeDifficulty.style.borderRadius='8px';
			changeDifficulty.style.display='block';
			changeDifficulty.style.marginLeft='auto';
			changeDifficulty.style.marginRight='auto';
			if (!diff)
			{
				topinfo.style.color = 'green';
				changeDifficulty.style.background = 'orange';
				changeDifficulty.value='Set hard';
			}
			else
			{				
				topinfo.style.color = 'orange';	
				changeDifficulty.style.background = 'green';
				changeDifficulty.value='Set easy';	
			}
			wordpop.appendChild(topinfo);
			var info=document.createElement('h5');
			info.style.marginTop = '5px';
			info.style.marginBottom = '5px';
			info.appendChild(document.createTextNode("Edit?"));
			info.style.textAlign = 'center';
			wordpop.appendChild(info);
			//Input box
			var input = document.createElement('input');
			input.setAttribute('id','newword');
			input.style.width = '60%';
			input.style.marginLeft = '5px';
			input.style.borderRadius = '4px';
			input.value = translation;
			wordpop.appendChild(input);
			//Save button
			var saveButton = document.createElement('input');
			saveButton.type='button';
			saveButton.id='go';
			saveButton.onclick=function()
			{
					saveWord(theWord,diff);
			};		
			saveButton.value='Save';
			saveButton.style.background='green';
			saveButton.style.borderRadius='8px';
			saveButton.style.display = 'inline-block';
			wordpop.appendChild(saveButton);	
			wordpop.appendChild(changeDifficulty);		
			changeDifficulty.onclick = function()
			{
				diff = !diff;
				if (!diff)
				{
					topinfo.style.color = 'green';
					changeDifficulty.style.background = 'orange';
					changeDifficulty.value='Set hard';
				}
				else
				{				
					topinfo.style.color = 'orange';		
					changeDifficulty.style.background = 'green';
					changeDifficulty.value='Set easy';
				}
			};
			wordpop.appendChild(changeDifficulty);
		}
		else
		{
			//Unknown word.
			var info=document.createElement('h5');
			info.style.marginTop = '5px';
			info.style.marginBottom = '5px';
			info.appendChild(document.createTextNode('Word not known.'));
			wordpop.appendChild(info);
			info=document.createElement('h5');
			info.style.marginTop = '5px';
			info.style.marginBottom = '5px';			
			info.appendChild(document.createTextNode('Add now?'));
			wordpop.appendChild(info);
			//Input box
			var input = document.createElement('input');
			input.setAttribute('id','newword');
			input.style.width = '90%';
			input.style.marginLeft = '5px';
			input.style.borderRadius = '4px';
			wordpop.appendChild(input);
			//Easy button
			var saveButton = document.createElement('input');
			saveButton.id='go';
			saveButton.type='button';
			saveButton.setAttribute('onclick','saveWord("'+theWord+'",false)');		
			saveButton.value='Easy';
			saveButton.style.width="50%";
			saveButton.style.background='green';
			saveButton.style.borderRadius='8px';
			saveButton.style.display = 'inline-block';
			wordpop.appendChild(saveButton);
			//Hard button
			var hardButton = document.createElement('input');
			hardButton.id='go';
			hardButton.type='button';
			hardButton.setAttribute('onclick','saveWord("'+theWord+'",true)');		
			hardButton.value='Hard';
			hardButton.style.width="50%";
			hardButton.style.background='orange';
			hardButton.style.borderRadius='8px';
			hardButton.style.display = 'inline-block';
			wordpop.appendChild(hardButton);
		}
		//Exit button
		var exit = document.createElement('div');
		exit.setAttribute('class','x');
		exit.setAttribute('onclick','closeWordPopup()');
		wordpop.appendChild(exit);
		//Setup enter to press the button.
		input.onkeydown= function(e)
		{
			if (e.keyCode==13)
			{
				document.getElementById('go').click();
			}
		}
		//Focus the text field
		document.getElementById('newword').focus();
	}
}
function saveWord(word,difficulty)
{
	var newword = document.getElementById('newword').value;
	if (newword!="")
	{
		dictionary[word] = {
			word:newword,
			difficulty:difficulty
		};
	}
	else
	{
		dictionary[word] = undefined;
	}
	//Floaty Saved thing
	var bounds = document.getElementById('go').getBoundingClientRect();
	floaty(bounds.left,bounds.top,"Saved!",'18px','green');
	closeWordPopup();
	highlightKnown();
}
function floaty(x,y,text,size,color)
{
	var floaty=document.createElement('h5');
	floaty.appendChild(document.createTextNode(text));
	floaty.style.fontSize = size;
	floaty.style.color = color;
	floaty.style.margin='0px';
	floaty.style.padding='0px';
	floaty.style.left = x+'px';
	floaty.style.top = y+'px';
	floaty.style.display = 'block';
	floaty.style.position = 'absolute';
	floaty.style.opacity=1;
	document.getElementsByTagName('body')[0].appendChild(floaty);
	shift = function(floaty)
	{
		floaty.style.opacity-=0.1
		if (floaty.style.opacity>0)
		{
			setTimeout(function(){shift(floaty)},100);
		}
		else
		{
			floaty.outerHTML="";
		}
	}
	shift(floaty);
}
function closeWordPopup()
{
	var wordpop = document.getElementsByClassName('wordpop')[0];
	if (wordpop)
	{
		wordpop.parentNode.style.border = 'none';
		wordpop.outerHTML="";
	}
}
function highlightKnown()
{
	var words = document.getElementById('container');
	for (i = 0; i < textBody.length; i++)
	{
		if (dictionary[strip(textBody[i])])
		{
			if (!dictionary[strip(textBody[i])].difficulty)
			{
				words.children[i+1].style.color='green';
			}
			else
			{
				words.children[i+1].style.color='orange';
			}
		}
		else
		{
			words.children[i+1].style.color='black';
		}
	}
}
function strip(str)
{
	str=str.toLowerCase();
	return (str.replace(/[?!-:;.~]/g,''));
}
function clearSuggestions()
{
	var suggestion = document.getElementsByClassName('suggestion')[0];
	if (suggestion)
	{
		suggestion.outerHTML="";
	}
}
