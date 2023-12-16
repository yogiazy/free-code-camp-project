// app.js
!function () {
    "use strict";
    marked.setOptions({
        breaks: !0,
        highlight: function (e) {
            return Prism.highlight(e, Prism.languages.javascript, "javascript");
        }
    });
    const e = new marked.Renderer;
    e.link = function (e, t, a) {
        return `<a target="_blank" href="${e}">${a}</a>`;
    };

    class MarkdownPreviewer extends React.Component {
        constructor(e) {
            super(e);
            this.state = {
                markdown: initialMarkdown,
                editorMaximized: false,
                previewMaximized: false
            };
            this.handleChange = this.handleChange.bind(this);
            this.handleEditorMaximize = this.handleEditorMaximize.bind(this);
            this.handlePreviewMaximize = this.handlePreviewMaximize.bind(this);
        }

        handleChange(e) {
            this.setState({
                markdown: e.target.value
            });
        }

        handleEditorMaximize() {
            this.setState({
                editorMaximized: !this.state.editorMaximized
            });
        }

        handlePreviewMaximize() {
            this.setState({
                previewMaximized: !this.state.previewMaximized
            });
        }

        render() {
            const editorClass = this.state.editorMaximized ? "editorWrap maximized" : "editorWrap";
            const previewClass = this.state.previewMaximized ? "previewWrap maximized" : "previewWrap";

            return (
                <div>
                    <div className={editorClass}>
                        <Toolbar
                            icon={this.state.editorMaximized ? "fa fa-compress" : "fa fa-arrows-alt"}
                            onClick={this.handleEditorMaximize}
                            text="Editor"
                        />
                        <Editor markdown={this.state.markdown} onChange={this.handleChange} />
                    </div>
                    <div className="converter"></div>
                    <div className={previewClass}>
                        <Toolbar
                            icon={this.state.previewMaximized ? "fa fa-compress" : "fa fa-arrows-alt"}
                            onClick={this.handlePreviewMaximize}
                            text="Previewer"
                        />
                        <Previewer markdown={this.state.markdown} />
                    </div>
                </div>
            );
        }
    }

    const Toolbar = (props) => (
        <div className="toolbar">
            <i className="fa fa-circle" title="no-stack-dub-sack"></i>
            {props.text}
            <i className={props.icon} onClick={props.onClick}></i>
        </div>
    );

    const Editor = (props) => (
        <textarea
            id="editor"
            onChange={props.onChange}
            type="text"
            value={props.markdown}
        />
    );

    const Previewer = (props) => (
        <div
            dangerouslySetInnerHTML={{
                __html: marked(props.markdown, {
                    renderer: e
                })
            }}
            id="preview"
        />
    );

    const initialMarkdown = "# Welcome to my React Markdown Previewer!\n\n## This is a sub-heading...\n### And here's some other cool stuff:\n\nHeres some code, `<div></div>`, between 2 backticks.\n\n```\n// this is multi-line code:\n\nfunction anotherExample(firstLine, lastLine) {\n  if (firstLine == '```' && lastLine == '```') {\n    return multiLineCode;\n  }\n}\n```\n\nYou can also make text **bold**... whoa!\nOr _italic_.\nOr... wait for it... **_both!_**\nAnd feel free to go crazy ~~crossing stuff out~~.\n\nThere's also [links](https://www.freecodecamp.org), and\n> Block Quotes!\n\nAnd if you want to get really crazy, even tables:\n\nWild Header | Crazy Header | Another Header?\n------------ | ------------- | -------------\nYour content can | be here, and it | can be here....\nAnd here. | Okay. | I think we get it.\n\n- And of course there are lists.\n  - Some are bulleted.\n     - With different indentation levels.\n        - That look like this.\n\n\n1. And there are numbered lists too.\n1. Use just 1s if you want!\n1. And last but not least, let's not forget embedded images:\n\n![freeCodeCamp Logo](https://cdn.freecodecamp.org/testable-projects-fcc/images/fcc_secondary.svg)\n";

    ReactDOM.render(<MarkdownPreviewer />, document.getElementById("root"));
}();