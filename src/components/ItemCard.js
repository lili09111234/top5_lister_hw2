import React from "react";

export default class ItemCard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            text: this.props.item,
            editActive: this.props.editActive,
        }
    }
    handleToggleEdit = (event) => {
        this.setState({
            editActive: !this.state.editActive
        });
    }
    handleClick = (event) => {
        this.setState({ text: this.props.item });
        this.handleToggleEdit(event);
    }
    handleUpdate = (event) => {
        this.setState({ text: event.target.value });
    }
    handleKeyPress = (event) => {
        if (event.code === "Enter") {
            this.handleBlur();
        }
    }
    handleBlur = () => {
        let key = this.props.id;
        let textValue = this.state.text;
        this.props.renameItemCallback(key, textValue);
        this.handleToggleEdit();
    }

    handleonHover = () => {
        this.props.hoverCallback(this.props.id);
    }

    handledragend = () => {
        this.props.dragendCallback(this.props.id);
    }

    render() {
        const { id, item } = this.props;
       
        if (this.state.editActive) {
            return (
                <input
                    id={"Item-" + id}
                    className={'top5-item'}
                    type='text'
                    onKeyPress={this.handleKeyPress}
                    onBlur={this.handleBlur}
                    onChange={this.handleUpdate}
                    defaultValue={item}
                />)
        }
        else {
            return (
                <div
                    id={'Item'+id}
                    draggable='true'
                    onDragOver={this.handleonHover}
                    onDragEnd={this.handledragend}
                    onClick ={this.handleClick}
                    className={'top5-item'}                    
                >
                    {item}
                </div>
            );
        }
    }
}