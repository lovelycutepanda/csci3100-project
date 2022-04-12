import React from "react";
import 'bootstrap/dist/css/bootstrap.css';
import Profile from "../Main_button_component/profile";
import { statRetrievebyId } from "../statUpdater/statRetrievebyId";
import ChangePassword from "../SignInPage/ChangePassword";
import Loading from "../Loader";

class ShowUsers extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userList: [],
            popUpBar: "",
            targetStatistic: "",
            target: null,
            overflow: 1,
            loading: true
        }

        this.getUserList = this.getUserList.bind(this);
        this.displayUserList = this.displayUserList.bind(this);
        this.resetUserPassword = this.resetUserPassword.bind(this);
        this.handleInnerPopClose = this.handleInnerPopClose.bind(this);
        this.popUp = this.popUp.bind(this);
    }

    componentDidMount() {
        this.getUserList();
    }

    async getUserList() {
        await fetch(process.env.REACT_APP_BASE_URL + "/admin/getusers", {
            method: "GET",
            headers: new Headers({
                "Content-Type": 'application/json',
                "Accept": 'application/json',
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
                "Access-Control-Allow-Credentials": true,
            }),
        })
            .then((res) => res.json())
            .then((res) => {
                this.setState({ userList: res.userList, loading: false });
            });
    }

    displayUserList() {
        //const userList = this.state.userList;
        if (this.state.userList.length !== 0) {
            return (
                <table id="userTable" className="table table-striped">
                    <thead>
                        <tr>
                            <th scope="col">User ID</th>
                            <th scope="col">Username</th>
                            <th scope="col">Display Name</th>
                            <th scope="col">Email</th>
                        </tr>
                    </thead>
                    <tbody>

                        {this.state.userList.map((data) => {
                            return (
                                <tr key={data._id} onClick={async () => { await this.showUserProfile(data); this.props.setOverflow(0); }} style={{ cursor: "pointer" }}>
                                    <th scope="row">{data.userId}</th>
                                    <td>{data.username}</td>
                                    <td>{data.displayName}</td>
                                    <td>{data.email}</td>
                                    <td><button class="btn btn-secondary btn-sm" onClick={(e) => { this.resetUserPassword(e, data); this.props.setOverflow(0); }}>Reset Password</button></td>
                                </tr>

                            );
                        })}
                    </tbody>
                </table >

            );
        }
    }


    async showUserProfile(data) {
        this.setState({ loading: true });
        const stat = await statRetrievebyId(data._id);
        this.setState({ popUpBar: "profile", targetStatistic: stat, target: data, loading: false });
    }

    resetUserPassword(e, data) {
        e.stopPropagation()
        this.setState({ popUpBar: "resetPassword", target: data });
    }

    setOverflow(val) {
        this.setState({ overflow: val });
    }

    handleInnerPopClose() {
        this.setState({ popUpBar: "" });
    }


    popUp() {
        if (this.state.popUpBar === "profile") {
            return (
                <div>
                    <div id="shadowLayer"></div>
                    <button className="closeButton" onClick={() => { this.setState({ popUpBar: "" }); this.props.setOverflow(1); }}>x</button>
                    <div className="popUp">
                        <Profile stat={this.state.targetStatistic} displayName={this.state.target.displayName} username={this.state.target.username} friend={true} />
                    </div>
                </div>
            );
        }
        else if (this.state.popUpBar === "resetPassword") {
            return (
                <div>
                    <div id="shadowLayer"></div>
                    <div className="popUp" style={{ width: "auto", height: "auto" }}>
                        <ChangePassword id={this.state.target._id} handlePopClose={this.handleInnerPopClose} setOverflow={this.props.setOverflow} loginPage={false} />
                    </div>
                </div>
            );
        }
        return;
    }


    render() {
        require('./ShowUsers.css');
        return (
            <div className="showUsers">
                {this.state.loading ? <Loading /> : <h2 id="title">Users</h2>}
                <div>
                    {this.displayUserList()}
                </div>
                <div>
                    {this.popUp()}
                </div>

            </div>

        )

    }
}

export default ShowUsers;
