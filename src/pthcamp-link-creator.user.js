// ==UserScript==
// @name         PTH pthcamp Link Creator
// @namespace    http://savagecore.eu/
// @version      0.1.3
// @description  Generate pthcamp command and copy to clipboard
// @author       SavageCore

// @include    https://bandcamp.com/download?from=collection*
// @include    http*://bandcamp.com/download?id*

// @downloadURL	 https://github.com/SavageCore/pthcamp-link-creator/raw/master/src/pthcamp-link-creator.user.js
// @grant        GM_setClipboard

// ==/UserScript==

/*	global document, GM_setClipboard	*/

(function () {
	'use strict';
	var pageData = document.getElementById('pagedata').getAttribute('data-blob');
	pageData = JSON.parse(pageData);
	var releaseDate = new Date(pageData.digital_items[0].release_date);
	var downloadLinkElement = document.getElementsByClassName('download-title')[0];
	var artist = pageData.digital_items[0].artist;
	var title = pageData.digital_items[0].title;
	var year = releaseDate.getFullYear();
	var command = 'pthcamp "' + artist + '" "' + title + '" ' + year + ' ';
	var linkElement;

	new MutationObserver(function (mutations) { // eslint-disable-line no-undef
		mutations.some(function (mutation) {
			if (mutation.type === 'attributes' && mutation.attributeName === 'href') {
				var downloadLink = mutation.target.href;
				command += '"' + downloadLink + '"';
				linkElement.setAttribute('style', 'color:#0687F5;cursor:pointer;display:inherit');
				return true;
			}

			return false;
		});
	}).observe(downloadLinkElement, {
		attributes: true,
		attributeFilter: ['href'],
		attributeOldValue: true,
		characterData: false,
		characterDataOldValue: false,
		childList: false,
		subtree: true
	});

	var target = document.getElementsByClassName('download')[0];

	target.insertAdjacentHTML('afterend', '<p id="scCopyToClipboard">Copy pthcamp command</p>');

	linkElement = document.getElementById('scCopyToClipboard');
	linkElement.setAttribute('style', 'display: none;');

	linkElement.onmouseover = function () {
		linkElement.style['text-decoration'] = 'underline';
	};

	linkElement.onmouseout = function () {
		linkElement.style['text-decoration'] = 'none';
	};

	linkElement.addEventListener('click', function () {
		GM_setClipboard(command, 'text'); // eslint-disable-line new-cap
		var originalText = linkElement.innerText;
		linkElement.innerText = 'Copied!';
		setTimeout(function () {
			linkElement.innerText = originalText;
		}, 2000);
	}, false);
})();
