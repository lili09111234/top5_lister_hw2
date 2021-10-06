import React from "react";

export default class EditToolbar extends React.Component {
    render() {
        const { closeCallback, undoCallback, redoCallback } = this.props
        let sessionstack = this.props.sessionstack;
        let reallenght;
        if (sessionstack !== []) {
            reallenght = sessionstack.length;
        }
        if (this.props.currentList != null && this.props.sessionstackpoint !== 0 && reallenght - 1 <= this.props.sessionstackpoint) {
            console.log(this.props.currentList);
            console.log(this.havelist);
            return (
                <div id="edit-toolbar">
                    <div
                        id='undo-button'
                        className={"top5-button"}
                        onClick={undoCallback}
                    >
                        &#x21B6;
                    </div>
                    <div
                        id='redo-button'
                        className="top5-button-disabled"
                    >
                        &#x21B7;
                    </div>
                    <div
                        id='close-button'
                        className="top5-button"
                        onClick={closeCallback}
                    >
                        &#x24E7;
                    </div>
                </div>
            )
        }
        else if (this.props.currentList != null && this.props.sessionstackpoint === 0 && reallenght - 1 > this.props.sessionstackpoint) {
            console.log(this.props.currentList);
            console.log(this.havelist);
            return (
                <div id="edit-toolbar">
                    <div
                        id='undo-button'
                        className={"top5-button-disabled"}
                    >
                        &#x21B6;
                    </div>
                    <div
                        id='redo-button'
                        className="top5-button"
                        onClick={redoCallback}
                    >
                        &#x21B7;
                    </div>
                    <div
                        id='close-button'
                        className="top5-button"
                        onClick={closeCallback}
                    >
                        &#x24E7;
                    </div>
                </div>
            )
        }
        else if (this.props.currentList != null && this.props.sessionstackpoint !== 0 && reallenght-1 > this.props.sessionstackpoint) {
            console.log(this.props.currentList);
            console.log(this.havelist);
            return (
                <div id="edit-toolbar">
                    <div
                        id='undo-button'
                        className={"top5-button"}
                        onClick={undoCallback}
                    >
                        &#x21B6;
                    </div>
                    <div
                        id='redo-button'
                        className="top5-button"
                        onClick={redoCallback}
                    >
                        &#x21B7;
                    </div>
                    <div
                        id='close-button'
                        className="top5-button"
                        onClick={closeCallback}
                    >
                        &#x24E7;
                    </div>
                </div>
            )
        }
        else {
            return (
                <div id="edit-toolbar">
                    <div
                        id='undo-button'
                        className={"top5-button-disabled"}
                        
                    >
                        &#x21B6;
                    </div>
                    <div
                        id='redo-button'
                        className="top5-button-disabled"
                        
                    >
                        &#x21B7;
                    </div>
                    <div
                        id='close-button'
                        className="top5-button-disabled"
                        
                    >
                        &#x24E7;
                    </div>
                </div>
            )
        }
    }
}