import React from "react";
import ItemCard from "./ItemCard";

export default class Workspace extends React.Component {
   
   
   render() {
       const { currentList, renameItemCallback, hoverCallback, dragendCallback} = this.props;
       
        if(currentList!=null){
            return (
                <div id="top5-workspace">
                    <div id="workspace-edit">
                        <div id="edit-numbering">
                            <div className="item-number">1.</div>
                            <div className="item-number">2.</div>
                            <div className="item-number">3.</div>
                            <div className="item-number">4.</div>
                            <div className="item-number">5.</div>
                        </div>
                        <div id="edit-items">
                            <ItemCard
                                id={0}
                                key={0}
                                editActive={false}
                                hoverCallback={hoverCallback}
                                item={currentList.items[0]}
                                renameItemCallback={renameItemCallback}
                                dragendCallback={dragendCallback}
                        />
                            <ItemCard
                                id={1}
                                key={1}
                                editActive={false}
                                item={currentList.items[1]}
                                hoverCallback={hoverCallback}
                                renameItemCallback={renameItemCallback}
                                dragendCallback={dragendCallback}
                        />
                            <ItemCard
                                id={2}
                                key={2}
                                hoverCallback={hoverCallback}
                                editActive={false}
                                item={currentList.items[2]}
                                renameItemCallback={renameItemCallback}
                                dragendCallback={dragendCallback}
                        />
                            <ItemCard
                                id={3}
                                hoverCallback={hoverCallback}
                                editActive={false}
                                key={3}
                                item={currentList.items[3]}
                                renameItemCallback={renameItemCallback}
                                dragendCallback={dragendCallback}
                        />
                            <ItemCard
                                id={4}
                                hoverCallback={hoverCallback}
                                editActive={false}
                                key={4}
                                item={currentList.items[4]}
                                renameItemCallback={renameItemCallback}
                                dragendCallback={dragendCallback}
                        />
                            
                        </div>
                    </div>
                </div>
            )
        }
        else{
            return (
                <div id="top5-workspace">
                    <div id="workspace-edit">
                        <div id="edit-numbering">
                            <div className="item-number">1.</div>
                            <div className="item-number">2.</div>
                            <div className="item-number">3.</div>
                            <div className="item-number">4.</div>
                            <div className="item-number">5.</div>
                        </div>
                        <div id="edit-items">
                        </div>
                    </div>
                </div>
                )
        }
    }
}