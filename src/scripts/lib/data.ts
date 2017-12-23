import * as messages from './messages';

export async function getForHref(href: string): Promise<messages.MakeSuggestionMessage[]> {

	const testers: messages.MakeSuggestionMessage[] = [
		{
			context:
				'The interesting thing about diff algorithms is that they’re a mix of computer\nscience and human factors. There are many equally good diffs between two files,\njudging them by the length of the edit sequence, and choosing between them\nrequires an algorithm that can best match people’s intuition about how their\ncode has changed.',
			elementPath: [
				['BODY', 1],
				['DIV', 0],
				['DIV', 1],
				['DIV', 0],
				['DIV', 0],
				['ARTICLE', 0],
				['DIV', 1],
				['P', 2],
			],
			href:
				'https://blog.jcoglan.com/2017/03/22/myers-diff-in-linear-space-theory/',
			selectedText: 'intuition',
			selectionStart: 284,
			status: 'TEST',
			suggestedText: 'gut feel',
			textNodeIndex: 0,
			type: 'MAKE_SUGGESTION',
		},
		{
			context:
				'And indeed, if you try running these two code snippets through our previous\nMyers implementation, this is exactly what you get. However, when you ask Git to\ncompare these versions, here’s what happens:',
			elementPath: [
				['BODY', 1],
				['DIV', 0],
				['DIV', 1],
				['DIV', 0],
				['DIV', 0],
				['ARTICLE', 0],
				['DIV', 1],
				['P', 9],
			],
			href:
				'https://blog.jcoglan.com/2017/03/22/myers-diff-in-linear-space-theory/',
			selectedText: 'exactly',
			selectionStart: 106,
			status: 'TEST',
			suggestedText: 'precisely',
			textNodeIndex: 0,
			type: 'MAKE_SUGGESTION',
		},
		{
			context: 'poor quality',
			elementPath: [
				['BODY', 1],
				['DIV', 0],
				['DIV', 1],
				['DIV', 0],
				['DIV', 0],
				['ARTICLE', 0],
				['DIV', 1],
				['P', 11],
				['EM', 1],
			],
			href:
				'https://blog.jcoglan.com/2017/03/22/myers-diff-in-linear-space-theory/',
			selectedText: 'poor quality',
			selectionStart: 0,
			status: 'TEST',
			suggestedText: 'shitty',
			textNodeIndex: 0,
			type: 'MAKE_SUGGESTION',
		},
		{
			context: 'by James Coglan',
			elementPath: [
				['BODY', 1],
				['DIV', 0],
				['HEADER', 0],
				['HGROUP', 1],
				['H2', 1],
			],
			href:
				'https://blog.jcoglan.com/2017/03/22/myers-diff-in-linear-space-theory/',
			selectedText: 'Coglan',
			selectionStart: 9,
			status: 'TEST',
			suggestedText: 'Cooglan',
			textNodeIndex: 0,
			type: 'MAKE_SUGGESTION',
		},
		{
			context:
				'TypeScript is a typed superset of JavaScript that compiles to plain JavaScript. I have used it\n\t\t\t\t',
			elementPath: [
				['BODY', 1],
				['BFAM-ROOT', 0],
				['MAIN', 1],
				['BFAM-GARY', 1],
				['BFAM-OVERVIEW', 1],
				['DIV', 0],
				['SECTION', 0],
				['ARTICLE', 1],
				['P', 1],
			],
			href: 'https://bortosky.com/gary/overview',
			selectedText: 'compiles',
			selectionStart: 50,
			status: 'TEST',
			suggestedText: 'changed compiles',
			textNodeIndex: 0,
			type: 'MAKE_SUGGESTION',
		},
		{
			context: 'Areas of Interest',
			elementPath: [
				['BODY', 1],
				['BFAM-ROOT', 0],
				['MAIN', 1],
				['BFAM-GARY', 1],
				['BFAM-OVERVIEW', 1],
				['DIV', 0],
				['SECTION', 0],
				['H1', 0],
			],
			href: 'https://bortosky.com/gary/overview',
			selectedText: 'Interest',
			selectionStart: 9,
			status: 'TEST',
			suggestedText: 'changed Interest',
			textNodeIndex: 0,
			type: 'MAKE_SUGGESTION',
		},
		{
			context:
				'TypeScript is a typed superset of JavaScript that compiles to plain JavaScript. I have used it\n\t\t\t\t',
			elementPath: [
				['BODY', 1],
				['BFAM-ROOT', 0],
				['MAIN', 1],
				['BFAM-GARY', 1],
				['BFAM-OVERVIEW', 1],
				['DIV', 0],
				['SECTION', 0],
				['ARTICLE', 1],
				['P', 1],
			],
			href: 'https://bortosky.com/gary/overview',
			selectedText: 'used',
			selectionStart: 87,
			status: 'TEST',
			suggestedText: 'changed used',
			textNodeIndex: 0,
			type: 'MAKE_SUGGESTION',
		},
		{
			context:
				"The Web's scaffolding tool for modern webapps. I have dabbled with creating my own generators and have contributed to existing ones.",
			elementPath: [
				['BODY', 1],
				['BFAM-ROOT', 0],
				['MAIN', 1],
				['BFAM-GARY', 1],
				['BFAM-OVERVIEW', 1],
				['DIV', 0],
				['SECTION', 0],
				['ARTICLE', 5],
				['P', 1],
			],
			href: 'https://bortosky.com/gary/overview',
			selectedText: 'webapps',
			selectionStart: 38,
			status: 'TEST',
			suggestedText: 'changed webapps',
			textNodeIndex: 0,
			type: 'MAKE_SUGGESTION',
		},
		{
			context:
				"The Web's scaffolding tool for modern webapps. I have dabbled with creating my own generators and have contributed to existing ones.",
			elementPath: [
				['BODY', 1],
				['BFAM-ROOT', 0],
				['MAIN', 1],
				['BFAM-GARY', 1],
				['BFAM-OVERVIEW', 1],
				['DIV', 0],
				['SECTION', 0],
				['ARTICLE', 5],
				['P', 1],
			],
			href: 'https://bortosky.com/gary/overview',
			selectedText: 'scaffolding',
			selectionStart: 10,
			status: 'TEST',
			suggestedText: 'changed scaffolding',
			textNodeIndex: 0,
			type: 'MAKE_SUGGESTION',
		},
	];

	return testers.filter(t => t.href === href);
}