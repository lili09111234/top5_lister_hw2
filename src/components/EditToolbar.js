import React from "react";

export default class EditToolbar extends React.Component {
    render() {
        const { closeCallback, undoCallback, redoCallback } = this.props
        if (this.props.currentList!=null) {
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
                        onClick={undoCallback}
                    >
                        &#x21B6;
                    </div>
                    <div
                        id='redo-button'
                        className="top5-button-disabled"
                        onClick={redoCallback}
                    >
                        &#x21B7;
                    </div>
                    <div
                        id='close-button'
                        className="top5-button-disabled"
                        onClick={closeCallback}
                    >
                        &#x24E7;
                    </div>
                </div>
            )
        }
    }
}