import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './Main.css';
import { withRouter } from './withRouter.js';
import Schedule from './Main_button_component/schedule';
import Profile from './Main_button_component/profile';
import Map from './Main_button_component/map';
import { statScheduleUpdate } from './statUpdater/statUpdateFrontend.js';
import { statBackendUpdate } from './statUpdater/statUpdateBackend.js';
import FriendList from './friendList';
import MainEvent from './Main_button_component/mainEvent';
import main_bg from '../backend/background/main.jpeg';
import Event from './Event';


function statUpdateFromFrontend(res) {
    document.getElementById("gpa").innerText = res.gpa;
    document.getElementById("sports").innerText = res.sports;
    document.getElementById("happiness").innerText = res.happiness;
    document.getElementById("money").innerText = res.money;      
    document.getElementById("_id").innerText = res.user;
    document.getElementById("stamina").innerText = res.stamina;
    document.getElementById("sem").innerText = res.sem;
    document.getElementById("year").innerText = res.year;
}


class Main extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            popUpBar : "",
            stat : null,
            location : "main",
        };

        this.userLogout = this.userLogout.bind(this);
        this.popFriendLlist = this.popFriendLlist.bind(this);
        this.popMessageBox = this.popMessageBox.bind(this);
        this.handleSchedulePlan = this.handleSchedulePlan.bind(this);
        this.checkRefreshAndUpdate = this.checkRefreshAndUpdate.bind(this);
        this.popMainEvent = this.popMainEvent.bind(this);
        this.handlePopClose = this.handlePopClose.bind(this);
        this.handleLocation = this.handleLocation.bind(this);

    }
 
    handleLocation(location){
        this.setState({location: location});
    }

    popFriendLlist() {
        console.log("pop friend list");
        this.setState({popUpBar : "friend"});
        console.log(this.state.stat._id)
    }

    popMessageBox() {
        alert(this.state.schedulePop)
        console.log("pop message box");
        this.setState({popUpBar : "message"});
    }

    popMainEvent() {
        console.log("pop mainEvent");
        this.setState({popUpBar : "mainEvent"});
    }

    handlePopClose() {
        this.setState({popUpBar : ""});
    }

    statUpdateFromBackend(ID) {
        fetch(process.env.REACT_APP_BASE_URL + "/stat/retrieve", {
        method: "POST",
        headers: new Headers({
            "Content-Type": 'application/json',
            "Accept": 'application/json',
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
            "Access-Control-Allow-Credentials": true,
        }),
        body: JSON.stringify({
            userId: ID
            })
        })
        .then((res) => res.json())
        .then((res) => {
            console.log(res);
            this.setState({
                stat: res
            });
            statUpdateFromFrontend(res);
        })  
    }

    componentDidMount() {
        this.checkRefreshAndUpdate();
    }
    
    async checkRefreshAndUpdate() {
        if (window.sessionStorage.getItem("isLoggedIn")) {
            await this.props.handleSessionRefresh();
        }
        this.statUpdateFromBackend(this.props.userId);
    }

    popUp(option) {
        console.log("current Pop-up: ", this.state.popUpBar);
        if (option === "profile")
            return (
                <div className="mainPopUp">
                    <div id="shadowLayer"></div>
                    <button className="closeButton" onClick={() => {this.setState({popUpBar : ""})}}>x</button>
                    <div className="popUp">
                        <Profile stat={this.state.stat} />
                    </div>
                </div>

            )
        if (option === "map"){
            return (
                <div className="mainPopUp">
                    <div id="shadowLayer"></div>
                    <button className="closeButton" onClick={() => {this.setState({popUpBar : ""})}}>x</button>
                    <div className="popUp">
                        <Map handleLocation = {this.handleLocation} handlePopClose = {this.handlePopClose}/>
                    </div>
                </div>
            )
        }
        if (option === "logout"){
            return (
                <div className="mainPopUp">
                    <div id="shadowLayer"></div>
                    <div className="popUp" id="logout">
                        <h4>Are you sure to log out?</h4>
                        <br></br>
                        <div className="d-flex justify-content-around">
                            <button className="btn btn-success" onClick={this.userLogout}>Yes</button>
                            <button className="btn btn-success" onClick={() => {this.setState({popUpBar : ""})}}>No</button>
                        </div>
                    </div>
                </div>
            )
        }

        if (option === "schedule"){
            return (
                <div className="mainPopUp">
                    <div id="shadowLayer"></div>
                    <button className="closeButton" onClick={() => {this.setState({popUpBar : ""})}}>x</button>
                    <div className="popUp">
                        <Schedule popMainEvent = {this.popMainEvent} handleSchedulePlan={this.handleSchedulePlan}/>
                    </div>
                </div>
            )
        }

        if (option === "mainEvent"){
            return (
                <div className="mainPopUp">
                    <div id="shadowLayer"></div>
                    <div className="popUp">
                        <MainEvent handlePopClose = {this.handlePopClose}/>
                    </div>
                </div>
            )
        }

        if (option === "friend"){
            return (
                <div className="mainPopUp">
                    <div id="shadowLayer"></div>
                    <button className="closeButton" onClick={() => {this.setState({popUpBar : ""})}}>x</button>
                    <div className="popUp">
                        <FriendList stat = {this.state.stat}/>
                    </div>
                </div>
            )
        }
        
        else {
            return 
        }

    }

    leftComponent(){
        console.log(this.state.location);
        if (this.state.location === "main"){
            return (
                <div className="split left" style={{backgroundImage: `url(${main_bg})`}}>
                    <h2>Welcome to CU Simulator!</h2>
                    <button className="btn btn-success" onClick={() => this.setState({popUpBar : "schedule"})}>Open schedule</button>
                </div>
            )
        }
        else {
            return (
                <div className="split left">
                    <Event location = {this.state.location} handleLocation = {this.handleLocation}/>
                </div>
                
            )
        }
    }

    async handleSchedulePlan(plan){
        this.setState({popUpBar : ""});
        console.log(plan);
        await new Promise(resolve => setTimeout(resolve, 1));
        let newStat = this.state.stat;
        console.log("Before: ", newStat);
        newStat = statScheduleUpdate(newStat,plan);
        console.log("After: ", newStat);
        await new Promise(resolve => setTimeout(resolve, 1));
        statBackendUpdate(newStat);
        this.setState({
            stat: newStat
        })
        statUpdateFromFrontend(newStat);
        return;
    }


    async userLogout() {
        await fetch(process.env.REACT_APP_BASE_URL + "/logout", {
            method: "POST",
            headers: new Headers({
                "Content-Type": 'application/json',
                "Accept": 'application/json',
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
                "Access-Control-Allow-Credentials": true,
            }),
            body: JSON.stringify({
                username: this.props.username
            }),
        })
        .then((res) => res.json())
        .then((res) => {
            console.log(res.logoutMsg);
            this.props.handleLogout();
            this.props.navigate("../");
        })
    }

    render() {
        return (
            <div id="main">

                <div>
                    {this.leftComponent()}
                </div>

                <div className="split right-top">
                    <StatDisplay stat={this.state.stat} />
                </div>

                <div className="split right-bot d-flex flex-column justify-content-center">
                    <button className="btn btn-success" onClick={this.popFriendLlist}>Friend List</button>
                    <button className="btn btn-success" onClick={() => this.setState({popUpBar : "profile"})}>Check profile</button>
                    <button className="btn btn-success" onClick={this.popMessageBox}>Message box</button>
                    <button className="btn btn-success" onClick={() => this.setState({popUpBar : "map"})}>Explore CUHK!</button>
                    <button className="btn btn-success" onClick={() => this.setState({popUpBar : "logout"})}>Logout</button>
                </div>

                {this.popUp(this.state.popUpBar)}

            </div>

        )
    }
}


class StatDisplay extends React.Component {
    render(){
        return (
            <div className="container-fluid">
                <div className = "row">
                    <section id="statusList" className = "col-sm-3 col-lg-3 col-xl-3">

                        <table>

                        <thead>
                            <tr>
                                <th scope="col">Statistics</th>
                                <th scope="col"></th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr><td>User id: </td>
                                <td id="_id"/></tr>
                            <tr><td>GPA: </td>
                                <td id="gpa"/></tr>
                            <tr><td>Sports: </td>
                                <td id="sports"/></tr>
                            <tr><td>Happiness: </td>
                                <td id="happiness"/></tr>
                            <tr><td>Money: </td>
                                <td id="money"/></tr>
                            <tr><td>Stamina: </td>
                                <td id="stamina"/></tr>
                            <tr><td>Semester: </td>
                                <td>Year <span id= "year"/> sem <span id= "sem"/></td></tr>
                        </tbody>

                        </table>
                    </section>
                </div>
            </div>
        )
    }
}

export default withRouter(Main);
