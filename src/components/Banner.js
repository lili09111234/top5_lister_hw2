import React from "react";
import EditToolbar from "./EditToolbar";

export default class Banner extends React.Component {
    render() {
        const { title, closeCallback, undoCallback, redoCallback} = this.props;
        return (
            <div id="top5-banner">
                {title}
                <EditToolbar
                    currentList={this.props.currentList}
                    sessionstack={this.props.sessionstack}
                    sessionstackpoint={this.props.sessionstackpoint}
                    redoCallback={redoCallback}
                    undoCallback={undoCallback}
                    closeCallback={closeCallback}
                />
            </div>
        );
    }
}