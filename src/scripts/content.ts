// tslint:disable:no-console

import "../styles/base.scss";

import { MakeSuggestionMessage, Message } from "./messages";
import { Popup } from "./popup";

const popup: Popup = new Popup();

const lastPointer: WebKitPoint = { x: 0, y: 0 };

popup.start(document.body, "Suggested Edit");

// const p = new Popup();

// document.getElementById("greeting").appendChild(btn);

// import * as app from "./app";

// function filterElements(doc: Element, predicate: (element: Element) => boolean): Element[] {
//   const elements: Element[] = [];

//   const filter: NodeFilter = {
//     acceptNode: (el: Element) => {
//       return (predicate(el)) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
//     },
//   };

//   const walker = document.createTreeWalker(doc, NodeFilter.SHOW_ELEMENT, filter, false);

//   while (walker.nextNode()) {
//     elements.push(walker.currentNode as Element);
//   }

//   return elements;
// }

// function startEdit() {
//   const mouseElement: Element = document.elementFromPoint(lastPointer.x, lastPointer.y);

//   // console.log(mouseElement.textContent);

//   // console.log(mouseElement.childNodes.length);

//   const sel = window.getSelection().toString();

//   if (sel === "") {
//     throw new Error("Enjoy this TBD error message");
//   }

//   // const walker = document.createTreeWalker(mouseElement, NodeFilter.SHOW_ELEMENT, undefined, false);

//   // while (walker.nextNode()) {
//   //   console.log(walker.currentNode);
//   // }

//   const ff = filterElements(
//     mouseElement,
//     ((el) => !!el && !!el.textContent && el.textContent.indexOf(sel) > -1),
//   );

//   console.log(ff);

//   // const textNodes = filterTextNodes(
//   //   document.body,
//   //   ((n) => !!n && !!n.textContent && n.textContent.indexOf(sel) > -1),
//   // );

//   // if (textNodes.length === 1) {
//   //   console.log(textNodes);
//   // } else {
//   //   alert("Select a sufficient amount of text from a single element.");
//   // }
// }

document.addEventListener("pointermove", (evt) => {
  lastPointer.x = evt.x;
  lastPointer.y = evt.y;
});

function sendMessage(message: Message, responseCallback?: (response: any) => void): void {
  chrome.runtime.sendMessage(message, responseCallback);
}

interface NodeFilterResponse {
  status: "OK" | "TOO_MANY";
  selectedNode?: Node;
}

function filterNodes(prent: Node, predicate: (n: Node) => boolean): Node[] {
  const containing: Node[] = [];

  function doFind(node: Node) {
    if (predicate(node)) {
      containing.push(node);
    }
    if (node.hasChildNodes) {
      for (let i = 0; i < node.childNodes.length; i++) {
        doFind(node.childNodes.item(i));
      }
    }
  }

  doFind(prent);
  return containing;
}

function findNodeWithText(selectionText: string, prent: Node): NodeFilterResponse {
  const found = filterNodes(prent,
    (node) =>
      node.nodeName === "#text"
      && !!node.nodeValue
      && node.nodeValue.indexOf(selectionText) > -1);

  return found.length === 1 ? { status: "OK", selectedNode: found[0] } : { status: "TOO_MANY" };
}

function prototypicalFunction(msg: MakeSuggestionMessage) {
  const parts = [
    msg.original.slice(0, msg.selectionStart),
    msg.suggestedText,
    msg.original.slice(msg.selectionStart + msg.selectionLength),
  ];
  console.log(parts.join("<->"));
}

chrome.runtime.onMessage.addListener((msg: Message, _sender, sendResponse) => {
  if (msg.type === "START_SUGGESTION") {

    const sel = findNodeWithText(msg.selectionText, document);
    if (sel.status === "OK") {
      popup.run(msg.selectionText, (suggestedText) => {
        const original = (!!sel.selectedNode && sel.selectedNode.textContent) || "";
        const selectionStart = original.indexOf(msg.selectionText);
        const makeSuggestionMessage: MakeSuggestionMessage = {
          href: window.location.href,
          original,
          selectionLength: msg.selectionText.length,
          selectionStart,
          suggestedText,
          type: "MAKE_SUGGESTION",
        };
        sendMessage(makeSuggestionMessage, sendResponse);
        prototypicalFunction(makeSuggestionMessage);
      });
    } else {
      alert("Please select a medium-sized piece of text in a single element.");
    }

  }
});
