function enterEvent(primaries, new_tab) {
	const focused = find_focused(primaries);
	if (focused.elem.nodeName == 'A') enterLink(focused, new_tab);
	else if (focused.elem == document.querySelector('#duck-searchbox input')) enterDuck(focused, new_tab);
}

function enterLink(focused, new_tab) {
	window.open(focused.elem.getAttribute('href'), new_tab ? '_blank' : '_self');
}

function enterDuck(focused, new_tab) {
	const txt = focused.elem.value;
	if (startsWith(txt, 'ln:')) {
		// go to a direct link (defaults to 'https://')
		const ln = txt.slice(3, txt.length).trim();
		let link = '';

		if (ln.includes('https://') || ln.includes('http://')) link = ln;
		else link = `https://${ln}`;

		window.open(link, new_tab ? '_blank' : '_self');
	} else if (startsWith(txt, 'yt:')) {
		// searches the inputted text in youtube
		const ln = txt.slice(3, txt.length).trim();
		window.open(`https://www.youtube.com/results?search_query=${ln}`, new_tab ? '_blank' : '_self');
	} else if (startsWith(txt, 'goog:')) {
		// searches the inputted text in google
		const ln = txt.slice(5, txt.length).trim();

		window.open(`https://www.google.com/search?client=firefox-b-d&q=${ln}`, new_tab ? '_blank' : '_self');
	} else
		// searches the inputed text in duckduckgo
		window.open(`https://duckduckgo.com/?t=ffab&q=${txt}`, new_tab ? '_blank' : '_self');
}

function startsWith(parent, child) {
	for (let i = 0; i < child.length; i++) if (parent.charAt(i) != child.charAt(i)) return false;
	return true;
}
