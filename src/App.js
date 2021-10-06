import React from 'react';
import './App.css';

// IMPORT DATA MANAGEMENT AND TRANSACTION STUFF
import DBManager from './db/DBManager';

// THESE ARE OUR REACT COMPONENTS
import DeleteModal from './components/DeleteModal';
import Banner from './components/Banner.js'
import Sidebar from './components/Sidebar.js'
import Workspace from './components/Workspace.js';
import Statusbar from './components/Statusbar.js'

class App extends React.Component {
    constructor(props) {
        super(props);

        // THIS WILL TALK TO LOCAL STORAGE
        this.db = new DBManager();

        // GET THE SESSION DATA FROM OUR DATA MANAGER
        let loadedSessionData = this.db.queryGetSessionData();

        // SETUP THE INITIAL STATE
        this.state = {
            currentList : null,
            sessionData: loadedSessionData,
            cureenthover: null,
            tobedeletednamepair: null,
            sessionstack: [],
            sessionstackpoint: -1
        }
    }
    sortKeyNamePairsByName = (keyNamePairs) => {
        keyNamePairs.sort((keyPair1, keyPair2) => {
            // GET THE LISTS
            return keyPair1.name.localeCompare(keyPair2.name);
        });
    }
    // THIS FUNCTION BEGINS THE PROCESS OF CREATING A NEW LIST
    createNewList = () => {
        // FIRST FIGURE OUT WHAT THE NEW LIST'S KEY AND NAME WILL BE
        let newKey = this.state.sessionData.nextKey;
        let newName = "Untitled" + newKey;

        // MAKE THE NEW LIST
        let newList = {
            key: newKey,
            name: newName,
            items: ["?", "?", "?", "?", "?"]
        };

        // MAKE THE KEY,NAME OBJECT SO WE CAN KEEP IT IN OUR
        // SESSION DATA SO IT WILL BE IN OUR LIST OF LISTS
        let newKeyNamePair = { "key": newKey, "name": newName };
        let updatedPairs = [...this.state.sessionData.keyNamePairs, newKeyNamePair];
        this.sortKeyNamePairsByName(updatedPairs);

        // CHANGE THE APP STATE SO THAT IT THE CURRENT LIST IS
        // THIS NEW LIST AND UPDATE THE SESSION DATA SO THAT THE
        // NEXT LIST CAN BE MADE AS WELL. NOTE, THIS setState WILL
        // FORCE A CALL TO render, BUT THIS UPDATE IS ASYNCHRONOUS,
        // SO ANY AFTER EFFECTS THAT NEED TO USE THIS UPDATED STATE
        // SHOULD BE DONE VIA ITS CALLBACK
        this.setState(prevState => ({
            currentList: newList,
            sessionData: {
                nextKey: prevState.sessionData.nextKey + 1,
                counter: prevState.sessionData.counter + 1,
                keyNamePairs: updatedPairs
            }
        }), () => {
            // PUTTING THIS NEW LIST IN PERMANENT STORAGE
            // IS AN AFTER EFFECT
            this.db.mutationCreateList(newList);
            this.db.mutationUpdateSessionData(this.state.sessionData);
        });
    }
    renameList = (key, newName) => {
        let newKeyNamePairs = [...this.state.sessionData.keyNamePairs];
        // NOW GO THROUGH THE ARRAY AND FIND THE ONE TO RENAME
        for (let i = 0; i < newKeyNamePairs.length; i++) {
            let pair = newKeyNamePairs[i];
            if (pair.key === key) {
                pair.name = newName;
            }
        }
        this.sortKeyNamePairsByName(newKeyNamePairs);

        // WE MAY HAVE TO RENAME THE currentList
        let currentList = this.state.currentList;
        if (currentList.key === key) {
            currentList.name = newName;
        }

        this.setState(prevState => ({
            currentList: prevState.currentList,
            sessionData: {
                nextKey: prevState.sessionData.nextKey,
                counter: prevState.sessionData.counter,
                keyNamePairs: newKeyNamePairs
            }
        }), () => {
            // AN AFTER EFFECT IS THAT WE NEED TO MAKE SURE
            // THE TRANSACTION STACK IS CLEARED
            let list = this.db.queryGetList(key);
            list.name = newName;
            this.db.mutationUpdateList(list);
            this.db.mutationUpdateSessionData(this.state.sessionData);
        });
    }
    // THIS FUNCTION BEGINS THE PROCESS OF LOADING A LIST FOR EDITING
    click = (key) => {
        
        this.setState(prevState => ({
            sessionstackpoint: -1,
            sessionstack: []
        }), () => {
            this.loadList(key);
        });
    }
    loadList = (key) => {
        let newCurrentList = this.db.queryGetList(key);
        let sessionstack = this.state.sessionstack;
        let newlist = JSON.parse(JSON.stringify(newCurrentList));
        if (this.state.sessionstackpoint === -1) {
            sessionstack.push(newlist);
            this.setState(prevState => ({
                sessionstack: sessionstack,
                sessionstackpoint: 0,
                currentList: newCurrentList,
                sessionData: prevState.sessionData
            }), () => {
                // ANY AFTER EFFECTS?
            })
        }
        else { 
        this.setState(prevState => ({
            currentList: newCurrentList,
            sessionData: prevState.sessionData,
        }), () => {
            // ANY AFTER EFFECTS?
        });
    }
    }
    // THIS FUNCTION BEGINS THE PROCESS OF CLOSING THE CURRENT LIST
    closeCurrentList = () => {
        
        this.setState(prevState => ({
            currentList: null,
            listKeyPairMarkedForDeletion : prevState.listKeyPairMarkedForDeletion,
            sessionData: this.state.sessionData,
            sessionstack: [],
            sessionstackpoint: -1
        }), () => {
            // ANY AFTER EFFECTS?
            this.db.mutationUpdateSessionData(this.state.sessionData);
        });
    }
    deleteList = (namepair) => {
        // SOMEHOW YOU ARE GOING TO HAVE TO FIGURE OUT
        // WHICH LIST IT IS THAT THE USER WANTS TO
        // DELETE AND MAKE THAT CONNECTION SO THAT THE
        // NAME PROPERLY DISPLAYS INSIDE THE MODAL
        this.setState({ tobedeletednamepair: namepair})
        this.showDeleteListModal();
    }
    // THIS FUNCTION SHOWS THE MODAL FOR PROMPTING THE USER
    // TO SEE IF THEY REALLY WANT TO DELETE THE LIST
    showDeleteListModal() {
        let modal = document.getElementById("delete-modal");
        modal.classList.add("is-visible");
    }
    // THIS FUNCTION IS FOR HIDING THE MODAL
    hideDeleteListModal() {
        let modal = document.getElementById("delete-modal");
        modal.classList.remove("is-visible");
    }

    renameItem = (key, newName) => {
        let currentList = this.state.currentList;
        currentList.items[key] = newName;
        let sessions = this.state.sessionstack;
       
        
        let actuallist = JSON.parse(JSON.stringify(this.state.currentList));
        sessions.push(actuallist);
        sessions.splice(this.state.sessionstackpoint, sessions.length - this.state.sessionstackpoint - 2);
        this.setState(prevState => ({
            sessionstackpoint: this.state.sessionstackpoint+1,
            sessionstack: sessions,
           currentList: currentList
        }), () => {
           // AN AFTER EFFECT IS THAT WE NEED TO MAKE SURE
           // THE TRANSACTION STACK IS CLEARED
           let index=key;
           let list = this.db.queryGetList(currentList.key);
           list.items[index] = newName;
           this.db.mutationUpdateList(list);
           this.db.mutationUpdateSessionData(this.state.sessionData);
       });
    }

    hover = (name) => {
        this.setState({
            cureenthover: name
        });
    }

    release = (name) => {

        let currentList = this.state.currentList;
        let temp = currentList.items[name];
        let idex = this.state.cureenthover;
        currentList.items.splice(name, 1);
        currentList.items.splice(idex, 0, temp);
        let sessions = this.state.sessionstack;
        
        let actuallist = JSON.parse(JSON.stringify(this.state.currentList));
        sessions.push(actuallist);
        sessions.splice(this.state.sessionstackpoint, sessions.length - this.state.sessionstackpoint -2);
        this.setState(prevState => ({
            sessionstackpoint: this.state.sessionstackpoint + 1,
            sessionstack: sessions,
            currentList: currentList
        }), () => {
            // AN AFTER EFFECT IS THAT WE NEED TO MAKE SURE
            // THE TRANSACTION STACK IS CLEARED
                let index1 = name;
                let index2 = this.state.cureenthover;
                let list = this.db.queryGetList(currentList.key);
                let temp = list.items[index1];
                list.items.splice(name, 1);
                list.items.splice(index2, 0, temp);
            this.db.mutationUpdateList(list);
            this.db.mutationUpdateSessionData(this.state.sessionData);
        });
    }

    delete = () => {
        this.hideDeleteListModal();
        if (this.state.currentList!=null && this.state.currentList.name === this.state.tobedeletednamepair.name) {
            this.setState(prevState => ({
                currentList: null,
                sessionstack: [],
                sessionstackpoint: -1
            }), () => {
                // AN AFTER EFFECT IS THAT WE NEED TO MAKE SURE
                // THE TRANSACTION STACK IS CLEARED
                let key = this.state.tobedeletednamepair.key;
                let keyNamePair = this.state.sessionData.keyNamePairs;
                for (let i = 0; i < keyNamePair.length; i++) {

                    let target = keyNamePair[i];

                    if (target.key === key)
                        this.state.sessionData.keyNamePairs.splice(i, 1);
                }
                this.state.sessionData.counter -= 1;
                this.db.delete(key);
                this.db.mutationUpdateSessionData(this.state.sessionData);
                this.forceUpdate();
            });
        }
        else {
            this.setState(prevState => ({
                currentList: this.state.currentList
            }), () => {
                // AN AFTER EFFECT IS THAT WE NEED TO MAKE SURE
                // THE TRANSACTION STACK IS CLEARED
                let key = this.state.tobedeletednamepair.key;
                let keyNamePair = this.state.sessionData.keyNamePairs;
                for (let i = 0; i < keyNamePair.length; i++) {

                    let target = keyNamePair[i];

                    if (target.key === key)
                        this.state.sessionData.keyNamePairs.splice(i, 1);
                }
                this.state.sessionData.counter -= 1;
                this.db.delete(key);
                this.db.mutationUpdateSessionData(this.state.sessionData);
                this.forceUpdate();
            });
        }

    }

    redo = ()=>{
        let currentList = this.state.currentList;
        currentList = this.state.sessionstack[this.state.sessionstackpoint + 1];
        this.setState(prevState => ({
            sessionstackpoint: this.state.sessionstackpoint + 1,
            currentList: currentList
        }), () => {
            // AN AFTER EFFECT IS THAT WE NEED TO MAKE SURE
            // THE TRANSACTION STACK IS CLEARED


            this.db.mutationUpdateList(currentList);
            this.db.mutationUpdateSessionData(this.state.sessionData);
        });
    }

    undo = () => {
        let currentList = this.state.currentList;
        currentList = this.state.sessionstack[this.state.sessionstackpoint - 1];
        
        this.setState(prevState => ({
            sessionstackpoint: this.state.sessionstackpoint - 1,
            currentList: currentList
        }), () => {
            // AN AFTER EFFECT IS THAT WE NEED TO MAKE SURE
            // THE TRANSACTION STACK IS CLEARED
            

            this.db.mutationUpdateList(currentList);
            this.db.mutationUpdateSessionData(this.state.sessionData);
        });
    }

    
    render() {
        return (
            <div id="app-root">
                <Banner 
                    title='Top 5 Lister'
                    closeCallback={this.closeCurrentList}
                    redoCallback={this.redo}
                    undoCallback={this.undo}
                    currentList={this.state.currentList}
                    sessionstack={this.state.sessionstack}
                    sessionstackpoint={this.state.sessionstackpoint}
                />
                <Sidebar
                    heading='Your Lists'
                    currentList={this.state.currentList}
                    keyNamePairs={this.state.sessionData.keyNamePairs}
                    createNewListCallback={this.createNewList}
                    deleteListCallback={this.deleteList}
                    loadListCallback={this.click}
                    renameListCallback={this.renameList}
                />
                <Workspace
                    currentList={this.state.currentList}
                    renameItemCallback={this.renameItem}
                    hoverCallback={this.hover}
                    dragendCallback={this.release}
                />
                <Statusbar 
                    currentList={this.state.currentList} />
                <DeleteModal
                    listKeyPair={this.state.tobedeletednamepair}
                    deleteCallback={this.delete}
                    hideDeleteListModalCallback={this.hideDeleteListModal}
                />
            </div>
        );
    }
}

export default App;
